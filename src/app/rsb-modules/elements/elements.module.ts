import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../../common';

//Elements Module included
import { SubsidiaryListModule } from './subsidiary-list/subsidiary-list.module';
import { DeviceModule } from './device/device.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { StatusModule } from './status/status.module';

//Common Modules included
import { ConfirmModalComponent } from '../../common';

//Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    MalihuScrollbarModule.forRoot(),
    SubsidiaryListModule,
    DeviceModule,
    ConfigurationModule,
    StatusModule,
    AppCommonModule
  ],
  declarations: [],
  entryComponents: [ConfirmModalComponent],
  exports: []
})
export class ElementsModule { }
