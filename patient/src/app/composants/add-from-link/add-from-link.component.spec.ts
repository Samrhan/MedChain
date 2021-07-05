import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { AddFromLinkComponent } from './add-from-link.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";
import createSpyObj = jasmine.createSpyObj;

describe('AddFromLinkComponent', () => {
  let component: AddFromLinkComponent;
  let fixture: ComponentFixture<AddFromLinkComponent>;

  const valid_token = "287c6493-b166-49d9-9b09-d629000f5c9d";
  const valid_password = "8d87cb1c-4806-401e-82cf-c3956135cf2d";

  let mockPrescriptionManager = createSpyObj(['addPrescription'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFromLinkComponent ],
      providers: [
        { provide: PrescriptionsManagerService, useValue: mockPrescriptionManager }
      ],
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFromLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show invalid params alert on invalid route (all invalid)', fakeAsync(() => {
    component.addPrescriptionFromURL({token: "", password: ""});

    tick(50);

    expect(component.showInvalidParams).toBeTruthy()
  }))

  it('should show invalid params alert on invalid route (password invalid)', fakeAsync(() => {
    component.addPrescriptionFromURL({token: valid_token, password: ""});

    tick(50);

    expect(component.showInvalidParams).toBeTruthy()
  }))

  it('should show invalid params alert on invalid route (token invalid)', fakeAsync(() => {
    component.addPrescriptionFromURL({token: "", password: valid_password});

    tick(50);

    expect(component.showInvalidParams).toBeTruthy()
  }))

  it('should add prescription and redirect on correct params', fakeAsync(() => {
    spyOn(component.router, 'navigate')
    let expected = {token: valid_token, password: valid_password}
    component.addPrescriptionFromURL(expected);
    tick(50);

    expect(mockPrescriptionManager.addPrescription).toHaveBeenCalledWith(expected.token, expected.password);
    expect(component.router.navigate).toHaveBeenCalledWith(['/'])
    expect(component.showOk).toBeTruthy()
  }))


  it('should recognize a valid UUIDv4', () => {
    let UUID = "99853f1f-8390-4977-9e03-5fb42b8f4d7e"; // 36 char - valide
    expect(component.validUUID(UUID)).toBeTruthy();

    UUID = "99853f1f-8390-4977-9e03-5fb42b8f4d7Z"; // 36 char avec une lettre non acceptée - invalide
    expect(component.validUUID(UUID)).toBeFalsy();

    UUID = "99853f1f8-390-4977-9e03-5fb42b8f4d7Z"; // 36 char avec un tiret au mauvais endroit - invalide
    expect(component.validUUID(UUID)).toBeFalsy();

    UUID =  "99853f1f-8390-0977-9e03-5fb42b8f4d7e"; // 36 char avec un mauvais numéro de version - invalide
    expect(component.validUUID(UUID)).toBeFalsy();

    UUID = "99853f1f-8390-4977-9e03-5fb42b8f4d7"; // 35 char - invalide
    expect(component.validUUID(UUID)).toBeFalsy();

    UUID = "99853f1f-8390-4977-9e03-5fb42b8f4d7ee"; // 37 char - invalide
    expect(component.validUUID(UUID)).toBeFalsy();
  })
});
