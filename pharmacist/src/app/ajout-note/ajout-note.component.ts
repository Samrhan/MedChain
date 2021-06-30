import { Component, OnInit } from '@angular/core';
import {PrescriptionManagerService} from "../Services/PrescriptionManager/prescription-manager.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-ajout-note',
  templateUrl: './ajout-note.component.html',
  styleUrls: ['./ajout-note.component.css']
})
export class AjoutNoteComponent implements OnInit {

  content: string = "";

  constructor(
    private prescriptionManager: PrescriptionManagerService,
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  send_note(){
    this.prescriptionManager.post_note(this.content).subscribe(() => {
      this.router.navigate(['/display_ordonnance'])
    }, () => {
      this.prescriptionManager.patch_note(this.content).subscribe(() => {
        this.router.navigate(['/display_ordonnance'])
      }, () => {
        alert("Impossible d'ajouter une note");
        this.router.navigate(['/display_ordonnance'])
      })
    })
    this.prescriptionManager.shouldBeRefreshed = true;
  }
}
