import { Component, OnInit } from '@angular/core';
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-add-from-link',
  templateUrl: './add-from-link.component.html',
  styleUrls: ['./add-from-link.component.css']
})
export class AddFromLinkComponent implements OnInit {

  token: string = "";
  password: string = "";

  showInvalidParams: boolean = false;
  showOk: boolean = false;

  constructor(
    private prescriptionManager: PrescriptionsManagerService,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.addPrescriptionFromURL(params);
    })
  }

  addPrescriptionFromURL(params): void{
    this.token = params["token"];
    this.password = params["password"];

    if (this.validUUID(this.token) && this.validUUID(this.password)){
      this.prescriptionManager.addPrescription(this.token, this.password);
      this.router.navigate(['/']);
      this.showOk = true;
    } else {
      this.showInvalidParams = true;
    }
  }

  validUUID(text: string): boolean {
    return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(text);
  }

}
