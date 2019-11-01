import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common';
import { TypeSettingsComponent } from './type-settings/type-settings.component';
const routes: Routes = [
  {
    path: 'type/type-list', component: LayoutComponent,
    children: [
      {
        path: 'settings', component: TypeSettingsComponent,
          data: {
              "status":"screen",
              "screenId":50
          },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeSettingsRoutingModule { }
