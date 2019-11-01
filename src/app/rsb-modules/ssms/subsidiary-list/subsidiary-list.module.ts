import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule,PatternValidator} from '@angular/forms';

import { SubsidiaryListRoutingModule } from './subsidiary-list-routing.module';
import { ViewSubsidiaryComponent } from './view-subsidiary/view-subsidiary.component';
// Service
import {SubsidiaryListService} from './subsidiary-list.service';
import {EavWrapperService} from '../../../utils/services/eav-wrapper.service';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SubsidiaryListRoutingModule,
    FormsModule,
    TranslateModule
  ],
  providers: [SubsidiaryListService, EavWrapperService],
  declarations: [ViewSubsidiaryComponent]
})
export class SubsidiaryListModule { }
