import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffRoutingModule } from './staff-routing.module';
import { ManageStaffComponent } from './manage-staff/manage-staff.component';
import { StaffService } from './staff.service';
import { MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    StaffRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule
  ],
  providers: [

  ],
  declarations: [
    ManageStaffComponent
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StaffModule { }
