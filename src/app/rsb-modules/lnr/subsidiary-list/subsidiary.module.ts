import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {SubsidiaryRoutingModule} from './subsidiary-routing.module';
import {ViewSubsidiaryComponent} from './view-subsidiary.component';
import {TranslateModule} from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    SubsidiaryRoutingModule,
      TranslateModule
  ],
  declarations: [
    ViewSubsidiaryComponent,
  ],
  exports: [],
  providers:[]
})
export class SubsidiaryModule { }


