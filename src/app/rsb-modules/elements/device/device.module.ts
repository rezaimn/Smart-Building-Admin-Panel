import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { DeviceRoutingModule } from './device-routing.module';
import { ManageDeviceComponent } from './manage-device/manage-device.component';
import { DeviceService } from './device.service';
import { PrepareDeviceComponent } from './prepare-device/prepare-device.component';
import { FilterDeviceComponent } from './filter-device/filter-device.component';
import { DeleteDeviceComponent } from './delete-device/delete-device.component';
import {MatTooltipModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {ErrorTableComponent} from './error-table/error-table.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceRoutingModule,
    MalihuScrollbarModule.forRoot(),
    FormsModule,
      MatTooltipModule,
      TranslateModule
  ],
  declarations: [ManageDeviceComponent, PrepareDeviceComponent, FilterDeviceComponent, DeleteDeviceComponent,ErrorTableComponent],
  providers: [DeviceService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
entryComponents : [PrepareDeviceComponent, DeleteDeviceComponent,ErrorTableComponent]
})
export class DeviceModule { }
