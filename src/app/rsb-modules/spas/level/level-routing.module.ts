import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { ManageAccessLevelComponent } from './manage-access-level/manage-access-level.component';


const routes: Routes = [
  {
    path: 'level/level-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: ManageAccessLevelComponent,
          data: {
              "status":"screen",
              "screenId":47
          },
      }
    ]
  }
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LevelRoutingModule { }
