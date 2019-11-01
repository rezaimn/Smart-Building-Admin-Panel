import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkPolicyRoutingModule } from './work-policy-routing.module';
import { WorkPolicyListComponent } from './work-list/work-list.component';
import { AddWorkComponent } from './add-work/add-work.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { WorkPolicyService } from './work-policy.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

@NgModule({
  imports: [
    CommonModule,
    WorkPolicyRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule,
      DpDatePickerModule
  ],
  providers: [
    WorkPolicyService
  ],
  declarations: [
    WorkPolicyListComponent,
    AddWorkComponent,
    ConfirmComponent
  ],
  entryComponents: [
    AddWorkComponent,
    ConfirmComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkPolicyModule { }
