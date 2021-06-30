import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {PrescriptionsComponent} from './prescriptions/prescriptions.component';

import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import {ComponentLoaderFactory} from "ngx-bootstrap/component-loader";
import {PositioningService} from "ngx-bootstrap/positioning";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PrescriptionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule,
  ],
  providers: [PositioningService, ComponentLoaderFactory, BsModalService],
  bootstrap: [AppComponent]
})

export class AppModule {
}
