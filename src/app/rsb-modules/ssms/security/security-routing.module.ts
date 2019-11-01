import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { PatrolComponent } from './patrol/patrol.component';

const routes: Routes = [
  {
    path: 'security/security-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: PatrolComponent,
          data: {
              "status":"screen",
              "screenId":20
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
