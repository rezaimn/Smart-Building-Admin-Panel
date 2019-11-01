import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ContentSchedulingComponent} from './content-scheduling/content-scheduling.component';
import {LayoutComponent} from '../../../../common';


const routes: Routes = [
  {
    path: 'programing/programing-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: ContentSchedulingComponent,
          data: {
              "status":"screen",
              "screenId":48
          },
      }
    ]
  }
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentSchedulingRoutingModule { }
