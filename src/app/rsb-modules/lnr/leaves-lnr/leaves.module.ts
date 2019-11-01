

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {LeavesRoutingModule} from './leaves-routing.module';
import {LeavesTableComponent} from './leaves-table.component';
import {MatDatepickerModule, MatNativeDateModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';



// import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    LeavesRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
      FormsModule,
      TranslateModule,
      DpDatePickerModule
  ],
  declarations: [
    LeavesTableComponent,

  ],
  exports: [],
  providers:[]
})
export class LeavesModule { }


