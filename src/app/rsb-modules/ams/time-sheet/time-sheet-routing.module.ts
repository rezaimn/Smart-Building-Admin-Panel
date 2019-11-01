import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { SheetListComponent } from './sheet-list/sheet-list.component';

const routes: Routes = [
  {
    path: 'time-sheet/sheet-list', component: LayoutComponent,
    children: [
      {
        path: 'manage', component: SheetListComponent,
          data: {
              "status":"screen",
              "screenId":16
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeSheetRoutingModule { }
