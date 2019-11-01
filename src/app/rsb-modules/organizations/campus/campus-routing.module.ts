import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../../../common';
import { ManageCampusComponent } from './manage-campus/manage-campus.component';
import { PrepareCampusComponent } from './prepare-campus/prepare-campus.component';

const routes: Routes = [{
    path: 'space/campus', component: LayoutComponent,
    children: [{
        path: 'manage', 
        component: ManageCampusComponent,
        data: {
            "status":"screen",
            "screenId":1
        },
      }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampusRoutingModule { }
