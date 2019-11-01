import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolidayRoutingModule } from './holiday-routing.module';
import { HolidayTableComponent } from './holiday-table/holiday-table.component';
import { HolidayService } from './holiday.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    HolidayRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule
  ],
  providers: [
    HolidayService
  ],
  declarations: [
    HolidayTableComponent
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HolidayModule { }
