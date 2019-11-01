import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSheetRoutingModule } from './time-sheet-routing.module';
import { SheetListComponent } from './sheet-list/sheet-list.component';
import { SubmitComponent } from './submit/submit.component';
import { ApproveRejectComponent } from './approve-reject/approve-reject.component';
import { TimeSheetService } from './time-sheet.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

@NgModule({
  imports: [
    CommonModule,
    TimeSheetRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule,
      DpDatePickerModule
  ],
  providers: [
    TimeSheetService
  ],
  declarations: [
    SheetListComponent,
    SubmitComponent,
    ApproveRejectComponent
  ],
  entryComponents: [
    SubmitComponent,
    ApproveRejectComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimeSheetModule { }
