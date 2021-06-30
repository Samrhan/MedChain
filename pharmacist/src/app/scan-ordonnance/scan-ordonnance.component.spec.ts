import {ComponentFixture, TestBed} from '@angular/core/testing';

import { ScanOrdonnanceComponent } from './scan-ordonnance.component';
import {PrescriptionManagerService} from "../Services/PrescriptionManager/prescription-manager.service";
import {ModalModule} from "ngx-bootstrap/modal";
import {AbstractControl, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {of} from "rxjs";
import {NavbarComponent} from "../navbar/navbar.component";

describe('ScanOrdonnanceComponent', () => {
  let component: ScanOrdonnanceComponent;
  let fixture: ComponentFixture<ScanOrdonnanceComponent>;
  let prescription_manager: PrescriptionManagerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanOrdonnanceComponent, NavbarComponent ],
      providers: [
        PrescriptionManagerService,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanOrdonnanceComponent);
    prescription_manager = TestBed.inject(PrescriptionManagerService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Utilisation correcte des services
  it('should reset PrescriptionManager cache', () => {
    expect(prescription_manager.get_prescription_cache()).toBeNull();
  })

  it('should call fetch_prescription() correctly and handle error values as expected', () => {
    // Cas où tout va bien
    spyOn(component.router, 'navigate');
    let spy = spyOn(prescription_manager, 'fetch_prescription').and.returnValue(of(200));
    let expected = {
      prescription_id: '99853f1f-8390-4977-9e03-5fb42b8f4d7e',
      prescription_password: '6492225e-36d9-4b33-97e6-cff4fecc10ca',
      patient_social_security: '000000000000000'
    };

    component.prescription_form.setValue(expected);

    component.fetch_prescription();

    expect(component.router.navigate).toHaveBeenCalledWith(['/display_ordonnance']);
    expect(prescription_manager.fetch_prescription).toHaveBeenCalledWith(expected.prescription_id, expected.prescription_password, expected.patient_social_security);

    // Cas erreur
    spy.and.returnValue(of(400));
    spyOn(component, 'showDoesNotExist');
    component.fetch_prescription();

    expect(component.showDoesNotExist).toHaveBeenCalled();
    expect(prescription_manager.fetch_prescription).toHaveBeenCalledWith(expected.prescription_id, expected.prescription_password, expected.patient_social_security);
  })

  // Méthodes de validation
  /**
   * On ne teste ici que des chaines de 15 caractères car la méthode ignore les autres cas
   */
  it('should recognize a valid social security number', () => {
    let social = {value : "000000000000000"}; // 15 char - valide
    expect(component.validSocial(social as AbstractControl)).toBeNull();

    social = {value : "00000000000000a"}; // 15 char avec une lettre - invalide
    let expected = {invalidSocial: social}
    expect(component.validSocial(social as AbstractControl)).toEqual(expected);

    social = {value : "00000000000000"}; // 14 char - ignoré (marqué comme valide)
    expect(component.validSocial(social as AbstractControl)).toBeNull();

    social = {value : "0000000000000000"}; // 16 char - ignoré (marqué comme valide)
    expect(component.validSocial(social as AbstractControl)).toBeNull();
  })

  /**
   * On ne teste ici que des chaines de 36 caractères car la méthode ignore les autres cas
   */
  it('should recognize a valid UUIDv4', () => {
    let UUID = {value : "99853f1f-8390-4977-9e03-5fb42b8f4d7e"}; // 36 char - valide
    expect(component.validUUID(UUID as AbstractControl)).toBeNull();

    UUID = {value : "99853f1f-8390-4977-9e03-5fb42b8f4d7Z"}; // 36 char avec une lettre non acceptée - invalide
    let expected = {invalidUUID: UUID}
    expect(component.validUUID(UUID as AbstractControl)).toEqual(expected);

    UUID = {value : "99853f1f8-390-4977-9e03-5fb42b8f4d7Z"}; // 36 char avec un tiret au mauvais endroit - invalide
    expected = {invalidUUID: UUID}
    expect(component.validUUID(UUID as AbstractControl)).toEqual(expected);

    UUID = {value : "99853f1f-8390-0977-9e03-5fb42b8f4d7e"}; // 36 char avec un mauvais numéro de version - invalide
    expected = {invalidUUID: UUID}
    expect(component.validUUID(UUID as AbstractControl)).toEqual(expected);

    UUID = {value : "99853f1f-8390-4977-9e03-5fb42b8f4d7"}; // 35 char - ignoré (marqué comme valide)
    expect(component.validUUID(UUID as AbstractControl)).toBeNull();

    UUID = {value : "99853f1f-8390-4977-9e03-5fb42b8f4d7ee"}; // 37 char - ignoré (marqué comme valide)
    expect(component.validUUID(UUID as AbstractControl)).toBeNull();
  })

  // Misc
  it('should have reference to modal', () => {
    expect(component.template).toBeTruthy();
  })

  it('should not display modal by default', () => {
    let nativeElement: HTMLElement = fixture.nativeElement;
    let modal: HTMLElement | null = nativeElement.querySelector("#doesNotExistModalContent");
    expect(modal).toBeFalsy();
  })

  it('showDoesNotExist() should display modal', () => {
    spyOn(component.modalService, 'show');

    component.showDoesNotExist();
    fixture.detectChanges();

    expect(component.template).toBeTruthy();
    expect(component.modalService.show).toHaveBeenCalled();
  })

  it('showDoesNotExist() should not display modal if template does not exist', () => {
    component.template = undefined;
    spyOn(component.modalService, 'show');

    component.showDoesNotExist();
    fixture.detectChanges();

    expect(component.modalService.show).not.toHaveBeenCalled();
  })

  it('showDoesNotExist() should reset form fields', () => {
    component.prescription_form.get('prescription_id')?.setValue("test");
    component.prescription_form.get('prescription_password')?.setValue("test");

    component.showDoesNotExist();
    fixture.detectChanges();

    expect(component.prescription_form.get('prescription_id')?.value).toBeFalsy();
    expect(component.prescription_form.get('prescription_password')?.value).toBeFalsy();
  })

  it('invalid_input should return true if no control is present', () => {
    expect(component.invalid_input("test", "required")).toBeTruthy();
  });
});
