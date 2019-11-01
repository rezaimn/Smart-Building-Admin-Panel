import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkRoutingModule } from './work-routing.module';
import { ManageWorkGroupComponent } from './manage-work-group/manage-work-group.component';
import { PrepareWorkGroupComponent } from './prepare-work-group/prepare-work-group.component';
import { WorkService } from './work.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

@NgModule({
  imports: [
    CommonModule,
      WorkRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule,
      DpDatePickerModule
  ],
  providers: [
    WorkService
  ],
  declarations: [
    ManageWorkGroupComponent,
      PrepareWorkGroupComponent
  ],
  entryComponents: [
    PrepareWorkGroupComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkModule { }
