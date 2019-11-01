import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { ManageLightningComponent } from './manage-lightning/manage-lightning.component';

const routes: Routes = [
  {
    path: 'lightning/lightning-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: ManageLightningComponent,
          data: {
              "status":"screen",
              "screenId":25
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LightningRoutingModule { }
