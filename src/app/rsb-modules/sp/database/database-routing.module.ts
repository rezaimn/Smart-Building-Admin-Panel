import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common';

import { ViewDatabaseComponent } from './view-database/view-database.component';

const routes: Routes = [
  {
    path: 'database/database-list',
    component: LayoutComponent,

    children: [
      {
        path: 'view-all', 
        component: ViewDatabaseComponent,
          data: {
              "status":"screen",
              "screenId":31
          },
         
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatabaseRoutingModule { }

