import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule} from '../../common';
// Importing different module under organiztion
import { ConfirmModalComponent } from '../../common';
import { SubsidiaryListModule } from './subsidiary-list/subsidiary-list.module';


// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { StaffModule } from './staff/staff.module';
// import { ZoneModule } from './zone/zone.module';
import { VisitorModule } from './visitor/visitor.module';
import { WorkModule } from './work/work.module';

import {TranslateModule} from '@ngx-translate/core';
import {GroupModule} from './group/group.module';
import {LevelModule} from './level/level.module';


@NgModule({
  imports: [
    CommonModule,
    MalihuScrollbarModule.forRoot(),
    StaffModule,
    SubsidiaryListModule,
    VisitorModule,
      WorkModule,
      GroupModule,
      LevelModule,
    AppCommonModule,
    TranslateModule
  ],
  declarations: [],
  entryComponents: [ConfirmModalComponent],
  exports: []
})
export class SpasModule { }


