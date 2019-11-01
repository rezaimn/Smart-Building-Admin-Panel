import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentManagementRoutingModule } from './content-management-routing.module';

import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {SkService} from '../../sk.service';
import {ContentManagementComponent} from './content-management.component';

@NgModule({
  imports: [
    CommonModule,
    ContentManagementRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
    TranslateModule
  ],
  providers: [
    SkService
  ],
  declarations: [
    ContentManagementComponent,
  ],
  entryComponents: [
    ContentManagementComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContentManagementModule { }
