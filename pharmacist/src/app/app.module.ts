import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ModalModule} from "ngx-bootstrap/modal";
import {TooltipModule} from "ngx-bootstrap/tooltip";

import { LoginPageComponent } from './login-page/login-page.component';
import { ScanOrdonnanceComponent } from './scan-ordonnance/scan-ordonnance.component';
import { DisplayOrdonnanceComponent } from './display-ordonnance/display-ordonnance.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AjoutNoteComponent } from './ajout-note/ajout-note.component';
import { ConfirmerDistributionComponent } from './confirmer-distribution/confirmer-distribution.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        ScanOrdonnanceComponent,
        DisplayOrdonnanceComponent,
        NavbarComponent,
        AjoutNoteComponent,
        ConfirmerDistributionComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule
    ],
    providers: [],
    exports: [
        NavbarComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
