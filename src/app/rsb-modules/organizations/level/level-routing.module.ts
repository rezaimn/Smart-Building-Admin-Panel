import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import the Manage Level/ Floor component
import { LayoutComponent } from '../../../common';
import { ManageLevelComponent } from './manage-level/manage-level.component';
import { PrepareLevelComponent } from './prepare-level/prepare-level.component';

const routes: Routes = [
 {
    path: 'space/level', component: LayoutComponent,

    children: [
      {
        path: 'manage', component: ManageLevelComponent,
          data: {
              "status":"screen",
              "screenId":1
          },
      },
      // {
      //   path: 'add/:id', component: PrepareLevelComponent
      // },
      // {
      //   path: 'edit/:id', component: PrepareLevelComponent
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LevelRoutingModule { }
