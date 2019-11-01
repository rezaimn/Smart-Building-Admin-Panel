import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,PatternValidator} from '@angular/forms';
import {SubsidiaryRoutingModule} from './subsidiary-routing.module';
import {ManageSubsidiaryComponent} from './manage-subsidiary/manage-subsidiary.component';
import {PrepareSubsidiaryComponent} from './prepare-subsidiary/prepare-subsidiary.component';

// Service
import {SubsidiaryService} from './subsidiary.service';
import {EavWrapperService} from '../../../utils/services/eav-wrapper.service';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
      SubsidiaryRoutingModule,
      FormsModule,//PatternValidator
      TranslateModule
  ],
  providers: [
    SubsidiaryService, EavWrapperService
  ],
  declarations: [
    ManageSubsidiaryComponent, PrepareSubsidiaryComponent
  ],
  entryComponents: [PrepareSubsidiaryComponent],

})
export class SubsidiaryModule {}