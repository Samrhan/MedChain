import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AuthGuardService} from "./service/auth-guard.service";
import {AuthPreventService} from "./service/auth-prevent.service";
import {OrdonnanceFormComponent} from "./ordonnance-form/ordonnance-form.component";

const routes: Routes = [
  {path: "login", component:LoginComponent, canActivate:[AuthPreventService]},
  {path: "form_ordonnance", component:OrdonnanceFormComponent, canActivate:[AuthGuardService]},
  { path: '**', component: LoginComponent, canActivate: [AuthPreventService] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
