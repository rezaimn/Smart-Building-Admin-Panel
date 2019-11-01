import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../../common';
import { PagerComponent } from '../pager/pager.component';
import { ManageCommonAreaComponent } from './common-area/manage-common-area/manage-common-area.component';
import { PrepareCommonAreaComponent } from './common-area/prepare-common-area/prepare-common-area.component';
import { ManageSpecificAreaComponent } from './specific-area/manage-specific-area/manage-specific-area.component';
import { PrepareSpecificAreaComponent } from './specific-area/prepare-specific-area/prepare-specific-area.component';
const routes: Routes = [
  {
    path: 'dept/policies', component: LayoutComponent,
    children: [
      {
        path: 'common-area', component: PagerComponent,
        children: [
          {
            path: 'manage', component: ManageCommonAreaComponent,
          },
          {
            path: 'prepare', component: PrepareCommonAreaComponent,
          }
        ]
      }, {
        path: 'specific-area', component: PagerComponent,
        children: [
          {
            path: 'manage', component: ManageSpecificAreaComponent,
          },
          {
            path: 'prepare', component: PrepareSpecificAreaComponent,
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessRoutingModule { }
