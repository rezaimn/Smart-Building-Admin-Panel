import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { ManageVisitorComponent } from './manage-visitor/manage-visitor.component';


const routes: Routes = [
  {
    path: 'visitor/visitor-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: ManageVisitorComponent,
          data: {
              "status":"screen",
              "screenId":9
          },
      }
    ]
  }
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitorRoutingModule { }
