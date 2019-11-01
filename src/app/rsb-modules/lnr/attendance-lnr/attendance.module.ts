

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {AttendanceRoutingModule} from './attendance-routing.module';
import {AttendanceTableComponent} from './attendance-table.component';
import {MatDatepickerModule, MatNativeDateModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';


// import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    AttendanceRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
      FormsModule,
      TranslateModule,
      DpDatePickerModule
  ],
  declarations: [
    AttendanceTableComponent,

  ],
  exports: [],
  providers:[]
})
export class AttendanceModule { }


