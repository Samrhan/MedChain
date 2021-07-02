import { Injectable } from '@angular/core';
import {CanActivate, Router} from "@angular/router";
import {PrescriptionsManagerService} from "../prescriptionManager/prescriptions-manager.service";

@Injectable({
  providedIn: 'root'
})
export class CheckSocialService implements CanActivate{

  constructor(
    private prescriptionManager: PrescriptionsManagerService,
    public router: Router
  ) { }

  canActivate(): boolean {
    if(this.prescriptionManager.isSocialEmpty()){
      this.router.navigate(['/num_secu']);
      return false;
    } else {
      return true;
    }
  }

}
