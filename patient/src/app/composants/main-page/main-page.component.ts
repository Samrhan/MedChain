import { Component, OnInit } from '@angular/core';
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";

import { faCog } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  faCog = faCog;

  constructor(
    public prescriptionManager: PrescriptionsManagerService
  ) { }

  ngOnInit(): void {
  }

}
