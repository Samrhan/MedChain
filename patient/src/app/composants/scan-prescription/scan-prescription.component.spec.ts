import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanPrescriptionComponent } from './scan-prescription.component';
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {ZXingScannerModule} from "@zxing/ngx-scanner";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

describe('ScanPrescriptionComponent', () => {
  let component: ScanPrescriptionComponent;
  let fixture: ComponentFixture<ScanPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanPrescriptionComponent, FaIconComponent ],
      providers: [ PrescriptionsManagerService ],
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
});
