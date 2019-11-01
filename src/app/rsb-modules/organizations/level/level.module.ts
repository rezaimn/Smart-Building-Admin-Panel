import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Import Route file for CRUD operation
import { LevelRoutingModule } from './level-routing.module';

// Import Component for CRUD Layout
import { ManageLevelComponent } from './manage-level/manage-level.component';
import { PrepareLevelComponent } from './prepare-level/prepare-level.component';

// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

// Import Service file for Calling API
import { LevelService } from './level.service';
import { SvgService } from '../../../utils/services/svg.service';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    LevelRoutingModule,
    MalihuScrollbarModule.forRoot(),
    FormsModule,
      TranslateModule
  ],
  declarations: [ManageLevelComponent, PrepareLevelComponent],
  providers: [LevelService, SvgService],
  schemas: [NO_ERRORS_SCHEMA],
  exports: [ManageLevelComponent, PrepareLevelComponent]
})
export class LevelModule { }
