import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, PatternValidator } from '@angular/forms';
import { AllowanceModule } from './allowance/allowance.module';
import { GradeModule } from './grade/grade.module';
import { WorkTimeModule } from './work-time/work-time.module';
import { PoliciesRoutingModule } from './policies-routing.module';
import { TilesComponent } from './tiles/tiles.component';
import { PagerComponent } from './pager/pager.component';
import { AssignAreaComponent } from './assign-area/assign-area.component';
import { PrepareGradeComponent } from './grade/prepare-grade/prepare-grade.component';
import { AccessModule } from './access/access.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AccessModule,
    PoliciesRoutingModule,
    AllowanceModule,
    GradeModule,
    WorkTimeModule,
      TranslateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [PrepareGradeComponent],
  declarations: [TilesComponent, PagerComponent, AssignAreaComponent]
})
export class PoliciesModule { }