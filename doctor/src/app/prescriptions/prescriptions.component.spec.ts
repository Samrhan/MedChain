import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {PrescriptionsComponent} from './prescriptions.component';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BsModalService, ModalModule} from "ngx-bootstrap/modal";
import {ComponentLoaderFactory} from "ngx-bootstrap/component-loader";
import {PositioningService} from "ngx-bootstrap/positioning";
import {By} from "@angular/platform-browser";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {of, throwError} from "rxjs";
import {AuthenticatorService} from "../service/authenticator.service";
import {PrescriptionService} from "../service/prescription.service";

describe('PrescriptionsComponent', () => {
  let component: PrescriptionsComponent;
  let fixture: ComponentFixture<PrescriptionsComponent>;

  let mockPrescriptionService = jasmine.createSpyObj(['post_prescription']);
  let mockAuthenticatorService = jasmine.createSpyObj(['disconnect']);


  beforeAll(async () => {
    window.onbeforeunload = () => 'Oh no!';
  })

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrescriptionsComponent],
      providers: [FormBuilder, BsModalService, ComponentLoaderFactory, PositioningService, FormsModule, ReactiveFormsModule,
        {provide: PrescriptionService, useValue: mockPrescriptionService},
        {provide: AuthenticatorService, useValue: mockAuthenticatorService}
        ,
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
    fixture = TestBed.createComponent(PrescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display "email needed" by default', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector('#PatientMailNeeded')).toBeFalsy();
  })

  it('should not display modal by default', () => {
    let nativeElement: HTMLElement = fixture.nativeElement;
    let modal: HTMLElement | null = nativeElement.querySelector("#modal");
    expect(modal).toBeFalsy();
  })

  it('openModal() should display modal', () => {
    spyOn(component.modalService, 'show');

    component.openModal();
    fixture.detectChanges();

    expect(component.template).toBeTruthy();
    expect(component.modalService.show).toHaveBeenCalled();
  })

  it('closeModal() should close modal', () => {
    let nativeElement: HTMLElement = fixture.nativeElement;
    let modal: HTMLElement | null = nativeElement.querySelector("#modal");
    spyOn(component.modalService, 'hide');

    component.openModal();
    component.closeModal();
    fixture.detectChanges();

    expect(modal).toBeFalsy();
    expect(component.modalService.hide).toHaveBeenCalled();
  })

  it('openModal() should not display modal if template does not exist', () => {
    component.template = undefined;
    spyOn(component.modalService, 'show');

    component.openModal();
    fixture.detectChanges();

    expect(component.modalService.show).not.toHaveBeenCalled();
  })

  it('should display "email needed" when touched', () => {
    component.prescriptionForm.get('patient_email')?.markAsTouched();
    fixture.detectChanges();
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#PatientMailNeeded")).toBeTruthy();
  })

  it('should not display "secu needed" by default', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector('#SecuNeeded')).toBeFalsy();
  })

  it('should display "secu needed" when touched', () => {
    component.prescriptionForm.get('secu')?.markAsTouched();
    fixture.detectChanges();
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#SecuNeeded")).toBeTruthy();
  })

  it('should have one input line by default', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector('#prescription0')).toBeTruthy();
    expect(nativeElement.querySelector('#prescription1')).toBeFalsy();
  })

  it('should call addPrescription when focused', fakeAsync(() => {
    spyOn(component, "addPrescription")
    fixture.debugElement.query(By.css('#drugName0')).triggerEventHandler('focus', null)
    tick();
    fixture.detectChanges();
    expect(component.addPrescription).toHaveBeenCalledWith(0);
  }))


  it('should not add input line when not last line focused', () => {
    component.addPrescription(0)
    component.addPrescription(1)
    component.addPrescription(0)
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("#prescription1")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("#prescription2")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("#prescription3")).toBeFalsy();
  })

  it('should not display delete button on the first line', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector('#deleteButton0')).toBeFalsy();
  })

  it('should  display delete button on other line', () => {
    component.addPrescription(0)
    fixture.detectChanges()
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector('#deleteButton1')).toBeTruthy();
  })
  it('should display labels on first line', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector('#labelDose0')).toBeTruthy();
    expect(nativeElement.querySelector('#labelDrugName0')).toBeTruthy();
    expect(nativeElement.querySelector('#labelDuration0')).toBeTruthy();
    expect(nativeElement.querySelector('#labelTakesPerDay0')).toBeTruthy();
  })

  it('should not display labels on others line', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    fixture.nativeElement.querySelector('#drugName0')?.focus()
    fixture.detectChanges()
    expect(nativeElement.querySelector('#labelDose1')).toBeFalsy();
    expect(nativeElement.querySelector('#labelDrugName1')).toBeFalsy();
    expect(nativeElement.querySelector('#labelDuration1')).toBeFalsy();
    expect(nativeElement.querySelector('#labelTakesPerDay1')).toBeFalsy();
  })

  it('should delete the right line when delete button touched', () => {
    component.addPrescription(0)
    component.addPrescription(1)
    fixture.detectChanges()
    let button = fixture.nativeElement.querySelector('#deleteButton1') // The button to be touched
    let old = component.prescriptions().at(1)
    button?.click()
    fixture.detectChanges()
    expect(old === component.prescriptions().at(1)).toBeFalse()
  })

  it('should recognize a valid social security number', () => {
    let social = {value: "000000000000000"}; // 15 char - valide
    expect(component.validSocial(social as AbstractControl)).toBeNull();

    social = {value: "00000000000000a"}; // 15 char avec une lettre - invalide
    let expected = {invalidSocial: social}
    expect(component.validSocial(social as AbstractControl)).toEqual(expected);

    social = {value: "00000000000000"}; // 14 char - ignoré (marqué comme valide)
    expect(component.validSocial(social as AbstractControl)).toBeNull();

    social = {value: "0000000000000000"}; // 16 char - ignoré (marqué comme valide)
    expect(component.validSocial(social as AbstractControl)).toBeNull();
  })

  it('invalid_input should return true if no control is present', () => {
    expect(component.invalid_input("test", "required")).toBeTruthy();
  });

  it('consult mode should be disabled by default', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(component.consult).toBeFalse()
    expect(nativeElement.querySelector('#consultPatientMail')).toBeFalsy();
    expect(nativeElement.querySelector('#consultSecu')).toBeFalsy();
    expect(nativeElement.querySelector('#consultRenew')).toBeFalsy();
    expect(nativeElement.querySelector('#consultDrugName0')).toBeFalsy();
    expect(nativeElement.querySelector('#consultDuration0')).toBeFalsy();
    expect(nativeElement.querySelector('#consultDose0')).toBeFalsy();
    expect(nativeElement.querySelector('#consultTakesPerDay0')).toBeFalsy();
  })

  it("should show text instead of input when consult is true", () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    component.toggleConsult()
    fixture.detectChanges()
    expect(nativeElement.querySelector('#consultPatientMail')).toBeTruthy();
    expect(nativeElement.querySelector('#consultSecu')).toBeTruthy();
    expect(nativeElement.querySelector('#consultRenew')).toBeTruthy();
    expect(nativeElement.querySelector('#consultDrugName0')).toBeTruthy();
    expect(nativeElement.querySelector('#consultDuration0')).toBeTruthy();
    expect(nativeElement.querySelector('#consultDose0')).toBeTruthy();
    expect(nativeElement.querySelector('#consultTakesPerDay0')).toBeTruthy();
    expect(nativeElement.querySelector('#inputPatientMail')).toBeFalsy();
    expect(nativeElement.querySelector('#inputSecu')).toBeFalsy();
    expect(nativeElement.querySelector('#renewBox')).toBeFalsy();
    expect(nativeElement.querySelector('#drugName0')).toBeFalsy();
    expect(nativeElement.querySelector('#dose_0')).toBeFalsy();
    expect(nativeElement.querySelector('#duration_0')).toBeFalsy();
    expect(nativeElement.querySelector('#takes_per_day_0')).toBeFalsy();
  })

  it("should delete empty row, except the first one when confirmed", () => {
    component.addPrescription(0)
    fixture.detectChanges()
    component.confirm()
    expect(component.prescriptions().length).toEqual(1)
  })

  it("should be impossible to delete the first row", () => {
    component.removePrescription(0)
    expect(component.prescriptions().length).toEqual(1)
  })

  it('should empty the form when getting 200', () => {
    mockPrescriptionService.post_prescription.and.returnValue(of({status: 200}));
    spyOn(component.prescriptionForm, 'reset');

    component.consult = true;
    component.confirm();
    expect(component.prescriptionForm.reset).toHaveBeenCalled();
  })

  it('should display alert when getting error', () => {
    spyOn(window, "alert");
    mockPrescriptionService.post_prescription.and.returnValue(throwError({status: 400}));
    component.consult = true;
    component.confirm();
    fixture.detectChanges();

    expect(window.alert).toHaveBeenCalled();
  })

  it('disconnect() should call AuthenticatorService methode', () => {
    component.disconnect();
    expect(mockAuthenticatorService.disconnect).toHaveBeenCalled()
  })

  it('disconnect button should call disconnect method', () => {
    spyOn(component, "disconnect");
    let button = fixture.nativeElement.querySelector('#disconnectButton') // The button to be touched
    button?.click()
    expect(component.disconnect).toHaveBeenCalled();
  })

  it('confirm button should call confirm method', () => {
    spyOn(component, "confirm");
    let button = fixture.nativeElement.querySelector('#confirmButton') // The button to be touched
    button?.click()
    expect(component.confirm).toHaveBeenCalled();
  })

  it('rollback button should set consult false', () => {
    component.consult = true
    fixture.detectChanges()
    let button = fixture.nativeElement.querySelector('#rollbackButton') // The button to be touched
    button?.click()
    expect(component.consult).toBeFalse();
  })
});
