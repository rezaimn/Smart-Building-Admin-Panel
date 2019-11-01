import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { ManageWorkGroupComponent } from './manage-work-group/manage-work-group.component';


const routes: Routes = [
  {
    path: 'work/work-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: ManageWorkGroupComponent,
          data: {
              "status":"screen",
              "screenId":10
          },
      }
    ]
  }
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkRoutingModule { }
