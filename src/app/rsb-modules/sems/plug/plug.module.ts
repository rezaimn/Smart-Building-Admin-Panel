import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlugRoutingModule } from './plug-routing.module';
import { ManagePlugComponent } from './manage-plug/manage-plug.component';
import { ViewPlugComponent } from './view-plug/view-plug.component';
import { PlugService } from './plug.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    PlugRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule
  ],
  providers: [
    PlugService
  ],
  declarations: [
    ManagePlugComponent,
    ViewPlugComponent
  ],
  entryComponents: [
    ViewPlugComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PlugModule { }
