import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from "./composants/main-page/main-page.component";
import {SettingsComponent} from "./composants/settings/settings.component";
import {NumSecuPickerComponent} from "./composants/num-secu-picker/num-secu-picker.component";
import {PrescriptionDisplayBigComponent} from "./composants/prescription-display-big/prescription-display-big.component";
import {ScanPrescriptionComponent} from "./composants/scan-prescription/scan-prescription.component";
import {AddFromLinkComponent} from "./composants/add-from-link/add-from-link.component";

const routes: Routes = [
  {path : '', component: MainPageComponent},
  {path : 'settings', component: SettingsComponent},
  {path : 'num_secu', component: NumSecuPickerComponent},
  {path : 'display/:id', component: PrescriptionDisplayBigComponent},
  {path : 'scan', component: ScanPrescriptionComponent},
  {path : 'add/:token/:password', component: AddFromLinkComponent},
  {path : '**', component: MainPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
