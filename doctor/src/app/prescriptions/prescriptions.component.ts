import {AfterViewInit, Component, OnInit, TemplateRef} from '@angular/core';
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

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.css']
})
export class PrescriptionsComponent implements OnInit, AfterViewInit {
  prescriptionForm: FormGroup;
  modalRef: BsModalRef | undefined;

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    this.prescriptionForm = this.fb.group({
      patient_email: new FormControl('', [Validators.required, Validators.email]),
      secu: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(15), // Numéro de sécu = 13 chiffres + 2 clé = 15 char
        Validators.maxLength(15),
        this.validSocial])),
      renewals: new FormControl(1),
      max_date: new FormControl(new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()).toISOString().substr(0,10)),
      prescription: this.fb.array([this.newPrescription()])
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
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


}
