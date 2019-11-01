import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafetyRoutingModule } from './safety-routing.module';
import { ManageSafetyComponent } from './manage-safety/manage-safety.component';
import { ViewSafetyComponent } from './view-safety/view-safety.component';
import { SafetyService } from './safety.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SafetyRoutingModule,
      MatNativeDateModule,
      MatDatepickerModule,
    FormsModule,
      TranslateModule

],
  providers: [
    SafetyService
  ],
  declarations: [
    ManageSafetyComponent,
    ViewSafetyComponent
  ],
  entryComponents: [
    ViewSafetyComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SafetyModule { }
