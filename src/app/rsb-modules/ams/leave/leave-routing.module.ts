import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { LeaveListComponent } from './leave-list/leave-list.component';

const routes: Routes = [
  {
    path: 'leave/leave-list', component: LayoutComponent,
    children: [
      {
        path: 'manage', component: LeaveListComponent,
          data: {
              "status":"screen",
              "screenId":17
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveRoutingModule { }
