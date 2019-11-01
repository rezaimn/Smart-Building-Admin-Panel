import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule} from '../../common';
// Importing different module under organiztion
import { LevelModule } from './level/level.module';
import { SubsidiaryModule } from './subsidiary/subsidiary.module';
import { StructureModule } from './structure/structure.module';
import { CampusModule } from './campus/campus.module';
import { AreaModule} from './area/area.module';
import { PrepareSubsidiaryComponent } from './subsidiary/prepare-subsidiary/prepare-subsidiary.component';
import { ConfirmModalComponent } from '../../common';
import { DepartmentModule } from './department/department.module';
import { SubDepartmentModule } from './sub-department/sub-department.module';
import { DesignationModule } from './designation/designation.module';
import { PoliciesModule } from './policies/policies.module';
import { StaffModule } from "./staff/staff.module";
import { RoleManagementModule } from './role-management/role-management.module';

// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
@NgModule({
  imports: [
    CommonModule,
    MalihuScrollbarModule.forRoot(),
    SubsidiaryModule,
    LevelModule,
    CampusModule,
    StructureModule,
    AreaModule,
    AppCommonModule,
    DepartmentModule,
    SubDepartmentModule,
    DesignationModule,
    PoliciesModule,
    StaffModule,
    RoleManagementModule,
  ],
  declarations: [],
  entryComponents: [PrepareSubsidiaryComponent,ConfirmModalComponent],
  exports: []
})
export class OrganizationsModule { }
