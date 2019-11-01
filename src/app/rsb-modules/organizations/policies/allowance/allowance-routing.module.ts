import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../../common/layout/layout.component';
import { PagerComponent } from '../pager/pager.component';
import { ManageAllowanceComponent } from '../allowance/manage-allowance/manage-allowance.component';
import { PrepareAllowanceComponent } from '../allowance/prepare-allowance/prepare-allowance.component';

const routes: Routes = [
  {
    path: 'dept/policies', component: LayoutComponent,

    children: [
      {
        path: 'allowance', component: PagerComponent,

        children: [
          {
            path: 'manage', component: ManageAllowanceComponent,

          },
          {
            path: 'prepare', component: PrepareAllowanceComponent,

          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllowanceRoutingModule { }
