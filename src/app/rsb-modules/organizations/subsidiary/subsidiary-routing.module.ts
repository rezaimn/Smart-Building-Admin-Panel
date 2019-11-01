import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common';
import { ManageSubsidiaryComponent } from './manage-subsidiary/manage-subsidiary.component';
import { PrepareSubsidiaryComponent } from './prepare-subsidiary/prepare-subsidiary.component';
import {AuthGuard} from '../../../utils/authguard/routeguard';

const routes: Routes = [
  {
    path: 'space/subsidiary', component: LayoutComponent,
    children: [
      {
        path: 'manage', 
        component: ManageSubsidiaryComponent,
          data: {
            "status":"screen",
            "screenId":42
          },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubsidiaryRoutingModule { }
