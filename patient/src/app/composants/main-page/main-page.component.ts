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
  current_prescription: number = parseInt(localStorage.getItem('current_prescription') || "0");

  constructor(
    public prescriptionManager: PrescriptionsManagerService,
  ) {
    // TODO: Remove this
    // prescriptionManager.clearAll();
    // prescriptionManager.addPrescription("483472b1-c9d7-4cf3-91c6-42530141c628", "8d87cb1c-4806-401e-82cf-c3956135cf2d");
    // prescriptionManager.addPrescription("4ef7b9c8-c94d-4fa6-ae48-ec007eba8dc6", "8d87cb1c-4806-401e-82cf-c3956135cf2d"); // Cette ordonnance sera supprimée car elle est trop vieille
    // prescriptionManager.addPrescription("eb924924-2bfe-445a-a013-8be34d8c1e12", "8d87cb1c-4806-401e-82cf-c3956135cf2d"); // Cette ordonnance sera supprimée car elle est trop utilisée
    // prescriptionManager.addPrescription("eb924924-2bfe-445a-a013-8be34d8c1e12", "8d87cb1c-4806-401e-82cf-c3956135cf2e"); // Cette ordonnance sera supprimée car elle n'a pas le bon mot de passe
    // prescriptionManager.addPrescription("eb924924-2bfe-445a-a013-8be34d8c1e13", "8d87cb1c-4806-401e-82cf-c3956135cf2d"); // Cette ordonnance sera supprimée car elle n'existe pas
    // prescriptionManager.addPrescription("47753d54-c9d0-4f9c-bd73-973d9f359422", "8d87cb1c-4806-401e-82cf-c3956135cf2d");
    // prescriptionManager.setSocial('000000000000000');


    // On récupère toutes les données
    this.prescriptions = prescriptionManager.getAllPrescriptions();
    this.status = new Map<string, any>();
    this.max_value = this.prescriptions.length - 1;
    for(let prescription of this.prescriptions){
      prescriptionManager.getTokenState(prescription.token, prescription.password).subscribe((metadata) => {
        // On en profite pour supprimer les ordonnances devenues inutiles
        if(new Date(metadata.max_date) < new Date() || metadata.uses_left < 1){
          prescriptionManager.removePrescription(prescription.token);
          this.prescriptions = prescriptionManager.getAllPrescriptions();
          this.max_value = this.prescriptions.length - 1;
          if (this.current_prescription > this.max_value){
            this.current_prescription = 0;
          }
        } else {
          this.status.set(prescription.token, metadata);
        }
      }, (err) => {
        // On supprime aussi les ordonnances invalides
        if (err.status === 400){
          prescriptionManager.removePrescription(prescription.token);
          this.prescriptions = prescriptionManager.getAllPrescriptions();
          this.max_value = this.prescriptions.length - 1;
          if (this.current_prescription > this.max_value){
            this.current_prescription = 0;
          }
        }
      })
    }

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

  private swipeCoord?: [number, number];
  private swipeTime?: number;

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end' && this.swipeTime && this.swipeCoord) {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
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
