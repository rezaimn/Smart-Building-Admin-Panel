import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { DeviceListComponent } from './device-list/device-list.component';

const routes: Routes = [
  {
    path: 'device/device-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: DeviceListComponent,
          data: {
              "status":"screen",
              "screenId":32
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceConRoutingModule { }
