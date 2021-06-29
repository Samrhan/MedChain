import { Component, OnInit, TemplateRef } from '@angular/core';

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";
import {Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";

@Component({
  selector: 'app-num-secu-picker',
  templateUrl: './num-secu-picker.component.html',
  styleUrls: ['./num-secu-picker.component.css']
})
export class NumSecuPickerComponent implements OnInit {

  faQuestionCircle = faQuestionCircle

  modalRef: BsModalRef | undefined;

  social_form: FormGroup = this.formBuilder.group({
    patient_social_security: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(15), // Numéro de sécu = 13 chiffres + 2 clé = 15 char
      Validators.maxLength(15),
      this.validSocial
    ]))
  });

  validation_messages = {
    patient_social_security: [
      {type: 'required', message: 'Numéro de sécurité sociale du patient requis'},
      {type: 'minlength', message: 'Ce champ doit comporter 15 caractères'},
      {type: 'maxlength', message: 'Ce champ doit comporter 15 caractères'},
      {type: 'invalidSocial', message: 'Ce champ doit être un nombre'},
    ]
  };

  constructor(
    private modalService: BsModalService,
    private prescriptionManager: PrescriptionsManagerService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    if (!prescriptionManager.isSocialEmpty()){
      router.navigate(['/'])
    }
  }

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }


  validSocial(control: AbstractControl): ValidationErrors | null {
    return ( /^[0-9]{15}$/.test(control.value) || control.value.length !== 15 ) ? null : {invalidSocial: {value: control.value}};
  }

  invalid_input(name: string, validation: any) {
    let control: AbstractControl | null = this.social_form.get(name);
    if (control){
      return control.hasError(validation) && (control.dirty || control.touched)
    } else {
      return true;
    }
  }

  saveSocial() {
    this.prescriptionManager.setSocial(this.social_form.get('patient_social_security')?.value);
    this.router.navigate(['/'])
  }
}
