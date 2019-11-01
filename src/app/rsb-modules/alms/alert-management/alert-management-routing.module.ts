import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { ManageAlertsComponent } from './manage-alerts/manage-alerts.component';

const routes: Routes = [
  {
    path: 'alert-management/alert-list', component: LayoutComponent,
    children: [
      {
        path: 'manage', component: ManageAlertsComponent,
          data: {
              "status":"screen",
              "screenId":12
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertManagementRoutingModule { }
