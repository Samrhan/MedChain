import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmerDistributionComponent } from './confirmer-distribution.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {PrescriptionManagerService} from "../Services/PrescriptionManager/prescription-manager.service";
import {NavbarComponent} from "../navbar/navbar.component";
import {TooltipModule} from "ngx-bootstrap/tooltip";
import {of, throwError} from "rxjs";

describe('ConfirmerDistributionComponent', () => {
  let component: ConfirmerDistributionComponent;
  let fixture: ComponentFixture<ConfirmerDistributionComponent>;

  let mockPrescriptionManager = jasmine.createSpyObj(['get_prescription_cache', 'get_note', 'use_prescription'])

  const prescription = {
    "info_ordonnance": {
      "Renouvellements": 1,
      "Date_maximum": "2022-06-11T22:00:00.000Z",
      "Date_prescription": "2021-06-11T22:00:00.000Z",
      "nom_medecin": "Girard",
      "prenom_medecin": "Adrien",
      "Numero": "64",
      "Rue": "Rue des Nations Unies",
      "Ville": "Saint-Benoît",
      "CodePostal": "97470",
      "Telephone": "0145875203",
      "Specialite": "Généraliste"
    },
    "prescription": [
      {
        "Id_prescription": 1,
        "Nom_medicament": "Paracétamol",
        "Dosage": "1000mg",
        "Duree": 5,
        "Prises_par_jour": 2,
        "Id_ordonnance": "483472b1-c9d7-4cf3-91c6-42530141c628"
      },
      {
        "Id_prescription": 2,
        "Nom_medicament": "Imodium",
        "Dosage": "2mg",
        "Duree": 4,
        "Prises_par_jour": 3,
        "Id_ordonnance": "483472b1-c9d7-4cf3-91c6-42530141c628"
      }
    ],
    "notes": [
      {
        "Id_ordonnance": "483472b1-c9d7-4cf3-91c6-42530141c628",
        "Id_pharmacie": 1,
        "Contenu": "a",
        "Date_ecriture": "2021-06-20T22:00:00.000Z"
      }
    ]
  }

  const note = "foobar"

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmerDistributionComponent, NavbarComponent ],
      providers: [
        { provide: PrescriptionManagerService, useValue: mockPrescriptionManager }
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TooltipModule.forRoot()
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockPrescriptionManager.get_prescription_cache.and.returnValue(prescription);
    mockPrescriptionManager.get_note.and.returnValue(note);

    mockPrescriptionManager.get_prescription_cache.calls.reset();
    mockPrescriptionManager.get_note.calls.reset();
    mockPrescriptionManager.use_prescription.calls.reset();

    fixture = TestBed.createComponent(ConfirmerDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill internal fields', () => {
    expect(component.prescription).toEqual(prescription.prescription);
    expect(component.note).toEqual(note);
  })

  it('tooltip_text() should return appropriate message in case a note is present', () => {
    component.note = "foo";
    expect(component.tooltip_text()).toContain("Attention");
  })

  it('tooltip_text() should return appropriate message in case there is no note', () => {
    component.note = null;
    expect(component.tooltip_text()).toContain("Vous n'avez pas ajouté de note");
  })

  it('use_prescription should call prescriptionManagerService.use_prescription and redirect', () => {
    mockPrescriptionManager.use_prescription.and.returnValue(of(true));
    spyOn(component.router, 'navigate');

    component.use_prescription(true);
    expect(mockPrescriptionManager.use_prescription).toHaveBeenCalledWith(true);
    expect(component.router.navigate).toHaveBeenCalledWith(['/scan_ordonnance']);

    component.use_prescription(false);
    expect(mockPrescriptionManager.use_prescription).toHaveBeenCalledWith(false);
    expect(component.router.navigate).toHaveBeenCalledWith(['/scan_ordonnance']);
  })

  it('use_prescription should call prescriptionManagerService.use_prescription and display error message if one occurs', () => {
    mockPrescriptionManager.use_prescription.and.returnValue(throwError(""));
    spyOn(component.router, 'navigate');
    spyOn(window, 'alert');

    component.use_prescription(true);
    expect(mockPrescriptionManager.use_prescription).toHaveBeenCalledWith(true);
    expect(component.router.navigate).toHaveBeenCalledWith(['/scan_ordonnance']);
    expect(window.alert).toHaveBeenCalled();

    component.use_prescription(false);
    expect(mockPrescriptionManager.use_prescription).toHaveBeenCalledWith(false);
    expect(component.router.navigate).toHaveBeenCalledWith(['/scan_ordonnance']);
    expect(component.router.navigate).toHaveBeenCalled();
  })

  it('should not display "partiellement délivré" button if there is no note', (done: DoneFn) => {
    component.note = null;
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('#partiel')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('#total')).toBeTruthy();
      done()
    })
  })

  it('should display "partiellement délivré" button if there is a note', (done: DoneFn) => {
    component.note = "foo";
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('#partiel')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('#total')).toBeTruthy();
      done()
    })
  })

  it('should only display the note container if there is a note (case no note)', (done: DoneFn) => {
    component.note = null;
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('#noteContainer')).toBeFalsy();
      done()
    })
  })

  it('should only display the note container if there is a note (case note)', (done: DoneFn) => {
    component.note = "foo";
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('#noteContainer')).toBeTruthy();
      done()
    })
  })

  it('should adapt global container style according to the presence of a note (case no note)', (done: DoneFn) => {
    component.note = null;
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('#container').classList).not.toContain("container-grid");
      done()
    })
  })

  it('should adapt global container style according to the presence of a note (case note)', (done: DoneFn) => {
    component.note = "foo";
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('#container').classList).toContain("container-grid");
      done()
    })
  })
});
