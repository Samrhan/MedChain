import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {AuthenticatorService} from "../service/authenticator.service";
import {PrescriptionService} from "../service/prescription.service";


@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.css']
})
export class PrescriptionsComponent implements OnInit, AfterViewInit {
  prescriptionForm: FormGroup;
  consult = false; // Mode vue 0 = edition, 1 = consultation

  modalRef: BsModalRef | undefined;
  @ViewChild('renewForm')
  template: TemplateRef<any> | undefined;


  constructor(public fb: FormBuilder, public modalService: BsModalService, public authenticatorService: AuthenticatorService, public prescriptionService: PrescriptionService) {
    this.prescriptionForm = this.initForm()
  }

  getMaxDate(): string {
    let date = new Date()
    let maxDate = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate())
    return maxDate.toISOString().substr(0, 10)
  }

  initForm(): FormGroup {
    // Default renewals max date : Now + 1 Year

    let maxDate = this.getMaxDate()
    return this.fb.group({
      patient_email: new FormControl('', [Validators.required, Validators.email]),
      secu: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(15), // Numéro de sécu = 13 chiffres + 2 clé = 15 char
        Validators.maxLength(15),
        this.validSocial])),
      renewals: new FormControl(1),
      max_date: new FormControl(maxDate),
      prescription: this.fb.array([this.newPrescription()])
    })
  };

  openModal() {
    if (this.template)
      this.modalRef = this.modalService.show(this.template);
  }

  closeModal() {
    this.modalService.hide()
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  prescriptions(): FormArray {
    return this.prescriptionForm.get('prescription') as FormArray;
  }

  newPrescription(): FormGroup {
    return this.fb.group({
      drug_name: new FormControl('', [Validators.required]),
      dose: new FormControl('', [Validators.required]),
      duration: new FormControl(null, [Validators.required]),
      takes_per_day: new FormControl(null, [Validators.required]),
    });
  }

  addPrescription(i: number): void {
    if (i === this.prescriptions().length - 1)
      this.prescriptions().push(this.newPrescription());
  }

  removePrescription(i: number): void {
    if (i !== 0)
      this.prescriptions().removeAt(i);
  }

  invalid_input(name: string, validation: any) {
    let control: AbstractControl | null = this.prescriptionForm.get(name);
    if (control) {
      return control.hasError(validation) && (control.dirty || control.touched)
    } else {
      return true;
    }
  }

  validSocial(control: AbstractControl): ValidationErrors | null {
    return (/^[0-9]{15}$/.test(control.value) || control.value.length !== 15) ? null : {invalidSocial: {value: control.value}};
  }

  toggleConsult(): void {
    // Enzo m'engueule pas stp, ça sert juste à suppr tous les champs vide
    while (this.prescriptionForm.value.prescription.slice(-1)[0].drug_name.trim() === '' && this.prescriptions().length > 1)
      this.removePrescription(this.prescriptions().length - 1)
    this.consult = true
  }

  confirm(): void {
    if (!this.consult) { // Si on est pas en mode consult, on passe en mode consult
      this.toggleConsult()
      return
    }

    this.prescriptionService.post_prescription(this.prescriptionForm.value).subscribe(() => {
      this.consult = false;
      this.prescriptionForm.reset({
        patient_email: '',
        secu: '',
        renewals: 1,
        max_date: this.getMaxDate(),
        prescription: this.fb.array([this.newPrescription()])
      })
    }, error => {
      alert(error)
    })
  }

  disconnect() {
    this.authenticatorService.disconnect()
  }

}
