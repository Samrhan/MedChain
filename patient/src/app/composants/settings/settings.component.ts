import { Component, OnInit } from '@angular/core';
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(
    private prescriptionManager: PrescriptionsManagerService
  ) { }

  ngOnInit(): void {
  }

  deleteAll(){
    if (window.confirm("Voulez-vous vraiment supprimer toutes les données ? Cette action est irréversible.")){
      this.prescriptionManager.clearAll()
    }
  }

}
