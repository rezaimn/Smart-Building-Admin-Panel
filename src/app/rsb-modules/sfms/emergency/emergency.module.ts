import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmergencyRoutingModule } from './emergency-routing.module';
import { ManageEmergencyComponent } from './manage-emergency/manage-emergency.component';
import { ViewEmergencyComponent } from './view-emergency/view-emergency.component';
import { EmergencyService } from './emergency.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    EmergencyRoutingModule,
      MatNativeDateModule,
      MatDatepickerModule,
    FormsModule,
    TranslateModule
  ],
  providers: [
    EmergencyService
  ],
  declarations: [
    ManageEmergencyComponent,
    ViewEmergencyComponent
  ],
  entryComponents: [
    ViewEmergencyComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EmergencyModule { }
