import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorRoutingModule } from './visitor-routing.module';
import { ManageVisitorComponent } from './manage-visitor/manage-visitor.component';
import { ViewVisitorComponent } from './view-visitor/view-visitor.component';
import { VisitorService } from './visitor.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    VisitorRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule
  ],
  providers: [
    VisitorService
  ],
  declarations: [
    ManageVisitorComponent,
    ViewVisitorComponent
  ],
  entryComponents: [
    ViewVisitorComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VisitorModule { }
