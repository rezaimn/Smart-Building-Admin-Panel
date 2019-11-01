import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../../utils';

import { SpaceSettingsRoutingModule } from './space-settings-routing.module';

import { SpaceSettingsService } from './space-settings.service';

import { FormsModule } from '@angular/forms';


// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import {TranslateModule} from '@ngx-translate/core';
import {SpaceSettingsComponent} from './space-settings/space-settings.component';


@NgModule({
  imports: [
    CommonModule,
    SpaceSettingsRoutingModule,
    MalihuScrollbarModule.forRoot(),
    FormsModule,
      TranslateModule
  ],
  providers: [
    SpaceSettingsService
  ],
  declarations: [
      SpaceSettingsComponent,
  ],
})
export class SpaceSettingsModule { }
