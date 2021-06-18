import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AuthenticatorService} from "../Services/Authenticator/authenticator.service";
import {Router} from "@angular/router";
import {PrescriptionManagerService} from "../Services/PrescriptionManager/prescription-manager.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-scan-ordonnance',
  templateUrl: './scan-ordonnance.component.html',
  styleUrls: ['./scan-ordonnance.component.css']
})
export class ScanOrdonnanceComponent implements OnInit {

  prescription_form: FormGroup = this.formBuilder.group({
    prescription_id: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(36), // UUID = 32 hex + 4 dash = 36 char
      Validators.maxLength(36),
      this.validUUID
    ])),
    prescription_password: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(36), // Idem
      Validators.maxLength(36),
      this.validUUID
    ])),
    patient_social_security: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(15), // Numéro de sécu = 13 chiffres + 2 clé = 15 char
      Validators.maxLength(15),
      this.validSocial
    ]))
  });

  validation_messages = {
    prescription_id: [
      {type: 'required', message: 'Identifiant de la prescription requis'},
      {type: 'minlength', message: 'Ce champ doit comporter 36 caractères'},
      {type: 'maxlength', message: 'Ce champ doit comporter 36 caractères'},
      {type: 'invalidUUID', message: "Le format n'est pas valide (caractères acceptés : chiffres, tirets (-), et lettres entre A et F)"},
    ],
    prescription_password: [
      {type: 'required', message: 'Mot de passe de la prescription requis'},
      {type: 'minlength', message: 'Ce champ doit comporter 36 caractères'},
      {type: 'maxlength', message: 'Ce champ doit comporter 36 caractères'},
      {type: 'invalidUUID', message: "Le format n'est pas valide (caractères acceptés : chiffres, tirets (-), et lettres entre A et F)"},
    ],
    patient_social_security: [
      {type: 'required', message: 'Numéro de sécurité sociale du patient requis'},
      {type: 'minlength', message: 'Ce champ doit comporter 15 caractères'},
      {type: 'maxlength', message: 'Ce champ doit comporter 15 caractères'},
      {type: 'invalidSocial', message: 'Ce champ doit être un nombre'},
    ]
  };

  modalRef: BsModalRef | undefined;
  @ViewChild('doesNotExistModal')
  private template: TemplateRef<any> | undefined;

  constructor(
    private authenticatorService: AuthenticatorService,
    private formBuilder: FormBuilder,
    public router: Router,
    private prescriptionManagerService: PrescriptionManagerService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.prescriptionManagerService.clear_cache();
  }

  disconnect(){
    this.authenticatorService.disconnect()
  }

  /**
   * Retourne un ValidationErrors si le champ fait la bonne taille mais que le format n'est pas valide
   * Le format n'est pas valide s'il ne sagit pas d'un nombre à 15 chiffres
   * @param control
   */
  validSocial(control: AbstractControl): ValidationErrors | null {
    return ( /^[0-9]{15}$/.test(control.value) || control.value.length !== 15 ) ? null : {invalidSocial: {value: control.value}};
  }

  /**
   * Retourne un ValidationErrors si le champ fait la bonne taille mais que le format n'est pas valide
   * Le format valide est xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx avec les x des chiffres en hexadécimal
   * @param control
   */
  validUUID(control: AbstractControl): ValidationErrors | null {
    return ( /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(control.value) || control.value.length !== 36 ) ? null : {invalidUUID: {value: control.value}};
  }

  invalid_input(name: string, validation: any) {
    let control: AbstractControl | null = this.prescription_form.get(name);
    if (control){
      return control.hasError(validation) && (control.dirty || control.touched)
    } else {
      return true;
    }
  }

  fetch_prescription(){
    let temp = this.prescription_form.value;
    this.prescriptionManagerService.clear_cache();
    this.prescriptionManagerService.fetch_prescription(temp.prescription_id, temp.prescription_password, temp.patient_social_security).subscribe(
      (status) => {
        switch (status){
          case 200:
            this.router.navigate(['/consult_prescription']);
            break;
          case 400:
            this.showDoesNotExist();
            break;
        }
      }
    );
  }

  showDoesNotExist(): void {
    if (this.template){
      this.modalRef = this.modalService.show(this.template);
      this.prescription_form.get('prescription_id')?.setValue("");
      this.prescription_form.get('prescription_password')?.setValue("");
    }
  }

}
