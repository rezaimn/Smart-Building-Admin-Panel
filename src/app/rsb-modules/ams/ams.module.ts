import { TimeSheetModule } from './time-sheet/time-sheet.module';
import { LeaveModule } from './leave/leave.module';
import { HolidayModule } from './holiday/holiday.module';
import { WorkPolicyModule } from 'app/rsb-modules/ams/work-policy/work-policy.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule} from '../../common';
// Importing different module under organiztion
import { ConfirmModalComponent } from '../../common';
import { SubsidiaryListModule } from './subsidiary-list/subsidiary-list.module';

// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    MalihuScrollbarModule.forRoot(),
    SubsidiaryListModule,
    AppCommonModule,
    HolidayModule,
    LeaveModule,
    TimeSheetModule,
    WorkPolicyModule,
      TranslateModule
  ],
  declarations: [],
  entryComponents: [ConfirmModalComponent],
  exports: []
})
export class AmsModule { }


