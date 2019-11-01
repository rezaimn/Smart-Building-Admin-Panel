import { ViewOrderComponent } from './view/view.component';
import { OrderListComponent } from './order-list/order-list.component';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderRoutingModule } from './order-routing.module';
import { OrderService } from './order.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AddOrderComponent } from 'app/rsb-modules/homs/order/add-order/add-order.component';
import { DeleteOrderComponent } from './delete-order/delete-order.component';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule,
      DpDatePickerModule
  ],
  providers: [
    OrderService,
    DatePipe
  ],
  declarations: [
    OrderListComponent,
    AddOrderComponent,
    ViewOrderComponent,
    DeleteOrderComponent,
  ],
  entryComponents: [
    AddOrderComponent,
    ViewOrderComponent,
    DeleteOrderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderModule { }
