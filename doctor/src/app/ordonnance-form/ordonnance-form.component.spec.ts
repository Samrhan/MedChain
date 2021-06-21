import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdonnanceFormComponent } from './ordonnance-form.component';

describe('OrdonnanceFormComponent', () => {
  let component: OrdonnanceFormComponent;
  let fixture: ComponentFixture<OrdonnanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdonnanceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdonnanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
