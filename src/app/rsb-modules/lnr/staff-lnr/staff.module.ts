

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {StaffRoutingModule} from './staff-routing.module';
import {StaffTableComponent} from './staff-table.component';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';



// import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    StaffRoutingModule,
      FormsModule,
      TranslateModule

  ],
  declarations: [
    StaffTableComponent,

  ],
  exports: [],
  providers:[]
})
export class StaffModule { }


