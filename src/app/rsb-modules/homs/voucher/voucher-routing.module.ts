import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { VoucherListComponent } from './voucher-list/voucher-list.component';

const routes: Routes = [
  {
    path: 'voucher/voucher-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: VoucherListComponent,
          data: {
              "status":"screen",
              "screenId":28
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoucherRoutingModule { }
