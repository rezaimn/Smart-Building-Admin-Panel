import {RouterModule, Routes} from '@angular/router';
import {JobsTableComponent} from './jobs-table.component';
import {NgModule} from '@angular/core';
import {LayoutComponent} from '../../../common';



const Route: Routes = [
    {
        path: 'jobs-lnr/jobs-table', component: LayoutComponent,
        children: [
            {
                path: 'view-all', component: JobsTableComponent,
                data: {
                    "status":"screen",
                    "screenId":2612
                },
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(Route)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
