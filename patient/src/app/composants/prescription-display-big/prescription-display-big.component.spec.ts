import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionDisplayBigComponent } from './prescription-display-big.component';

describe('PrescriptionDisplayBigComponent', () => {
  let component: PrescriptionDisplayBigComponent;
  let fixture: ComponentFixture<PrescriptionDisplayBigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptionDisplayBigComponent ]
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
