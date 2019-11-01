

import { DeviceListComponent } from './device-list/device-list.component';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceConRoutingModule } from './device-routing.module';
import { DeviceConService } from './device.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {MalihuScrollbarModule} from 'ngx-malihu-scrollbar';
import {AddDeviceComponent} from './add-device/add-device.component';

@NgModule({
  imports: [
    CommonModule,
      MalihuScrollbarModule.forRoot(),
    DeviceConRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule
  ],
  providers: [
    DeviceConService
  ],
  declarations: [
    DeviceListComponent,
    AddDeviceComponent
  ],
  entryComponents: [
    AddDeviceComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DeviceConModule { }
