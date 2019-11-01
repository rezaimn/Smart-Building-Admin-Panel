import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common';
import { TilesComponent } from './tiles/tiles.component';
import { AssignAreaComponent } from './assign-area/assign-area.component';
const routes: Routes = [
  {
    path: 'dept/policies', component: LayoutComponent,
    children: [
      {
        path: 'allpolicies', component: TilesComponent,
      },
      {
        path: 'assignarea', component: AssignAreaComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoliciesRoutingModule { }
