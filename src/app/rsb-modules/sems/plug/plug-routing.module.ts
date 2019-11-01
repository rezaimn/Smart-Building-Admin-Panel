import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { ManagePlugComponent } from './manage-plug/manage-plug.component';

const routes: Routes = [
  {
    path: 'plug/plug-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: ManagePlugComponent,
          data: {
              "status":"screen",
              "screenId":26
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlugRoutingModule { }
