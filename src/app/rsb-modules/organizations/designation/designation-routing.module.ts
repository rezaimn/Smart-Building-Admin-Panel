import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageDesignationComponent } from './manage-designation/manage-designation.component';
import { LayoutComponent } from '../../../common'
const routes: Routes = [
  {
    path: 'dept/designation', component: LayoutComponent,
    children: [
      {
        path: 'manage', component: ManageDesignationComponent,
          data: {
              "status":"screen",
              "screenId":3
          },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignationRoutingModule { }
