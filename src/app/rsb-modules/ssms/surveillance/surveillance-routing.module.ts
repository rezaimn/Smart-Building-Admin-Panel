import { SurveillanceCamComponent } from './surveillance-cam/surveillance-cam.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { SurveillanceListComponent } from './surveillance-list/surveillance-list.component';

const routes: Routes = [
  {
    path: 'surveillance/surveillance-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: SurveillanceListComponent,
          data: {
              "status":"screen",
              "screenId":19
          },
      },
      {
        path: 'cam', component: SurveillanceCamComponent,
          data: {
              "status":"screen",
              "screenId":19
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveillanceRoutingModule { }
