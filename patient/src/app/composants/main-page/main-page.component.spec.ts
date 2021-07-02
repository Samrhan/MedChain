import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { MainPageComponent } from './main-page.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";
import {of, throwError} from "rxjs";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {BarcodeComponent} from "../barcode/barcode.component";

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;

  let mockPrescriptionsManager = jasmine.createSpyObj(['getAllPrescriptions', 'getTokenState', 'removePrescription', 'isStorageEmpty']);

  let prescriptions = [{
    token: "483472b1-c9d7-4cf3-91c6-42530141c628",
    password: "8d87cb1c-4806-401e-82cf-c3956135cf2d"
  },{
    token: "4ef7b9c8-c94d-4fa6-ae48-ec007eba8dc6",
    password: "8d87cb1c-4806-401e-82cf-c3956135cf2d"
  }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainPageComponent, FaIconComponent, BarcodeComponent ],
      providers: [
        { provide: PrescriptionsManagerService, useValue: mockPrescriptionsManager }
      ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    localStorage.setItem('current_prescription', "0")

    mockPrescriptionsManager.getAllPrescriptions.calls.reset();
    mockPrescriptionsManager.getTokenState.calls.reset();
    mockPrescriptionsManager.removePrescription.calls.reset();

    mockPrescriptionsManager.getAllPrescriptions.and.returnValue(prescriptions);
    mockPrescriptionsManager.getTokenState.and.returnValue(of({
      max_date: "2100-06-11T22:00:00.000Z",
      uses_left: 1
    }))
    mockPrescriptionsManager.isStorageEmpty.and.returnValue(false);

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getPrescriptionMetadata() should delete old prescription', () => {
    spyOn(component, 'deletePrescription')
    let max_date = new Date((new Date()).setFullYear((new Date).getFullYear() - 1)) // Date actuelle - 1 an
    mockPrescriptionsManager.getTokenState.and.returnValue(of({
      max_date: max_date,
      uses_left: 1
    }))

    component.getPrescriptionMetadata(prescriptions[0]);
    expect(component.deletePrescription).toHaveBeenCalledWith(prescriptions[0].token);
  })

  it('getPrescriptionMetadata() should delete used prescription', () => {
    spyOn(component, 'deletePrescription')
    let max_date = new Date((new Date()).setFullYear((new Date).getFullYear() + 1)) // Date actuelle + 1 an
    mockPrescriptionsManager.getTokenState.and.returnValue(of({
      max_date: max_date,
      uses_left: 0
    }))

    component.getPrescriptionMetadata(prescriptions[0]);
    expect(component.deletePrescription).toHaveBeenCalledWith(prescriptions[0].token);
  })

  it('getPrescriptionMetadata() should delete unknown prescription on 400 and show error message if not already', () => {
    spyOn(window, 'alert');
    spyOn(component, 'deletePrescription')
    mockPrescriptionsManager.getTokenState.and.returnValue(throwError(new HttpResponse({status: 400, statusText: 'bad request'})))
    component.already_shown_error = false;

    component.getPrescriptionMetadata(prescriptions[0]);
    expect(window.alert).toHaveBeenCalled();
    expect(component.deletePrescription).toHaveBeenCalledWith(prescriptions[0].token);
  })

  it('getPrescriptionMetadata() should delete unknown prescription on 400 and not show error message if it has already been displayed', () => {
    spyOn(window, 'alert');
    spyOn(component, 'deletePrescription')
    mockPrescriptionsManager.getTokenState.and.returnValue(throwError(new HttpResponse({status: 400, statusText: 'bad request'})))
    component.already_shown_error = true;

    component.getPrescriptionMetadata(prescriptions[0]);
    expect(window.alert).not.toHaveBeenCalled();
    expect(component.deletePrescription).toHaveBeenCalledWith(prescriptions[0].token);
  })

  it('getPrescriptionMetadata() should ignore unknown prescription on error other than 400', () => {
    spyOn(window, 'alert');
    spyOn(component, 'deletePrescription')
    mockPrescriptionsManager.getTokenState.and.returnValue(throwError(new HttpResponse({status: 401, statusText: 'bad request'})))

    component.getPrescriptionMetadata(prescriptions[0]);
    expect(window.alert).not.toHaveBeenCalled();
    expect(component.deletePrescription).not.toHaveBeenCalled();
  })

  it('getPrescriptionMetadata() should store correct result', () => {
    spyOn(component, 'deletePrescription')
    let max_date = new Date((new Date()).setFullYear((new Date).getFullYear() + 1)) // Date actuelle + 1 an
    let expected = {
      max_date: max_date,
      uses_left: 1
    }
    mockPrescriptionsManager.getTokenState.and.returnValue(of(expected))

    component.getPrescriptionMetadata(prescriptions[0]);
    expect(component.deletePrescription).not.toHaveBeenCalled();
    expect(component.status.get(prescriptions[0].token)).toEqual(expected)
  })

  it('deletePrescription(token) should call the corresponding service method and maintain correct internal state', () => {
    component.deletePrescription('foo');

    expect(mockPrescriptionsManager.removePrescription).toHaveBeenCalledWith('foo');
    expect(component.max_value).toEqual(prescriptions.length - 1)
  })

  it('validateDisplayedPrescriptionId() should reset current prescription to 0 in case it is greater than the total amount of prescriptions', () => {
    component.current_prescription = 100;
    component.max_value = 1;

    component.validateDisplayedPrescriptionId()

    expect(component.current_prescription).toEqual(0)
  })

  it('validateDisplayedPrescriptionId() should not do anything in case current_prescription < max_value', () => {
    component.current_prescription = 1;
    component.max_value = 100;

    component.validateDisplayedPrescriptionId()

    expect(component.current_prescription).toEqual(1)
  })

  it('next_prescription() should not go over the limit', () => {
    component.current_prescription = 2;
    component.max_value = 2;

    component.next_prescription();

    expect(component.current_prescription).toEqual(2);
  })

  it('next_prescription() should increment the current prescription and store that number', () => {
    spyOn(localStorage, "setItem")
    component.current_prescription = 1;
    component.max_value = 2;

    component.next_prescription();

    expect(component.current_prescription).toEqual(2);
    expect(localStorage.setItem).toHaveBeenCalledWith('current_prescription', '2')
  })

  it('prev_prescription() should not go under zero', () => {
    component.current_prescription = 0;

    component.prev_prescription();

    expect(component.current_prescription).toEqual(0);
  })

  it('prev_prescription() should decrement the current prescription and store that number', () => {
    spyOn(localStorage, "setItem")
    component.current_prescription = 1;

    component.prev_prescription();

    expect(component.current_prescription).toEqual(0);
    expect(localStorage.setItem).toHaveBeenCalledWith('current_prescription', '0')
  })

  it('getDate() should return a correctly formated date', () => {
    component.status.set('foo', {max_date: "2021-07-02"})

    expect(component.getDate('foo')).toContain("02/07/2021")
  })

  it('getDate() should return an empty string if no date is found', () => {
    expect(component.getDate('foo')).toEqual("")
  })

  it('getUses() should return a correctly formated string (singular)', () => {
    component.status.set('foo', {uses_left: 1})

    expect(component.getUses('foo')).toEqual("1 Utilisation restante")
  })

  it('getUses() should return a correctly formated string (plural)', () => {
    component.status.set('foo', {uses_left: 5})

    expect(component.getUses('foo')).toEqual("5 Utilisations restantes")
  })

  it('getUses() should return an empty string if no number is found', () => {
    expect(component.getUses('foo')).toEqual("")
  })

  it('swipe() should store the coordinates at the start of a motion', () => {
    let e = {
      changedTouches: [{
        clientX: 0,
        clientY: 0
      }]
    }

    component.swipe(e as unknown as TouchEvent, 'start');
    expect(component.swipeCoord).toEqual([0, 0])
  })

  it('swipe() should call next_prescription() in case the swipe goes from right to left', fakeAsync(() => {
    spyOn(component, 'next_prescription')
    let start = {
      changedTouches: [{
        clientX: 50,
        clientY: 0
      }]
    }
    component.swipe(start as unknown as TouchEvent, 'start');
    tick(200)


    let end = {
      changedTouches: [{
        clientX: 0,
        clientY: 0
      }]
    }
    component.swipe(end as unknown as TouchEvent, 'end');

    expect(component.next_prescription).toHaveBeenCalled()
  }))

  it('swipe() should call prev_prescription() in case the swipe goes from left to right', fakeAsync(() => {
    spyOn(component, 'prev_prescription')
    let start = {
      changedTouches: [{
        clientX: 0,
        clientY: 0
      }]
    }
    component.swipe(start as unknown as TouchEvent, 'start');
    tick(200)


    let end = {
      changedTouches: [{
        clientX: 50,
        clientY: 0
      }]
    }
    component.swipe(end as unknown as TouchEvent, 'end');

    expect(component.prev_prescription).toHaveBeenCalled()
  }))

});
