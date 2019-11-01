import * as path from 'path';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importing the sidebar, header and footer component
import { LayoutComponent } from '../../common/layout/layout.component';

const routes: Routes = [];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpmsRoutingModule { }

