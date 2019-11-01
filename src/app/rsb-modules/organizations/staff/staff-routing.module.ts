import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { ManageStaffComponent } from './manage-staff/manage-staff.component';
import { PrepareStaffComponent } from './prepare-staff/prepare-staff.component';

const routes: Routes = [
  {
    path: 'staff/managestaff', component: LayoutComponent,
    children: [
      {
        path: 'manage', component: ManageStaffComponent,
          data: {
              "status":"screen",
              "screenId":3
          },
      },
      {
        path: 'prepare', component: PrepareStaffComponent,
          data: {
              "status":"screen",
              "screenId":3
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
