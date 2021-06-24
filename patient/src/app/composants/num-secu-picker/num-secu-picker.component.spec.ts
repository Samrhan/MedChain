import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumSecuPickerComponent } from './num-secu-picker.component';

describe('NumSecuPickerComponent', () => {
  let component: NumSecuPickerComponent;
  let fixture: ComponentFixture<NumSecuPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumSecuPickerComponent ]
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
