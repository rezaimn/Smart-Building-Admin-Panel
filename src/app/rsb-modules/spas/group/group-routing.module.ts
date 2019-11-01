import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { ManageAccessGroupComponent } from './manage-access-group/manage-access-group.component';


const routes: Routes = [
  {
    path: 'group/group-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: ManageAccessGroupComponent,
          data: {
              "status":"screen",
              "screenId":46
          },
      }
    ]
  }
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupRoutingModule { }
