import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { UrlListComponent } from './url-list/url-list.component';

const routes: Routes = [
  {
    path: 'url/url-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: UrlListComponent,
          data: {
              "status":"screen",
              "screenId":33
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UrlRoutingModule { }
