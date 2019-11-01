import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveRoutingModule } from './leave-routing.module';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { ApplyComponent } from './apply/apply.component';
import { RejectComponent } from './reject/reject.component';
import { LeaveService } from './leave.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { TimeSheetService } from './time-sheet.service';
import { ApproveRejComponent } from './approve-reject/approve-reject.component';
import { ApproveComponent } from './approve/approve.component';
import { SubmitComponent } from './submit/submit.component';
import { ViewComponent } from './view/view.component';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

@NgModule({
  imports: [
    CommonModule,
    LeaveRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule,
      DpDatePickerModule
  ],
  providers: [
    LeaveService,
	TimeSheetService
  ],
  declarations: [
    LeaveListComponent,
    ApplyComponent,
    RejectComponent,
    ApproveComponent,
    SubmitComponent,
    ViewComponent,
    ApproveRejComponent
  ],
  entryComponents: [
    ApplyComponent,
    RejectComponent,
    SubmitComponent,
    ViewComponent,
    ApproveRejComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LeaveModule { }
