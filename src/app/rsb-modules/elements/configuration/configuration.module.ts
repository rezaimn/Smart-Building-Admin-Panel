import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ManageDeviceConfigurationComponent } from './manage-device-configuration/manage-device-configuration.component';
import { ConfigurationService } from './configuration.service';
import { UtilsModule } from '../../../utils';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    MalihuScrollbarModule.forRoot(),
    FormsModule,
    ConfigurationRoutingModule,
    UtilsModule,
      TranslateModule
  ],
  declarations: [ManageDeviceConfigurationComponent],
  providers: [ConfigurationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfigurationModule { }
