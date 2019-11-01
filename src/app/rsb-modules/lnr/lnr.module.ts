import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LnrAPIService } from './lnr-API-service';
import { PaginationService } from '../../pagination-service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExcelService } from './excel.service';
import { AppCommonModule, ConfirmModalComponent } from '../../common';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { CommonModule } from '@angular/common';
import { SubsidiaryModule } from '../lnr/subsidiary-list/subsidiary.module';
import { StaffModule } from './staff-lnr/staff.module';
import { AlertsModule } from './alerts-lnr/alerts.module';
import { LeavesModule } from './leaves-lnr/leaves.module';
import { AttendanceModule } from './attendance-lnr/attendance.module';
import { DeviceModule } from './device-lnr/device.module';
import { TranslateModule } from '@ngx-translate/core';
import { SystemLogModule } from './system-log-lnr/system-log.module';
import { ReportModule } from './report-lnr/report.module';
import {JobsModule} from './jobs-lnr/jobs.module';



@NgModule({
	imports: [
		CommonModule,
		MalihuScrollbarModule.forRoot(),
		SubsidiaryModule,
		StaffModule,
		AlertsModule,
		LeavesModule,
		ReportModule,
		AttendanceModule,
		DeviceModule,
		AppCommonModule,
		TranslateModule,
		HttpClientModule,
		SystemLogModule,
		JobsModule

	],
	declarations: [],
	entryComponents: [ConfirmModalComponent],
	providers: [ExcelService, LnrAPIService],
	exports: []
})
export class LnrModule { }
