import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from '../../../common';
import {ManageDeviceComponent} from './manage-device/manage-device.component';
import {FilterDeviceComponent} from './filter-device/filter-device.component'

const routes : Routes = [
  {
    path: 'device/ems-devices',
    component: LayoutComponent,

    children: [
      {
        path: 'manage',
        component: ManageDeviceComponent,
          data: {
              "status":"screen",
              "screenId":5
          },
         
      }, {
        path: 'filter',
        component: FilterDeviceComponent,
            data: {
                "status":"screen",
                "screenId":5
            },
         
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceRoutingModule {}