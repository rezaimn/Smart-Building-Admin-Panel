import { ParkingModule } from './parking/parking.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppCommonModule} from '../../common';
import { SubsidiaryListModule } from './subsidiary-list/subsidiary-list.module';
import {TranslateModule} from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    SubsidiaryListModule,
    ParkingModule,
    AppCommonModule,
      TranslateModule,

  ],
  declarations: []
})
export class SpmsModule { }
