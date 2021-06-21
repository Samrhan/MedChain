import { Component, OnInit } from '@angular/core';
import {PrescriptionManagerService} from "../Services/PrescriptionManager/prescription-manager.service";

@Component({
  selector: 'app-display-ordonnance',
  templateUrl: './display-ordonnance.component.html',
  styleUrls: ['./display-ordonnance.component.css']
})
export class DisplayOrdonnanceComponent implements OnInit {
  info_ordonnance: any;
  notes: any;
  prescription: any;

  uses_left: number | undefined;

  constructor(
    public prescriptionManagerService: PrescriptionManagerService,
  ) {
  }

  ngOnInit(): void {
    if(this.prescriptionManagerService.shouldBeRefreshed){
      this.prescriptionManagerService.refresh_prescription().subscribe(() => {
        this.get_prescription()
      })
    } else {
      this.get_prescription()
    }
  }

  get_prescription(){
    let prescription = this.prescriptionManagerService.get_prescription_cache();
    this.prescriptionManagerService.get_uses_left().subscribe(val => this.uses_left = val);
    this.info_ordonnance = prescription.info_ordonnance;
    this.notes = prescription.notes;
    this.prescription = prescription.prescription;
  }

  formatDate(text: string): string {
    let date = new Date(text);
    return date.toLocaleDateString('fr-FR');
  }
}
