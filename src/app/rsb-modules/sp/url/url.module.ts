

import { UrlListComponent } from './url-list/url-list.component';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlRoutingModule } from './url-routing.module';
import { UrlService } from './url.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AddUrlComponent } from 'app/rsb-modules/sp/url/add-url/add-url.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    UrlRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule
  ],
  providers: [
    UrlService
  ],
  declarations: [
    UrlListComponent,
    AddUrlComponent,
  ],
  entryComponents: [
    AddUrlComponent,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UrlModule { }
