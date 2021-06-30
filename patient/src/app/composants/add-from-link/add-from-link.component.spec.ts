import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFromLinkComponent } from './add-from-link.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";

describe('AddFromLinkComponent', () => {
  let component: AddFromLinkComponent;
  let fixture: ComponentFixture<AddFromLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFromLinkComponent ],
      providers: [ PrescriptionsManagerService ],
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
});
