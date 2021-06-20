import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ModalModule} from "ngx-bootstrap/modal";
import { LoginPageComponent } from './login-page/login-page.component';
import {ReactiveFormsModule} from "@angular/forms";
import { ScanOrdonnanceComponent } from './scan-ordonnance/scan-ordonnance.component';
import { DisplayOrdonnanceComponent } from './display-ordonnance/display-ordonnance.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ScanOrdonnanceComponent,
    DisplayOrdonnanceComponent,
    NavbarComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        ModalModule.forRoot(),
        ReactiveFormsModule,
        HttpClientModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
