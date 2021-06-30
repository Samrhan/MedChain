import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionDisplayBigComponent } from './prescription-display-big.component';
import {RouterTestingModule} from "@angular/router/testing";
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('PrescriptionDisplayBigComponent', () => {
  let component: PrescriptionDisplayBigComponent;
  let fixture: ComponentFixture<PrescriptionDisplayBigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptionDisplayBigComponent ],
      providers: [ PrescriptionsManagerService ],
      imports: [RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionDisplayBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
