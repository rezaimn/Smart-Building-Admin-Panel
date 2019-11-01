import {RouterModule, Routes} from '@angular/router';

import {NgModule} from '@angular/core';
import {LeavesTableComponent} from './leaves-table.component';
import {LayoutComponent} from '../../../common';

const Route: Routes = [
    {
        path: 'leaves-lnr/leaves-table', component: LayoutComponent,
        children: [
            {
                path: 'view-all', component: LeavesTableComponent,
                data: {
                    "status":"screen",
                    "screenId":36
                },
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(Route)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }