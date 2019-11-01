import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { ManageHvacComponent } from './manage-hvac/manage-hvac.component';

const routes: Routes = [
  {
    path: 'hvac/hvac-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: ManageHvacComponent,
          data: {
              "status":"screen",
              "screenId":24
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HvacRoutingModule { }
