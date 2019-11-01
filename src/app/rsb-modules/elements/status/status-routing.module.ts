import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common';
import { ManageStatusComponent } from './manage-status/manage-status.component';

const routes: Routes = [{
    path: 'status/device-status',
    component: LayoutComponent,
    children: [{
      path: 'manage',
      component: ManageStatusComponent,
        data: {
            "status":"screen",
            "screenId":7
        },
    }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusRoutingModule { }
