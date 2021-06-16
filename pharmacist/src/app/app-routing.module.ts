import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from "./login-page/login-page.component";
import { ScanOrdonnanceComponent } from "./scan-ordonnance/scan-ordonnance.component";

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'scan_ordonnance', component: ScanOrdonnanceComponent },
  { path: '**', component: LoginPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
