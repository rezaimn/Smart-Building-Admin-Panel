import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../../../common';
import {SpaceSettingsComponent} from './space-settings/space-settings.component';


const routes: Routes = [{
  path : 'space/space-list',
  component : LayoutComponent,
  children: [{
    path : 'settings',
    component : SpaceSettingsComponent,
      data: {
          "status":"screen",
          "screenId":49
      },
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpaceSettingsRoutingModule { }
