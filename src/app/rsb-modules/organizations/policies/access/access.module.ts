import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccessRoutingModule } from './access-routing.module';
import { CommonAreaModule } from './common-area/common-area.module';
import { SpecificAreaModule } from './specific-area/specific-area.module';
import { AccessService} from './access.service';

@NgModule({
  imports: [
    CommonModule,
    AccessRoutingModule,
    CommonAreaModule,
    SpecificAreaModule,

  ],
  declarations: [],
  providers:[AccessService]
})
export class AccessModule { }
