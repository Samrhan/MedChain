import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanOrdonnanceComponent } from './scan-ordonnance.component';
import {PrescriptionManagerService} from "../Services/PrescriptionManager/prescription-manager.service";
import {ModalModule} from "ngx-bootstrap/modal";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AuthenticatorService} from "../Services/Authenticator/authenticator.service";

describe('ScanOrdonnanceComponent', () => {
  let component: ScanOrdonnanceComponent;
  let fixture: ComponentFixture<ScanOrdonnanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanOrdonnanceComponent ],
      providers: [
        PrescriptionManagerService,
        AuthenticatorService,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        ModalModule.forRoot()
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanOrdonnanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
