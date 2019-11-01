import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { AlertTableComponent } from './alert-table/alert-table.component';

const routes: Routes = [
  {
    path: 'alert-dashboard/alert-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: AlertTableComponent,
          data: {
              "status":"screen",
              "screenId":11
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertDashboardRoutingModule { }
