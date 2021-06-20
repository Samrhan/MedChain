import { Component, OnInit } from '@angular/core';
import {PrescriptionManagerService} from "../Services/PrescriptionManager/prescription-manager.service";

@Component({
  selector: 'app-display-ordonnance',
  templateUrl: './display-ordonnance.component.html',
  styleUrls: ['./display-ordonnance.component.css']
})
export class DisplayOrdonnanceComponent implements OnInit {
  prescription: any;

  constructor(
    private prescriptionManagerService: PrescriptionManagerService,
  ) {
  }

  ngOnInit(): void {
    this.prescription = this.prescriptionManagerService.get_prescription_cache();
    console.log(this.prescription)
  }
}
