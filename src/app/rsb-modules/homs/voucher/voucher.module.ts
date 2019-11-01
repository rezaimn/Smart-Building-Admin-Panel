import { DeleteVoucherComponent } from './delete-voucher/delete-voucher.component';
import { AddVoucherComponent } from 'app/rsb-modules/homs/voucher/add-voucher/add-voucher.component';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoucherRoutingModule } from './voucher-routing.module';
import { VoucherService } from './voucher.service';
import { MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';


@NgModule({
  imports: [
    CommonModule,
    VoucherRoutingModule,
      MatNativeDateModule,
      MatDatepickerModule,
    FormsModule,
      TranslateModule,
      DpDatePickerModule
 
  ],
  providers: [
    VoucherService
  ],
  declarations: [
    VoucherListComponent,
    AddVoucherComponent,
    DeleteVoucherComponent
    
  ],
  entryComponents: [
    AddVoucherComponent,
    DeleteVoucherComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VoucherModule { }
