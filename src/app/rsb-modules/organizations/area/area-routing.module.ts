import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../../../common';
import { ManageAreaComponent } from './manage-area/manage-area.component';
// import { PrepareAreaComponent } from './prepare-access-area/prepare-access-area.component';

const routes: Routes = [
  {
    path: 'space/area', component: LayoutComponent,
    children: [
      {
        path: 'manage', component: ManageAreaComponent,
          data: {
              "status":"screen",
              "screenId":1
          },
      },
      // {
      //   path: 'add/:id', component: PrepareAreaComponent,
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaRoutingModule { }
