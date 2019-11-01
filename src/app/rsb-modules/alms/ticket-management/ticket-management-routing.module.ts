import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { ManageTicketComponent } from './manage-ticket/manage-ticket.component';

const routes: Routes = [
  {
    path: 'ticket-management/ticket-list', component: LayoutComponent,
    children: [
      {
        path: 'manage', component: ManageTicketComponent,
          data: {
              "status":"screen",
              "screenId":13
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketManagementRoutingModule { }
