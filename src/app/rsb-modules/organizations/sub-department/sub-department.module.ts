import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {UtilsModule} from '../../../utils';
import {MalihuScrollbarModule} from 'ngx-malihu-scrollbar';
import { SubDepartmentRoutingModule } from './sub-department-routing.module';
import { ManageSubDepartmentComponent } from './manage-sub-department/manage-sub-department.component';
import { PrepareSubDepartmentComponent } from './prepare-sub-department/prepare-sub-department.component';
import { PrepareDesignationComponent } from '../designation/prepare-designation/prepare-designation.component';
import { SubDepartmentService } from './sub-department.service';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SubDepartmentRoutingModule,
    UtilsModule,
    FormsModule,
      TranslateModule,
MalihuScrollbarModule.forRoot(),
  ],
  declarations: [ManageSubDepartmentComponent, PrepareSubDepartmentComponent],
  entryComponents: [PrepareSubDepartmentComponent,PrepareDesignationComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers:[SubDepartmentService]
})
export class SubDepartmentModule { }
