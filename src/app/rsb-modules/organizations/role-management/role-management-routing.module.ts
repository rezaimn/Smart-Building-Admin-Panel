import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../../../common';
import {RoleManagementComponent} from './role-management/role-management.component';

const routes: Routes = [{
  path : 'subsadmin/admins',
  component : LayoutComponent,
  children: [{
    path : 'manage',
    component : RoleManagementComponent,
      data: {
          "status":"screen",
          "screenId":4
      },
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleManagementRoutingModule { }
