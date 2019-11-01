import {RouterModule, Routes} from '@angular/router';
import {ManageReportComponent} from './manage-report/manage-report.component';
import {EditReportComponent} from './edit-report/edit-report.component';
import {LayoutComponent} from '../../../common';
import {NgModule} from '@angular/core';

const Route: Routes = [
    {
        path: 'report-lnr/manage-report', component: LayoutComponent,
        children: [
            {
                path: 'view-all', component: ManageReportComponent,
                data: {
                    "status":"screen",
                    "screenId":36
                },
            }
        ]
    },
    {
        path: 'report-lnr/edit-report', component: LayoutComponent,
        children: [
            {
                path: 'view-all', component: EditReportComponent,
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
export class ReportRoutingModule { }
