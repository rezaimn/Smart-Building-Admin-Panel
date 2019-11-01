//import { LayoutComponentView } from './../../../common/layoutVideo/layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../common/layout/layout.component';
import { VideoCallComponent } from './call/call.component';

const routes: Routes = [
  {
    path: 'video-call/call', component: LayoutComponent,
    children: [
      {
        path: 'view-all', component: VideoCallComponent,
          data: {
              "status":"screen",
              "screenId":45
          },
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoCallRoutingModule { }
