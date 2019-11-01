import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common';
import { ManageDepartmentComponent } from './manage-department/manage-department.component';
import { PrepareDepartmentComponent } from './prepare-department/prepare-department.component';

const routes: Routes = [
  {
    path: 'dept/department', component: LayoutComponent,
    children: [
      {
        path: 'manage', component: ManageDepartmentComponent,
          data: {
              "status":"screen",
              "screenId":2
          },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
