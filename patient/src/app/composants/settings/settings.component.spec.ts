import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsComponent ],
      providers: [ PrescriptionsManagerService ],
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should do nothing if window.confirm returns false', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component.prescriptionManager, 'clearAll');

    component.deleteAll();
    expect(component.prescriptionManager.clearAll).not.toHaveBeenCalled();
  })

  it('should call clearAll() if window.confirm returns true', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component.prescriptionManager, 'clearAll');

    component.deleteAll();
    expect(component.prescriptionManager.clearAll).toHaveBeenCalled();
  })

});
