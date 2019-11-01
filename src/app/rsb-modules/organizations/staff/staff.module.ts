import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffRoutingModule } from './staff-routing.module';
import { ManageStaffComponent } from './manage-staff/manage-staff.component';
import { ViewStaffComponent } from './view-staff/view-staff.component';
import { PrepareStaffComponent } from './prepare-staff/prepare-staff.component';
import { StaffService } from './staff.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

@NgModule({
  imports: [
    CommonModule,
    StaffRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule,
      DpDatePickerModule
  ],
  providers: [
    StaffService
  ],
  declarations: [
    ManageStaffComponent,
    PrepareStaffComponent,
    ViewStaffComponent
  ],
  entryComponents: [
    PrepareStaffComponent,
    ViewStaffComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StaffModule { }
