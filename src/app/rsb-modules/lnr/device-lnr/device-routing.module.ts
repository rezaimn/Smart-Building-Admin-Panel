import {RouterModule, Routes} from '@angular/router';

import {NgModule} from '@angular/core';
import {DeviceTableComponent} from './device-table.component';
import {LayoutComponent} from '../../../common';



const Route: Routes = [
    {
        path: 'device-lnr/device-table', component: LayoutComponent,
        children: [
            {
                path: 'view-all', component: DeviceTableComponent,
                data: {
                    "status":"screen",
                    "screenId":38
                },
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(Route)],
  exports: [RouterModule]
})
export class DeviceRoutingModule { }
