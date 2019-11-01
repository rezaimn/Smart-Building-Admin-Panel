import { VoucherModule } from './voucher/voucher.module';

;

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule} from '../../common';
// Importing different module under organiztion
import { ConfirmModalComponent } from '../../common';
import { SubsidiaryListModule } from './subsidiary-list/subsidiary-list.module';

// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { PlannerModule } from 'app/rsb-modules/homs/planner/planner.module';
import { OrderModule } from 'app/rsb-modules/homs/order/order.module';
import {TranslateModule} from '@ngx-translate/core';










@NgModule({
  imports: [
    CommonModule,
    MalihuScrollbarModule.forRoot(),
    SubsidiaryListModule,
    AppCommonModule,
    VoucherModule,
    PlannerModule,
    OrderModule,
      TranslateModule

  ],
  declarations: [],
  entryComponents: [ConfirmModalComponent],
  exports: []
})
export class HomsModule { }


