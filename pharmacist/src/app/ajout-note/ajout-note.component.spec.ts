import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutNoteComponent } from './ajout-note.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {PrescriptionManagerService} from "../Services/PrescriptionManager/prescription-manager.service";
import {NavbarComponent} from "../navbar/navbar.component";
import {FormsModule} from "@angular/forms";
import {of, throwError} from "rxjs";

describe('AjoutNoteComponent', () => {
  let component: AjoutNoteComponent;
  let fixture: ComponentFixture<AjoutNoteComponent>;

  let mockPrescriptionService = jasmine.createSpyObj(['post_note', 'patch_note']);

  const content = "foo";

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutNoteComponent, NavbarComponent ],
      providers: [
        { provide: PrescriptionManagerService, useValue: mockPrescriptionService }
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockPrescriptionService.post_note.calls.reset();
    mockPrescriptionService.patch_note.calls.reset();

    component.content = content
    spyOn(component.router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('send_note() should post note and redirect', () => {
    mockPrescriptionService.post_note.and.returnValue(of(true));

    component.send_note();

    expect(mockPrescriptionService.post_note).toHaveBeenCalledWith(content);
    expect(mockPrescriptionService.patch_note).not.toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith(['/display_ordonnance']);
  })

  it('send_note() should patch note and redirect if post fails', () => {
    mockPrescriptionService.post_note.and.returnValue(throwError(''));
    mockPrescriptionService.patch_note.and.returnValue(of(true));

    component.send_note();

    expect(mockPrescriptionService.post_note).toHaveBeenCalledWith(content);
    expect(mockPrescriptionService.patch_note).toHaveBeenCalledWith(content);
    expect(component.router.navigate).toHaveBeenCalledWith(['/display_ordonnance']);
  })

  it('send_note() should alert and redirect if both post and patch fail', () => {
    mockPrescriptionService.post_note.and.returnValue(throwError(''));
    mockPrescriptionService.patch_note.and.returnValue(throwError(''));
    spyOn(window, 'alert');

    component.send_note();

    expect(mockPrescriptionService.post_note).toHaveBeenCalledWith(content);
    expect(mockPrescriptionService.patch_note).toHaveBeenCalledWith(content);
    expect(window.alert).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith(['/display_ordonnance']);
  })
});
