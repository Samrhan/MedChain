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
  max_value: number = 0;
  current_prescription: number = parseInt(localStorage.getItem('current_prescription') || "0");

  constructor(
    public prescriptionManager: PrescriptionsManagerService,
  ) {
    // TODO: Remove this
    prescriptionManager.clearAll();
    prescriptionManager.addPrescription("d92984f1-d19f-4bdc-926b-6e81e8ce75d5", "b07174a9-3c48-4aa4-9f03-b87f385de469");
    prescriptionManager.addPrescription("755da544-56f4-466c-a454-f1bc23236cf3", "08a99940-e030-4e97-a865-07c17364c9c6");
    prescriptionManager.addPrescription("81732cb4-e652-4ad2-8d2b-5878062a3a5f", "64308ae0-fdbf-49f4-9333-57d10a765219");

    this.prescriptions = prescriptionManager.getAllPrescriptions();
    this.max_value = this.prescriptions.length - 1;
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
}
