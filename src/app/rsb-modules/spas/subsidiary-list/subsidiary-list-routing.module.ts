import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common';

import { ViewSubsidiaryComponent } from './view-subsidiary/view-subsidiary.component';

const routes: Routes = [
  {
    path: 'subsidiary/subsidiary-list',
    component: LayoutComponent,

    children: [
      {
        path: 'view-all', 
        component: ViewSubsidiaryComponent,
          data: {
              "status":"screen",
              "screenId":0
          },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubsidiaryListRoutingModule { }

