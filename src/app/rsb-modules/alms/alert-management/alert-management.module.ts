import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertManagementRoutingModule } from './alert-management-routing.module';
import { ManageAlertsComponent } from './manage-alerts/manage-alerts.component';
import { EditAlertsComponent } from './edit-alerts/edit-alerts.component';
import { DeleteAlertComponent } from './delete-alert/delete-alert.component';
import { AlertManagementService } from './alert-management.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

@NgModule({
  imports: [
    CommonModule,
    AlertManagementRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule,
      DpDatePickerModule
  ],
  providers: [
    AlertManagementService
  ],
  declarations: [
    ManageAlertsComponent,
    EditAlertsComponent,
    DeleteAlertComponent
  ],
  entryComponents: [
    EditAlertsComponent,
    DeleteAlertComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AlertManagementModule { }
