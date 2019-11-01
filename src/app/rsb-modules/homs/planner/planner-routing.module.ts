import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { PlannerListComponent } from './planner-list/planner-list.component';

const routes: Routes = [
  {
    path: 'planner/planner-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: PlannerListComponent,
          data: {
              "status":"screen",
              "screenId":30
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlannerRoutingModule { }
