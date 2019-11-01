import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../../utils';

import { RoleManagementRoutingModule } from './role-management-routing.module';

import { RoleManagementService } from './role-management.service';

import { FormsModule } from '@angular/forms';


// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import {TranslateModule} from '@ngx-translate/core';
import {RoleManagementComponent} from './role-management/role-management.component';
import {PrepareRoleComponent} from './prepare-role/prepare-role.component';

@NgModule({
  imports: [
    CommonModule,
    RoleManagementRoutingModule,
    MalihuScrollbarModule.forRoot(),
    FormsModule,
      TranslateModule
  ],
  providers: [
    RoleManagementService
  ],
  declarations: [
      PrepareRoleComponent,
      RoleManagementComponent
  ],
    entryComponents: [PrepareRoleComponent],
})
export class RoleManagementModule { }
