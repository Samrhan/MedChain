import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumSecuPickerComponent } from './num-secu-picker.component';
import { ModalModule } from "ngx-bootstrap/modal";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";
import {AbstractControl, ReactiveFormsModule} from "@angular/forms";
import createSpyObj = jasmine.createSpyObj;

describe('NumSecuPickerComponent', () => {
  let component: NumSecuPickerComponent;
  let fixture: ComponentFixture<NumSecuPickerComponent>;

  let mockPrescriptionsManager = createSpyObj(['setSocial'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumSecuPickerComponent ],
      providers: [
        { provide: PrescriptionsManagerService, useValue: mockPrescriptionsManager }
      ],
      imports: [ ModalModule.forRoot(), HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumSecuPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('openModal() should call modalService.show()', () => {
    spyOn(component.modalService, 'show');

    component.openModal(component.template);
    expect(component.modalService.show).toHaveBeenCalledWith(component.template)
  })

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

  it('invalid_input should return true if no control is present', () => {
    expect(component.invalid_input("test", "required")).toBeTruthy();
  });

  it('saveSocial() should call PrescriptionsManager.setSocial', () => {
    spyOn(component.router, 'navigate');
    component.social_form.get('patient_social_security').setValue('000000000000000');

    component.saveSocial()

    expect(mockPrescriptionsManager.setSocial).toHaveBeenCalledWith('000000000000000');
    expect(component.router.navigate).toHaveBeenCalledWith(['/']);
  })
});
