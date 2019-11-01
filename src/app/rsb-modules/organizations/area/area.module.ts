import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Import Route file for CRUD operation
import { AreaRoutingModule } from './area-routing.module';

// Import Component for CRUD Layout
import { ManageAreaComponent } from './manage-area/manage-area.component';
import { PrepareAreaComponent } from './prepare-area/prepare-area.component';

// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { AreaService } from './area.service';
import { SvgService } from '../../../utils/services/svg.service';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    AreaRoutingModule,
    MalihuScrollbarModule.forRoot(),
    FormsModule,
      TranslateModule
  ],
  declarations: [ManageAreaComponent, PrepareAreaComponent],
  providers: [AreaService, SvgService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  exports: [ManageAreaComponent, PrepareAreaComponent]
})
export class AreaModule { }
