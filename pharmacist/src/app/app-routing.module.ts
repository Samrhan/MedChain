import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from "./login-page/login-page.component";
import { ScanOrdonnanceComponent } from "./scan-ordonnance/scan-ordonnance.component";
import { DisplayOrdonnanceComponent } from "./display-ordonnance/display-ordonnance.component";
import { AjoutNoteComponent } from "./ajout-note/ajout-note.component";
import { ConfirmerDistributionComponent } from "./confirmer-distribution/confirmer-distribution.component";

import { AuthGuardService } from "./Services/AuthGuard/auth-guard.service";
import { AuthPreventService } from "./Services/AuthPrevent/auth-prevent.service";
import {PrescriptionManagerService} from "./Services/PrescriptionManager/prescription-manager.service";

const routes: Routes = [
  { path: 'login', component: LoginPageComponent, canActivate: [AuthPreventService] },
  { path: 'scan_ordonnance', component: ScanOrdonnanceComponent, canActivate: [AuthGuardService] },
  { path: 'display_ordonnance', component: DisplayOrdonnanceComponent, canActivate: [AuthGuardService] },
  { path: 'ajouter_note', component: AjoutNoteComponent, canActivate: [AuthGuardService, PrescriptionManagerService] },
  { path: 'confirmer_distribution', component: ConfirmerDistributionComponent, canActivate: [AuthGuardService, PrescriptionManagerService] },
  { path: '**', component: LoginPageComponent, canActivate: [AuthPreventService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
