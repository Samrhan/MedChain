import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuardService} from "./service/auth-guard.service";
import {AuthPreventService} from "./service/auth-prevent.service";
import {PrescriptionsComponent} from "./prescriptions/prescriptions.component";

const routes: Routes = [
  {path: "login", component:LoginComponent, canActivate:[AuthPreventService]},
  {path: "prescription", component:PrescriptionsComponent, canActivate:[AuthGuardService]},
  { path: '**', component: LoginComponent, canActivate: [AuthPreventService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
