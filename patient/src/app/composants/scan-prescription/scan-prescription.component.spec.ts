import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanPrescriptionComponent } from './scan-prescription.component';
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {ZXingScannerComponent, ZXingScannerModule} from "@zxing/ngx-scanner";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

describe('ScanPrescriptionComponent', () => {
  let component: ScanPrescriptionComponent;
  let fixture: ComponentFixture<ScanPrescriptionComponent>;

  let mockPrescriptionsManager = jasmine.createSpyObj(['addPrescription'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanPrescriptionComponent, FaIconComponent, ZXingScannerComponent ],
      providers: [ { provide: PrescriptionsManagerService, useValue: mockPrescriptionsManager } ],
      imports: [ HttpClientTestingModule, RouterTestingModule, ZXingScannerModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('handleQrCodeResult() should properly parse the data', () => {
    // On teste les textes ne contenant pas de /
    component.handleQrCodeResult("");
    expect(component.token).toEqual("")
    expect(component.password).toBeUndefined()
    expect(component.code_found).toBeFalsy()

    component.handleQrCodeResult("a");
    expect(component.token).toEqual("a")
    expect(component.password).toBeUndefined()
    expect(component.code_found).toBeFalsy()

    component.handleQrCodeResult("3c40af08-505c-4e95-b98d-a3751e5d0366");
    expect(component.token).toEqual("3c40af08-505c-4e95-b98d-a3751e5d0366")
    expect(component.password).toBeUndefined()
    expect(component.code_found).toBeFalsy()

    // On teste toutes les combinaisons possibles de chaque côté du /
    let possible = ["", "a", "3c40af08-505c-4e95-b98d-a3751e5d0366"];
    for (let i of possible){
      for (let n of possible){
        component.code_found = false;

        component.handleQrCodeResult(i + "/" + n);
        expect(component.token).toEqual(i)
        expect(component.password).toEqual(n)
        if(i == "3c40af08-505c-4e95-b98d-a3751e5d0366" && i == n){
          expect(component.code_found).toBeTruthy()
        } else {
          expect(component.code_found).toBeFalsy()
        }
      }
    }
  })
});
