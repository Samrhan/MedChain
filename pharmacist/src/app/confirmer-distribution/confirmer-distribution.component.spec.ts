import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmerDistributionComponent } from './confirmer-distribution.component';

describe('ConfirmerDistributionComponent', () => {
  let component: ConfirmerDistributionComponent;
  let fixture: ComponentFixture<ConfirmerDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmerDistributionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmerDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
