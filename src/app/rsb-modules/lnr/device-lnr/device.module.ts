

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {DeviceRoutingModule} from './device-routing.module';
import {DeviceTableComponent} from './device-table.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';


// import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    DeviceRoutingModule,
      TranslateModule,
      FormsModule,

  ],
  declarations: [
    DeviceTableComponent,

  ],
  exports: [],
  providers:[]
})
export class DeviceModule { }


