import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../../common/layout/layout.component';
import { ManageStaffComponent } from './manage-staff/manage-staff.component';

const routes: Routes = [
  {
    path: 'staff/cardHolder-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: ManageStaffComponent,
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
