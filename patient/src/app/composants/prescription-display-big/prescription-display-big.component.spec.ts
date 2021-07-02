import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionDisplayBigComponent } from './prescription-display-big.component';
import {RouterTestingModule} from "@angular/router/testing";
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {BarcodeComponent} from "../barcode/barcode.component";
import {ActivatedRoute} from "@angular/router";

describe('PrescriptionDisplayBigComponent', () => {
  let component: PrescriptionDisplayBigComponent;
  let fixture: ComponentFixture<PrescriptionDisplayBigComponent>;

  const mockPrescriptionsManager = jasmine.createSpyObj(['getAllPrescriptions']);
  let prescriptions = [{
    token: "483472b1-c9d7-4cf3-91c6-42530141c628",
    password: "8d87cb1c-4806-401e-82cf-c3956135cf2d"
  },{
    token: "4ef7b9c8-c94d-4fa6-ae48-ec007eba8dc6",
    password: "8d87cb1c-4806-401e-82cf-c3956135cf2d"
  }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptionDisplayBigComponent, FaIconComponent, BarcodeComponent ],
      providers: [
        { provide: PrescriptionsManagerService, useValue: mockPrescriptionsManager },
        { provide: ActivatedRoute, useValue: {snapshot: {paramMap: {get: () => {return 1;}}}} }
      ],
      imports: [RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockPrescriptionsManager.getAllPrescriptions.calls.reset();
    mockPrescriptionsManager.getAllPrescriptions.and.returnValue(prescriptions);

    fixture = TestBed.createComponent(PrescriptionDisplayBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('parseId() should get the id from the URL', () => {
    expect(component.parseId()).toEqual(1); // Valeur définie dans TestBed.configureTestingModule/providers
  })

  it('getPrescription() should navigate to menu if the prescription does not exist', () => {
    spyOn(component.router, 'navigate');

    component.getPrescription(10);

    expect(component.router.navigate).toHaveBeenCalledWith(['/'])
  })

  it('getPrescription() should store the data of the required prescription', () => {
    spyOn(component.router, 'navigate');

    component.getPrescription(0);

    // Valeurs définies dans les constantes du module de test
    expect(component.code).toEqual("483472b1-c9d7-4cf3-91c6-42530141c628")
    expect(component.password).toEqual("8d87cb1c-4806-401e-82cf-c3956135cf2d")
  })
});
