import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";

@Component({
  selector: 'app-prescription-display-big',
  templateUrl: './prescription-display-big.component.html',
  styleUrls: ['./prescription-display-big.component.css']
})
export class PrescriptionDisplayBigComponent implements OnInit {

  faArrowLeft = faArrowLeft;

  code: string = "";
  password: string = "";

  constructor(
    private route: ActivatedRoute,
    private prescriptionManager: PrescriptionsManagerService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getPrescription(id);
  }

  getPrescription(id: number){
    const prescription = this.prescriptionManager.getAllPrescriptions()[id];
    if (prescription){
      this.code = prescription.token;
      this.password = prescription.password;
    }
  }

}
