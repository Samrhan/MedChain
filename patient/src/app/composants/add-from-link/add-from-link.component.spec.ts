import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFromLinkComponent } from './add-from-link.component';

describe('AddFromLinkComponent', () => {
  let component: AddFromLinkComponent;
  let fixture: ComponentFixture<AddFromLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFromLinkComponent ]
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
