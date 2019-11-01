import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveillanceRoutingModule } from './surveillance-routing.module';
import { SurveillanceListComponent } from './surveillance-list/surveillance-list.component';

import { SurveillanceService } from './surveillance.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SurveillanceCamComponent } from 'app/rsb-modules/ssms/surveillance/surveillance-cam/surveillance-cam.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SurveillanceRoutingModule,
      MatNativeDateModule,
      MatDatepickerModule,
    FormsModule,
    TranslateModule
  ],
  providers: [
    SurveillanceService
  ],
  declarations: [
    SurveillanceListComponent,
    SurveillanceCamComponent
    
  ],
  entryComponents: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SurveillanceModule { }
