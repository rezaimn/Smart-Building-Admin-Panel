import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { ManageEmergencyComponent } from './manage-emergency/manage-emergency.component';

const routes: Routes = [
  {
    path: 'emergency/emergency-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: ManageEmergencyComponent,
          data: {
              "status":"screen",
              "screenId":23
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmergencyRoutingModule { }
