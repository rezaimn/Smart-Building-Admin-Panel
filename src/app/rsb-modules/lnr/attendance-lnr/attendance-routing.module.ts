import {RouterModule, Routes} from '@angular/router';

import {NgModule} from '@angular/core';
import {AttendanceTableComponent} from './attendance-table.component';
import {LayoutComponent} from '../../../common';



const Route: Routes = [
    {
        path: 'attendance-lnr/attendance-table', component: LayoutComponent,
        children: [
            {
                path: 'view-all', component: AttendanceTableComponent,
                data: {
                    "status":"screen",
                    "screenId":37
                },
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(Route)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
