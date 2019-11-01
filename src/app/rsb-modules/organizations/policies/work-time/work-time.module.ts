import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, PatternValidator} from '@angular/forms';
import { WorkTimeRoutingModule } from './work-time-routing.module';
import { ManageWorkTimeComponent } from './manage-work-time/manage-work-time.component';
import { PrepareWorkTimeComponent } from './prepare-work-time/prepare-work-time.component';
import { PoliciesService } from '../policies.service'
@NgModule({
  imports: [
    CommonModule,
FormsModule,
    WorkTimeRoutingModule
  ],
  declarations: [ManageWorkTimeComponent, PrepareWorkTimeComponent],
providers : [PoliciesService]
})
export class WorkTimeModule { }
