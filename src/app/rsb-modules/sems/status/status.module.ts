import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from "ngx-tooltip";
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

import { StatusRoutingModule } from './status-routing.module';
import { ManageStatusComponent } from './manage-status/manage-status.component';

import { StatusService } from './status.service';
import { SvgService } from '../../../utils/services/svg.service';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    StatusRoutingModule,
    MalihuScrollbarModule.forRoot(),
    FormsModule,
    TooltipModule,
      TranslateModule
  ],
  declarations: [
    ManageStatusComponent
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers : [
    StatusService,
    SvgService
  ]
})
export class StatusModule { }
