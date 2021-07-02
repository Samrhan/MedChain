import { Component, OnInit } from '@angular/core';
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";

import { faCog } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  faCog = faCog;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  prescriptions: Array<any>;
  status: Map<string, any>;
  max_value: number = 0;
  // On ignore la valeur par défaut pour le code completion car inutile à tester
  /* istanbul ignore next */
  current_prescription: number = parseInt(localStorage.getItem('current_prescription') || "0");

  already_shown_error: boolean = false; // Retient si on a déjà averti l'utilisateur qu'une ordonnance a été supprimée

  constructor(
    public prescriptionManager: PrescriptionsManagerService,
  ) {
    this.initialize()
  }

  initialize(){
    // On récupère toutes les données
    this.prescriptions = this.prescriptionManager.getAllPrescriptions(); // Prescriptions
    this.status = new Map<string, any>();
    this.max_value = this.prescriptions.length - 1;
    for(let prescription of this.prescriptions){  // Pour chaque prescription, on récupère les infos concernant sa date limite et le nombre d'utilisations restantes
      this.getPrescriptionMetadata(prescription);
    }
    this.validateDisplayedPrescriptionId()
  }

  getPrescriptionMetadata(prescription: any){
    this.prescriptionManager.getTokenState(prescription.token, prescription.password).subscribe((metadata) => {
      // On en profite pour supprimer les ordonnances devenues inutiles
      if(new Date(metadata.max_date) < new Date() || metadata.uses_left < 1){
        this.deletePrescription(prescription.token)
      } else {
        this.status.set(prescription.token, metadata);
      }
    }, (err) => {
      // On supprime aussi les ordonnances invalides
      if (err.status === 400){
        if(!this.already_shown_error){
          this.already_shown_error = true;
          window.alert("Une ou plusieurs ordonnances ont été invalidées à cause d'informations invalides. Veuillez vérifier que votre numéro de sécurité sociale est correct et que l'ordonnance vous était bien destinée.")
        }
        this.deletePrescription(prescription.token)
      }
    })
  }

  /**
   * Appelle PrescriptionsManager pour supprimer une ordonnance du localStorage
   * Se charge également de maintenir la cohérence des données internes du composant
   * @param token
   */
  deletePrescription(token: string){
    this.prescriptionManager.removePrescription(token);
    this.prescriptions = this.prescriptionManager.getAllPrescriptions();
    this.max_value = this.prescriptions.length - 1;
    this.validateDisplayedPrescriptionId()
  }

  /**
   * Si on essaye d'afficher une ordonnance dont le numéro est supérieur au nombre total d'ordonnances, alors on revient à 0
   */
  validateDisplayedPrescriptionId(){
    if (this.current_prescription > this.max_value){
      this.current_prescription = 0;
    }
  }

  ngOnInit(): void {
  }

  next_prescription(){
    this.current_prescription = Math.min(this.current_prescription + 1, this.max_value);
    localStorage.setItem('current_prescription', this.current_prescription.toString())
  }

  prev_prescription(){
    this.current_prescription = Math.max(this.current_prescription - 1, 0);
    localStorage.setItem('current_prescription', this.current_prescription.toString())
  }

  swipeCoord?: [number, number];
  swipeTime?: number;

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
      // On ignore les else inutiles car vides
    } else /* istanbul ignore else */ if (when === 'end' && this.swipeTime && this.swipeCoord) {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      /* istanbul ignore else */
      if (duration < 1000                                             // Assez rapide
        && Math.abs(direction[0]) > 30                                // Assez long
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {  // Assez horizontal
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        switch (swipe){
          case 'next': {
            this.next_prescription();
            break;
          }
          case 'previous': {
            this.prev_prescription();
            break;
          }
        }
      }
    }
  }

  getDate(code: string): string {
    const metadata = this.status.get(code);
    if (metadata){
      const max_date = new Date(metadata.max_date);
      return `Limite ${max_date.toLocaleDateString('fr-FR')}`;
    } else {
      return ""
    }
  }

  getUses(code: string): string {
    const metadata = this.status.get(code);
    if (metadata){
      const utilisations = metadata.uses_left;
      return `${utilisations} Utilisation${utilisations > 1 ? 's' : ''} restante${utilisations > 1 ? 's' : ''}`
    } else {
      return ""
    }
  }
}
