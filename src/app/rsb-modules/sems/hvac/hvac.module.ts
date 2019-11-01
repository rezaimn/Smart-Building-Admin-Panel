import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HvacRoutingModule } from './hvac-routing.module';
import { ManageHvacComponent } from './manage-hvac/manage-hvac.component';
import { ViewHvacComponent } from './view-hvac/view-hvac.component';
import { HvacService } from './hvac.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    HvacRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule
  ],
  providers: [
    HvacService
  ],
  declarations: [
    ManageHvacComponent,
    ViewHvacComponent
  ],
  entryComponents: [
    ViewHvacComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HvacModule { }
