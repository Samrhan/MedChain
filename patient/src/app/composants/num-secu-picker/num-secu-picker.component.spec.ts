import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumSecuPickerComponent } from './num-secu-picker.component';
import { ModalModule } from "ngx-bootstrap/modal";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";
import {ReactiveFormsModule} from "@angular/forms";

describe('NumSecuPickerComponent', () => {
  let component: NumSecuPickerComponent;
  let fixture: ComponentFixture<NumSecuPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumSecuPickerComponent ],
      providers: [ PrescriptionsManagerService ],
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
});
