import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageSubDepartmentComponent } from './manage-sub-department/manage-sub-department.component';
import { LayoutComponent } from '../../../common'
const routes: Routes = [
  {
    path: 'dept/subdepartment', component: LayoutComponent,
    children: [
      {
        path: 'manage', component: ManageSubDepartmentComponent,
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
export class SubDepartmentRoutingModule { }
