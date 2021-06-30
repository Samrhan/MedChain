import { Component, OnInit } from '@angular/core';
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(
    public prescriptionManager: PrescriptionsManagerService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  deleteAll(){
    if (window.confirm("Voulez-vous vraiment supprimer toutes les données ? Cette action est irréversible.")){
      this.prescriptionManager.clearAll();
      this.router.navigate(['/'])
    }
  }

}
