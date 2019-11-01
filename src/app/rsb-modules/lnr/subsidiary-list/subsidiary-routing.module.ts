import {RouterModule, Routes} from '@angular/router';

import {NgModule} from '@angular/core';
import {ViewSubsidiaryComponent} from './view-subsidiary.component';
import {LayoutComponent} from '../../../common';

const routes: Routes = [
    {
        path: 'subsidiary/subsidiary-list',
        component: LayoutComponent,
        children: [
            {
                path: 'view-all',
                component: ViewSubsidiaryComponent,
                data: {
                    "status":"screen",
                    "screenId":0
                },
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubsidiaryRoutingModule { }
