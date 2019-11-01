import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LayoutComponent} from '../../../../common';
import {ContentManagementComponent} from './content-management.component';


const routes: Routes = [
  {
    path: 'content/content-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: ContentManagementComponent,
          data: {
              "status":"screen",
              "screenId":43
          },
      }
    ]
  }
];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentManagementRoutingModule { }
