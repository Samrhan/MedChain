import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutNoteComponent } from './ajout-note.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {PrescriptionManagerService} from "../Services/PrescriptionManager/prescription-manager.service";

describe('AjoutNoteComponent', () => {
  let component: AjoutNoteComponent;
  let fixture: ComponentFixture<AjoutNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutNoteComponent ],
      providers: [
        PrescriptionManagerService
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
