

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule} from '../../common';
// Importing different module under organiztion
import { ConfirmModalComponent } from '../../common';
import { SubsidiaryListModule } from './subsidiary-list/subsidiary-list.module';


// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

import { StatusModule } from 'app/rsb-modules/sfms/status/status.module';

import { EmergencyModule } from 'app/rsb-modules/sfms/emergency/emergency.module';
import {SafetyModule} from "./safety/safety.module";



@NgModule({
  imports: [
    CommonModule,
    MalihuScrollbarModule.forRoot(),
    SubsidiaryListModule,
    StatusModule,
    SafetyModule,
    EmergencyModule,
    AppCommonModule
  ],
  declarations: [],
  entryComponents: [ConfirmModalComponent],
  exports: []
})
export class SfmsModule { }


