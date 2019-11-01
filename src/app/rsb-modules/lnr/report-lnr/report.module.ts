import { EditReportComponentES } from './edit-report-es/edit-report-es.component';

import { CommonModule } from '@angular/common';
import { MatCardModule, MatDatepickerModule, MatNativeDateModule, MatToolbarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReportRoutingModule } from './report-routing.module';
import { ManageReportComponent } from './manage-report/manage-report.component';
import { EditReportComponent } from './edit-report/edit-report.component';
import { CronJobsComponent } from './show-cron/cron.component';


import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';


import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import {
	MatButtonModule, MatCheckboxModule, MatIconModule,
	MatMenuModule, MatSelectModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { Bootstrap3FrameworkModule } from '../../../utils/json-form/src/framework-library/bootstrap-3-framework/bootstrap-3-framework.module';
import { NoFrameworkModule } from '../../../utils/json-form/src/framework-library/no-framework/no-framework.module';
import { Bootstrap4FrameworkModule } from '../../../utils/json-form/src/framework-library/bootstrap-4-framework/bootstrap-4-framework.module';
import { MaterialDesignFrameworkModule } from '../../../utils/json-form/src/framework-library/material-design-framework/material-design-framework.module';
import { JsonSchemaFormModule, JsonSchemaFormService, FrameworkLibraryService, Framework, MaterialDesignFramework, Bootstrap3Framework } from '../../../utils/json-form';
import { WidgetLibraryService } from "app/utils/json-form/src/widget-library/widget-library.service";
import { QueryBuilderModule } from "app/utils/es-builder";
import { TimePickerComponent } from "app/rsb-modules/lnr/report-lnr/show-cron/cron-time-picker.component";
//import { QueryBuilderModule } from 'angular2-query-builder';

// import { NoFrameworkModule, Bootstrap4FrameworkModule, Bootstrap3FrameworkModule, MaterialDesignFrameworkModule } from '../../../utils/json-form/src/framework-library';
// import { JsonSchemaFormModule } from '../../../utils/json-form';
//import { BrowserModule } from "@angular/platform-browser/src/browser";
//import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// import {
// 	JsonSchemaFormModule, NoFrameworkModule, MaterialDesignFrameworkModule,
// 	Bootstrap3FrameworkModule, Bootstrap4FrameworkModule
// } from '../../lib';



@NgModule({
	imports: [
		CommonModule,
		ReportRoutingModule,
		MatDatepickerModule,
		MatNativeDateModule,
		FormsModule,
		TranslateModule,
		MatCardModule,
		MatToolbarModule,
		Bootstrap3FrameworkModule,
		//JsonSchemaFormModule.forRoot(Bootstrap3FrameworkModule),
		//  JsonSchemaFormModule.forRoot(),
		MalihuScrollbarModule.forRoot(),
		JsonSchemaFormModule,
		FlexLayoutModule, FormsModule,
		HttpClientModule, MatButtonModule, MatCardModule, MatCheckboxModule,
		MatIconModule, MatMenuModule, MatSelectModule, MatToolbarModule,
		//  RouterModule.forRoot(routes),

		NoFrameworkModule, MaterialDesignFrameworkModule,
		Bootstrap3FrameworkModule, Bootstrap4FrameworkModule,
		QueryBuilderModule
		// JsonSchemaFormModule.forRoot(
		// 	NoFrameworkModule,
		// 	MaterialDesignFrameworkModule,
		// 	Bootstrap3FrameworkModule,
		// 	Bootstrap4FrameworkModule
		// )
	],
	declarations: [
		ManageReportComponent,
		EditReportComponent,
		EditReportComponentES,
		CronJobsComponent,
		TimePickerComponent
	],
	entryComponents: [
		EditReportComponent,
		EditReportComponentES,
		CronJobsComponent
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],

	exports: [],
	providers: [

		JsonSchemaFormService,
		FrameworkLibraryService,
		WidgetLibraryService,
		{ provide: Framework, useClass: Bootstrap3Framework, multi: true }
	]
})
export class ReportModule { }
