import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule} from '@angular/forms';
import { StructureRoutingModule } from './structure-routing.module';
import { ManageStructureComponent } from './manage-structure/manage-structure.component';
import { PrepareStructureComponent } from './prepare-structure/prepare-structure.component';
import { SubsidiaryModule } from '../subsidiary/subsidiary.module';
import {StructureService } from '../structure/structure.service';
import {EavWrapperService} from '../../../utils/services/eav-wrapper.service';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialModuleNew} from '../../../mat.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StructureRoutingModule,
      MaterialModuleNew,
    SubsidiaryModule,
      TranslateModule
  ],
  providers:[StructureService,EavWrapperService],
  declarations: [ManageStructureComponent, PrepareStructureComponent],
  entryComponents: [PrepareStructureComponent]
})
export class StructureModule { }
