import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SystemLogRoutingModule} from './system-log-routing.module';
import {SystemLogTableComponent} from './system-log-table.component';
import {MatDatepickerModule, MatNativeDateModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';


// import { MaterialModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        SystemLogRoutingModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FormsModule,
        TranslateModule,
        DpDatePickerModule
    ],
    declarations: [
        SystemLogTableComponent,
    ],
    exports: [],
    providers: []
})
export class SystemLogModule {
}


