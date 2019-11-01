import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common';
import { RoleSettingsComponent } from './role-settings/role-settings.component';
const routes: Routes = [
  {
    path: 'role/role-list', component: LayoutComponent,
    children: [
      {
        path: 'settings', component: RoleSettingsComponent,
          data: {
              "status":"screen",
              "screenId":41
          },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
