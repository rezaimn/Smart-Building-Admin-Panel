import { AlertDashboardModule } from './alert-dashboard/alert-dashboard.module';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule} from '../../common';
// Importing different module under organiztion
import { ConfirmModalComponent } from '../../common';
import { SubsidiaryListModule } from './subsidiary-list/subsidiary-list.module';


// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';


import { AlertManagementModule } from 'app/rsb-modules/alms/alert-management/alert-management.module';
import { NotificationManagementModule } from 'app/rsb-modules/alms/notification-management/notification-management.module';
import { TicketManagementModule } from 'app/rsb-modules/alms/ticket-management/ticket-management.module';
import {TranslateModule} from '@ngx-translate/core';
import {ScenarioModule} from './scenario/Scenario.module';
import {DeviceConModule} from './device/device.module';

@NgModule({
  imports: [
    CommonModule,
    MalihuScrollbarModule.forRoot(),
    SubsidiaryListModule,
    AlertDashboardModule,
    AlertManagementModule,
    NotificationManagementModule,
    TicketManagementModule,
    AppCommonModule,
      ScenarioModule,
      DeviceConModule
  ],
  declarations: [],
  entryComponents: [ConfirmModalComponent],
  exports: [ScenarioModule]
})
export class AlmsModule { }


