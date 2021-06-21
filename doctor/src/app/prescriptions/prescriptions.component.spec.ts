import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionsComponent} from './prescriptions.component';
import {FormBuilder} from "@angular/forms";

describe('PrescriptionsComponent', () => {
  let component: PrescriptionsComponent;
  let fixture: ComponentFixture<PrescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrescriptionsComponent],
      providers: [FormBuilder]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
