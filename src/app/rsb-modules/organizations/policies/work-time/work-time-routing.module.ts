import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../../common';
import { PagerComponent } from '../pager/pager.component';
import { ManageWorkTimeComponent } from '../work-time/manage-work-time/manage-work-time.component';
import { PrepareWorkTimeComponent } from '../work-time/prepare-work-time/prepare-work-time.component';

const routes: Routes = [
  {
    path: 'dept/policies',
    component: LayoutComponent,
    children: [
      {
        path: 'work-time',
        component: PagerComponent,
        children: [
          {
            path: 'manage',
            component : ManageWorkTimeComponent,
          }, {
            path: 'prepare',
            component : PrepareWorkTimeComponent,
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
export class WorkTimeRoutingModule { }
