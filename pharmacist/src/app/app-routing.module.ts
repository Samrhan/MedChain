import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from "./login-page/login-page.component";
import { ScanOrdonnanceComponent } from "./scan-ordonnance/scan-ordonnance.component";

import { AuthGuardService } from "./Services/AuthGuard/auth-guard.service";
import { AuthPreventService } from "./Services/AuthPrevent/auth-prevent.service";

const routes: Routes = [
  { path: 'login', component: LoginPageComponent, canActivate: [AuthPreventService] },
  { path: 'scan_ordonnance', component: ScanOrdonnanceComponent, canActivate: [AuthGuardService] },
  { path: '**', component: LoginPageComponent, canActivate: [AuthPreventService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
