import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionsComponent} from './prescriptions.component';
import {AbstractControl, FormBuilder} from "@angular/forms";
import {BsModalService} from "ngx-bootstrap/modal";
import {ComponentLoaderFactory} from "ngx-bootstrap/component-loader";
import {PositioningService} from "ngx-bootstrap/positioning";

describe('PrescriptionsComponent', () => {
  let component: PrescriptionsComponent;
  let fixture: ComponentFixture<PrescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrescriptionsComponent],
      providers: [FormBuilder, BsModalService, ComponentLoaderFactory, PositioningService]
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
    expect(nativeElement.querySelector('#prescription-0')).toBeTruthy();
    expect(nativeElement.querySelector('#prescription-1')).toBeFalsy();
  })

  it('should add input line when last line focused', () => {
    const input_el: HTMLElement = fixture.nativeElement.querySelector('#drug_name_0')
    input_el?.focus()
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("#prescription-1")).toBeTruthy();
  })

  it('should not add input line when not last line focused', () => {
    fixture.nativeElement.querySelector('#drug_name_0')?.focus()
    fixture.detectChanges()
    fixture.nativeElement.querySelector('#drug_name_1')?.focus()
    fixture.detectChanges()
    fixture.nativeElement.querySelector('#drug_name_0')?.focus()
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("#prescription-1")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("#prescription-2")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("#prescription-3")).toBeFalsy();
  })

  it('should not display delete button on the first line', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector('#deleteButton0')).toBeFalsy();
  })

  it('should  display delete button on other line', () => {
    fixture.nativeElement.querySelector('#drug_name_0')?.focus()
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
    fixture.nativeElement.querySelector('#drug_name_0')?.focus()
    fixture.detectChanges()
    expect(nativeElement.querySelector('#labelDose1')).toBeFalsy();
    expect(nativeElement.querySelector('#labelDrugName1')).toBeFalsy();
    expect(nativeElement.querySelector('#labelDuration1')).toBeFalsy();
    expect(nativeElement.querySelector('#labelTakesPerDay1')).toBeFalsy();
  })

  it('should delete the right line when delete button touched', () => {
    fixture.nativeElement.querySelector('#drug_name_0')?.focus() // We create two lines
    fixture.detectChanges() // Enzo m'engueule pas stp
    fixture.nativeElement.querySelector('#drug_name_1')?.focus()
    fixture.detectChanges()
    let button = fixture.nativeElement.querySelector('#deleteButton1') // The button to be touched
    let old = component.prescriptions().at(1)
    button?.click()
    fixture.detectChanges()
    expect(old === component.prescriptions().at(1)).toBeFalse()
  })

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
});
