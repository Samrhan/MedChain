import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayOrdonnanceComponent } from './display-ordonnance.component';

describe('DisplayOrdonnanceComponent', () => {
  let component: DisplayOrdonnanceComponent;
  let fixture: ComponentFixture<DisplayOrdonnanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayOrdonnanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayOrdonnanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
