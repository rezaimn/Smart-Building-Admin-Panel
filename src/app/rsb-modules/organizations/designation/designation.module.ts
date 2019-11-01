import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, PatternValidator} from '@angular/forms';

import { DesignationRoutingModule } from './designation-routing.module';
import { ManageDesignationComponent } from './manage-designation/manage-designation.component';
import { PrepareDesignationComponent } from './prepare-designation/prepare-designation.component';
import { DesignationService } from './designation.service';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialModuleNew} from '../../../mat.module';
@NgModule({
  imports: [
    CommonModule,
    DesignationRoutingModule,
    FormsModule,
      TranslateModule,
      MaterialModuleNew
  ],
  declarations: [ManageDesignationComponent, PrepareDesignationComponent],
  providers:[DesignationService],
  entryComponents:[PrepareDesignationComponent]
})
export class DesignationModule { }
