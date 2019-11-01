import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common';

import { ManageStructureComponent } from './manage-structure/manage-structure.component';
import { PrepareStructureComponent } from './prepare-structure/prepare-structure.component';

const routes: Routes = [
  {
    path: 'space/structure', component: LayoutComponent,

    children: [
      {
        path: 'manage', 
        component: ManageStructureComponent,

          data: {
              "status":"screen",
              "screenId":1
          },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructureRoutingModule { }
