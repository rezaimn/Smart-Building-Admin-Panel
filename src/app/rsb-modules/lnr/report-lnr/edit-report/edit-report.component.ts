import { Component, Inject, OnInit } from '@angular/core';
import { MasterDataService } from '../../../../utils/services/master-data.service';
import { EavWrapperService } from '../../../../utils/services/eav-wrapper.service';
import { LocalStorageService, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { TranslateService } from '@ngx-translate/core';
import { FilterArea } from '../../../../utils/components/filter-area/filter-area';
import { WidgetLibraryService, RSBSelectComponent } from '../../../../utils/json-form';
import { HttpService } from '../../../../utils/services/http.service';
import { SubmitComponent } from '../../../ams/time-sheet/submit/submit.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppService } from '../../../../app.service';
//import {WidgetLibraryService} from '../../../../angular2-json-schema-form-master/src/lib/src/widget-library/widget-library.service';


@Component({
	selector: 'app-root',
	templateUrl: './edit-report.component.html',
	styleUrls: ['./edit-report.component.scss']
})

export class EditReportComponent implements OnInit {

	@SessionStorage('subdiaryId')
	public subdiaryId;
	@SessionStorage('subsidiary')
	public subsidiary;


	public newWidgets: any;
	public Schema: any = {};
	public Layout: any = {};
	public reportId = 0;
	public queryString: any;
	public parentId: any;
	public inputData: any = {};

	public campusDropdownList: Array<FilterArea> = [];
	public buildingDropdownList: Array<FilterArea> = [];


	constructor(
		public dialogRef: MatDialogRef<SubmitComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public appService: AppService,
		public translate: TranslateService,
		private storage: LocalStorageService,
		public sessionStorageService: SessionStorageService,
		public masterDataService: MasterDataService,
		private http: HttpService
	) {
		this.Schema = data.report.schema;
		this.reportId = data.report.id;
		this.Layout = data.report.layout;

	}

	ngOnInit() {
		this.newWidgets = {
			select: RSBSelectComponent
		}
	}

	displayData: any = null;
	exampleOnSubmitFn(formData) {
		this.displayData = formData;
		this.closeModal();
	}

	yourOnChangesFn(formData) {
		this.displayData = formData;

	}
	executeModal() {
		this.inputData = {
			"id": this.reportId,
			"inputParams": this.displayData

		};
		this
			.dialogRef
			.close(this.inputData);
		this.dialogRef = null;

	}
	closeModal() {

		this
			.dialogRef
			.close(null);
		this.dialogRef = null;

	}


}
