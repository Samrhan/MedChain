import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, FormArray, AbstractControl} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.css']
})
export class PrescriptionsComponent implements OnInit {
  prescriptionForm: FormGroup;
  modalRef: BsModalRef | undefined;


  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    this.prescriptionForm = this.fb.group({
      patient_email: new FormControl('', [Validators.required, Validators.email]),
      secu: new FormControl('', [Validators.required]),
      renewals: new FormControl(1),
      max_date: new FormControl(new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDay())),
      prescription: this.fb.array([])
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit(): void {
  }

  prescriptions(): FormArray {
    return this.prescriptionForm.get('prescription') as FormArray;
  }


  newPrescription(): FormGroup {
    return this.fb.group({
      drug_name: new FormControl('', [Validators.required]),
      dose: new FormControl('', [Validators.required]),
      duration: new FormControl(0, [Validators.required]),
      takes_per_day: new FormControl(0, [Validators.required]),
    });
  }

  addPrescription(): void {
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
}
