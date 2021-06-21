import { Component, OnInit } from '@angular/core';

import {PrescriptionManagerService} from "../Services/PrescriptionManager/prescription-manager.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-confirmer-distribution',
  templateUrl: './confirmer-distribution.component.html',
  styleUrls: ['./confirmer-distribution.component.css']
})
export class ConfirmerDistributionComponent implements OnInit {

  prescription: any;
  note: string | null = null;

  constructor(
    private prescriptionManagerService: PrescriptionManagerService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    let prescription = this.prescriptionManagerService.get_prescription_cache();
    this.prescription = prescription.prescription;
    this.note = this.prescriptionManagerService.get_note();
  }

  use_prescription(fully_used: boolean) {
    this.prescriptionManagerService.use_prescription(fully_used).subscribe(() => {
      alert("Tout s'est déroulé correctement !")
      this.router.navigate(['/scan_ordonnance'])
    }, () => {
      alert("Impossible de mettre à jour l'ordonnance...")
      this.router.navigate(['/scan_ordonnance'])
    })
  }

  tooltip_text(): string {
    return this.note ?
      "Attention, vous avez ajouté une note à cette ordonnance. Si vous ne l'avez pas délivrée en entier, n'appuyez pas sur ce bouton" :
      "Vous n'avez pas ajouté de note, donc cette ordonnance doit avoir été délivrée en entier. Si ce n'est pas le cas, merci d'ajouter une note sépcifiant ce que vous avez délivré.";
  }
}
