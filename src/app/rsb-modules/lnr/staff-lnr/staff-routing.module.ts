import {RouterModule, Routes} from '@angular/router';

import {NgModule} from '@angular/core';
import {StaffTableComponent} from './staff-table.component';
import {LayoutComponent} from '../../../common';




const Route: Routes = [
    {
        path: 'staff-lnr/staff-table', component: LayoutComponent,
        children: [
            {
                path: 'view-all', component: StaffTableComponent,
                data: {
                    "status":"screen",
                    "screenId":35
                },
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(Route)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
