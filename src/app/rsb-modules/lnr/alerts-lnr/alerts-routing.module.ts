import {RouterModule, Routes} from '@angular/router';
import {AlertsTableComponent} from './alerts-table.component';
import {NgModule} from '@angular/core';
import {LayoutComponent} from '../../../common';



const Route: Routes = [
    {
        path: 'report/staff-table', component: LayoutComponent,
        children: [
            {
                path: 'view-all', component: AlertsTableComponent,
                data: {
                    "status":"screen",
                    "screenId":39
                },
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(Route)],
  exports: [RouterModule]
})
export class AlertsRoutingModule { }
