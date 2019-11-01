import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageCommonAreaComponent } from './manage-common-area/manage-common-area.component';
import { PrepareCommonAreaComponent } from './prepare-common-area/prepare-common-area.component';
import {TooltipModule} from "ngx-tooltip";
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule,
    FormsModule,
    MalihuScrollbarModule,
      TranslateModule

  ],
  declarations: [ManageCommonAreaComponent, PrepareCommonAreaComponent]
})
export class CommonAreaModule { }
