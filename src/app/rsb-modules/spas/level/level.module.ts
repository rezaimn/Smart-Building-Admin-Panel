import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelRoutingModule } from './level-routing.module';
import { ManageAccessLevelComponent } from './manage-access-level/manage-access-level.component';
import { PrepareAccessLevelComponent} from './prepare-access-level/prepare-access-level.component';
import { LevelService } from './level.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MalihuScrollbarModule} from 'ngx-malihu-scrollbar';


@NgModule({
  imports: [
    CommonModule,
      LevelRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule,
      MalihuScrollbarModule.forRoot(),
  ],
  providers: [
      LevelService
  ],
  declarations: [
    ManageAccessLevelComponent,
      PrepareAccessLevelComponent
  ],
  entryComponents: [
      PrepareAccessLevelComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LevelModule { }
