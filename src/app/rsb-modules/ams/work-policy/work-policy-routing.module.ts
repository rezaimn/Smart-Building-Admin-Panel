import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { WorkPolicyListComponent } from './work-list/work-list.component';

const routes: Routes = [
  {
    path: 'work-policy/work-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: WorkPolicyListComponent,
          data: {
              "status":"screen",
              "screenId":15
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkPolicyRoutingModule { }
