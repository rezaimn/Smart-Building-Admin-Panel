import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { StaffModule } from './staff/staff.module';
import { EditReservedParkingComponent } from 'app/rsb-modules/spms/parking/edit-reserved-parking/edit-reserved-parking.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { ParkingRoutingModule } from './parking-routing.module';
import { ManageParkingComponent } from './manage-parking/manage-parking.component';
import { ParkingService } from './parking.service';
import { UtilsModule } from '../../../utils';
import { ReserveParkingComponent } from 'app/rsb-modules/spms/parking/reserve-parking/reserve-parking.component';
import {StaffService} from './staff/staff.service';

import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

@NgModule({
    imports: [
        CommonModule,
        MalihuScrollbarModule.forRoot(),
        FormsModule,
        ParkingRoutingModule,
        MatDatepickerModule,
        MatNativeDateModule,
        UtilsModule,
        StaffModule,
        TranslateModule,
        DpDatePickerModule

    ],
    declarations: [ManageParkingComponent,ReserveParkingComponent, EditReservedParkingComponent],
    providers: [ParkingService,  DatePipe,StaffService ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents : [ReserveParkingComponent, EditReservedParkingComponent]
})
export class ParkingModule { }
