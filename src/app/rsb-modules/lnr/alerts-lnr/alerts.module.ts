

import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AlertsTableComponent} from './alerts-table.component';
import {AlertsRoutingModule} from './alerts-routing.module';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDatepickerModule, MatNativeDateModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

@NgModule({
  imports: [
    CommonModule,
    AlertsRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
      FormsModule,
      TranslateModule,
      DpDatePickerModule
  ],
  declarations: [
    AlertsTableComponent,


  ],
  exports: [],
  providers:[ DatePipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AlertsModule { }


