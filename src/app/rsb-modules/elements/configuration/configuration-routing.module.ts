import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common';
import { ManageDeviceConfigurationComponent } from './manage-device-configuration/manage-device-configuration.component';

const routes: Routes = [
  {
    path: 'config/ems-manage',
    component: LayoutComponent,

    children: [
      {
        path: 'list',
        component: ManageDeviceConfigurationComponent,
          data: {
              "status":"screen",
              "screenId":6
          },
         
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
