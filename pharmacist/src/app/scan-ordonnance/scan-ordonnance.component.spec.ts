import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanOrdonnanceComponent } from './scan-ordonnance.component';

describe('ScanOrdonnanceComponent', () => {
  let component: ScanOrdonnanceComponent;
  let fixture: ComponentFixture<ScanOrdonnanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanOrdonnanceComponent ]
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
