import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDashboardRoutingModule } from './alert-dashboard-routing.module';
import { AlertTableComponent } from './alert-table/alert-table.component';
import { ViewAlertComponent } from './view-alert/view-alert.component';
import { AlertStatusComponent } from './alert-status/alert-status.component';
import { AlertDashboardService } from './alert-dashboard.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

@NgModule({
  imports: [
    CommonModule,
    AlertDashboardRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule,
      DpDatePickerModule
  ],
  providers: [
    AlertDashboardService
  ],
  declarations: [
    AlertTableComponent,
    ViewAlertComponent,
    AlertStatusComponent
  ],
  entryComponents: [
    ViewAlertComponent,
    AlertStatusComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AlertDashboardModule { }
