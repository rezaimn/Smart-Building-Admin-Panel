import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { ManageNotificationComponent } from './manage-notification/manage-notification.component';

const routes: Routes = [
  {
    path: 'notification-management/notification-list', component: LayoutComponent,
    children: [
      {
        path: 'manage', component: ManageNotificationComponent,
          data: {
              "status":"screen",
              "screenId":14
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationManagementRoutingModule { }
