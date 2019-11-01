import { DeleteDeviceComponent } from './delete-device/delete-device.component';

import { DeviceListComponent } from './device-list/device-list.component';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceConRoutingModule } from './device-routing.module';
import { DeviceConService } from './device.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AddDeviceComponent } from './add-device/add-device.component';
import { AddDeviceFrequencyComponent } from './add-device-frequency/add-device-frequency.component';
import {TranslateModule} from '@ngx-translate/core';
import {AddOutputdeviceComponent} from './add-outputdevice/add-outputdevice/add-outputdevice.component';
@NgModule({
  imports: [
    CommonModule,
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
    AddDeviceComponent,
    AddDeviceFrequencyComponent,
    DeleteDeviceComponent,
    AddOutputdeviceComponent
  ],
  entryComponents: [
    AddDeviceComponent,
    AddDeviceFrequencyComponent,
    DeleteDeviceComponent,
    AddOutputdeviceComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ScenarioModule { }
