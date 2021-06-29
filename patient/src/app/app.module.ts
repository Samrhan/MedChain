import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule} from "@angular/common/http";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {PlatformModule} from '@angular/cdk/platform';

import { ModalModule } from 'ngx-bootstrap/modal';

import { NumSecuPickerComponent } from './composants/num-secu-picker/num-secu-picker.component';
import { SettingsComponent } from './composants/settings/settings.component';
import { MainPageComponent } from './composants/main-page/main-page.component';
import { PrescriptionDisplayBigComponent } from './composants/prescription-display-big/prescription-display-big.component';
import { ScanPrescriptionComponent } from './composants/scan-prescription/scan-prescription.component';
import { AddFromLinkComponent } from './composants/add-from-link/add-from-link.component';
import { BarcodeComponent } from './composants/barcode/barcode.component';
import {ReactiveFormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {ZXingScannerModule} from "@zxing/ngx-scanner";

@NgModule({
  declarations: [
    AppComponent,
    NumSecuPickerComponent,
    SettingsComponent,
    MainPageComponent,
    PrescriptionDisplayBigComponent,
    ScanPrescriptionComponent,
    AddFromLinkComponent,
    BarcodeComponent,
  ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      HttpClientModule,
      PlatformModule,
      NgbModule,
      ModalModule.forRoot(),
      FontAwesomeModule,
      ZXingScannerModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
          // Register the ServiceWorker as soon as the app is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
      }),
      ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
