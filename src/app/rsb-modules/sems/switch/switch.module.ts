import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwitchRoutingModule } from './switch-routing.module';
import { ManageSwitchComponent } from './manage-switch/manage-switch.component';
import { ViewSwitchComponent } from './view-switch/view-switch.component';
import { SwitchService } from './switch.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SwitchRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule
  ],
  providers: [
    SwitchService
  ],
  declarations: [
    ManageSwitchComponent,
    ViewSwitchComponent
  ],
  entryComponents: [
    ViewSwitchComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwitchModule { }
