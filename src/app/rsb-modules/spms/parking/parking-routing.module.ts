import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common';
import { ManageParkingComponent } from 'app/rsb-modules/spms/parking/manage-parking/manage-parking.component';


const routes: Routes = [
  {
    path: 'parking/manage-parking',
    component: LayoutComponent,

    children: [
      {
        path: 'list',
        component: ManageParkingComponent,
          data: {
              "status":"screen",
              "screenId":44
          },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParkingRoutingModule { }
