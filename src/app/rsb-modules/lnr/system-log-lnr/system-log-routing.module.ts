import {RouterModule, Routes} from '@angular/router';

import {NgModule} from '@angular/core';
import {SystemLogTableComponent} from './system-log-table.component';
import {LayoutComponent} from '../../../common';



const Route: Routes = [
    {
        path: 'system-log-lnr/system-log-table', component: LayoutComponent,
        children: [
            {
                path: 'view-all', component: SystemLogTableComponent,
                data: {
                    "status":"screen",
                    "screenId":40
                },
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(Route)],
  exports: [RouterModule]
})
export class SystemLogRoutingModule { }
