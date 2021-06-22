import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayOrdonnanceComponent } from './display-ordonnance.component';
import {PrescriptionManagerService} from "../Services/PrescriptionManager/prescription-manager.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";
import {NavbarComponent} from "../navbar/navbar.component";

describe('DisplayOrdonnanceComponent', () => {
  let component: DisplayOrdonnanceComponent;
  let fixture: ComponentFixture<DisplayOrdonnanceComponent>;

  let mockPrescriptionManager = jasmine.createSpyObj(['get_prescription_cache', 'get_uses_left', 'refresh_prescription'], ['shouldBeRefreshed'])

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{provide: PrescriptionManagerService, useValue: mockPrescriptionManager}],
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ DisplayOrdonnanceComponent, NavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockPrescriptionManager.get_prescription_cache.and.returnValue(prescription);
    mockPrescriptionManager.get_uses_left.and.returnValue(of(1));
    mockPrescriptionManager.refresh_prescription.and.returnValue(of(true));
    spyPropertyGetter(mockPrescriptionManager, 'shouldBeRefreshed').and.returnValue(false);

    fixture = TestBed.createComponent(DisplayOrdonnanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh the prescription in case it is requested', () => {
    spyPropertyGetter(mockPrescriptionManager, 'shouldBeRefreshed').and.returnValue(true);

    component.ngOnInit()

    expect(mockPrescriptionManager.refresh_prescription).toHaveBeenCalled();
  })

  it('get_prescription should fill variables', () => {
    component.info_ordonnance = null;
    component.notes = null;
    component.prescription = null;
    component.uses_left = undefined;

    component.get_prescription();

    expect(component.info_ordonnance).toBeTruthy();
    expect(component.notes).toBeTruthy();
    expect(component.prescription).toBeTruthy();
    expect(component.uses_left).toBeTruthy();
  })

  it('formatDate() should return a corretly formated string', () => {
    expect(component.formatDate("2021-06-11T22:00:00.000Z")).toEqual("12/06/2021");
    expect(component.formatDate("2022-06-11T22:00:00.000Z")).toEqual("12/06/2022");
  })
});

function spyPropertyGetter<T, K extends keyof T>(
  spyObj: jasmine.SpyObj<T>,
  propName: K
): jasmine.Spy<() => T[K]> {
  return Object.getOwnPropertyDescriptor(spyObj, propName)?.get as jasmine.Spy<() => T[K]>;
}
