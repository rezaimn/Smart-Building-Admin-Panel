import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { ManageSafetyComponent } from './manage-safety/manage-safety.component';

const routes: Routes = [
  {
    path: 'safety/safety-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: ManageSafetyComponent,
          data: {
              "status":"screen",
              "screenId":22
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SafetyRoutingModule { }
