import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationManagementRoutingModule } from './notification-management-routing.module';
import { ManageNotificationComponent } from './manage-notification/manage-notification.component';
import { NotificationManagementService } from './notification-management.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

@NgModule({
  imports: [
    CommonModule,
    NotificationManagementRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule,
      DpDatePickerModule
  ],
  providers: [
    NotificationManagementService
  ],
  declarations: [
    ManageNotificationComponent
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationManagementModule { }
