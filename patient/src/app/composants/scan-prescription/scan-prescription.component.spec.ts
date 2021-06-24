import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanPrescriptionComponent } from './scan-prescription.component';

describe('ScanPrescriptionComponent', () => {
  let component: ScanPrescriptionComponent;
  let fixture: ComponentFixture<ScanPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanPrescriptionComponent ]
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
