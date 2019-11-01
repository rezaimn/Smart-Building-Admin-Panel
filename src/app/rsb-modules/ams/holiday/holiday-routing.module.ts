import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { HolidayTableComponent } from './holiday-table/holiday-table.component';

const routes: Routes = [
  {
    path: 'holiday/holiday-list', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: HolidayTableComponent,
          data: {
              "status":"screen",
              "screenId":18
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidayRoutingModule { }
