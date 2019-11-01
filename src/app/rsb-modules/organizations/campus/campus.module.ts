import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CampusRoutingModule } from './campus-routing.module';
import { ManageCampusComponent } from './manage-campus/manage-campus.component';
import { PrepareCampusComponent } from './prepare-campus/prepare-campus.component';

// Import Service file for API & Utils calls
import { CampusService } from './campus.service';
import { SvgService } from '../../../utils/services/svg.service';

// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    CampusRoutingModule,
    MalihuScrollbarModule.forRoot(),
    FormsModule,
      TranslateModule
  ],
  declarations: [ManageCampusComponent, PrepareCampusComponent],
  providers: [
    CampusService,
    SvgService
  ]
})
export class CampusModule { }
