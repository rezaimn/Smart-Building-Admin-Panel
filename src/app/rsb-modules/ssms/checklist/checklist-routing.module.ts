import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import {  PatrolComponentList } from './patrol/patrol.component';

const routes: Routes = [
  {
    path: 'checklist/checklist-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: PatrolComponentList,
          data: {
              "status":"screen",
              "screenId":21
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
