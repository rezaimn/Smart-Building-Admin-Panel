import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { ManageSwitchComponent } from './manage-switch/manage-switch.component';

const routes: Routes = [
  {
    path: 'switch/switch-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: ManageSwitchComponent,
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SwitchRoutingModule { }
