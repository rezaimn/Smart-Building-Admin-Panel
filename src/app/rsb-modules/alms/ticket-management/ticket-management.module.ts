import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketManagementRoutingModule } from './ticket-management-routing.module';
import { ManageTicketComponent } from './manage-ticket/manage-ticket.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';
import { TicketManagementService } from './ticket-management.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

@NgModule({
  imports: [
    CommonModule,
    TicketManagementRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule,
      DpDatePickerModule
  ],
  providers: [
    TicketManagementService
  ],
  declarations: [
    ManageTicketComponent,
    EditTicketComponent
  ],
  entryComponents: [
    EditTicketComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TicketManagementModule { }
