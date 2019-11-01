import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UtilsModule} from '../../../utils';
import { DepartmentRoutingModule } from './department-routing.module';
import { ManageDepartmentComponent } from './manage-department/manage-department.component';
import { PrepareDepartmentComponent } from './prepare-department/prepare-department.component';
import {DepartmentService} from './department.service';
import {EavWrapperService} from '../../../utils/services/eav-wrapper.service';
import {FormsModule} from '@angular/forms';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    UtilsModule,
    FormsModule,
      TranslateModule,
MalihuScrollbarModule.forRoot(),
  ],
  providers: [
    DepartmentService, EavWrapperService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [PrepareDepartmentComponent],
  declarations: [ManageDepartmentComponent, PrepareDepartmentComponent]
})
export class DepartmentModule { }
