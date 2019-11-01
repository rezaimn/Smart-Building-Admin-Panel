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
import { FormBuilder, FormControl } from '@angular/forms';
import { QueryBuilderClassNames, QueryBuilderConfig } from "app/utils/es-builder";

@Component({
	selector: 'app-root',
	templateUrl: './edit-report-es.component.html',
	styleUrls: ['./edit-report-es.component.scss'],
	styles: ['.margin30 { margin: 30px; }', 'textarea { width: 100%; height: 250px; }']
})

export class EditReportComponentES implements OnInit {

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
	public inputData: any = {
        "id":0,
        "inputParams":''
	};

	public campusDropdownList: Array<FilterArea> = [];
	public buildingDropdownList: Array<FilterArea> = [];


	public queryCtrl: FormControl;

	public bootstrapClassNames: QueryBuilderClassNames = {
		removeIcon: 'fa fa-minus',
		addIcon: 'fa fa-plus',
		button: 'btn',
		buttonGroup: 'btn-group',
		rightAlign: 'order-12 ml-auto',
		switchRow: 'd-flex px-2',
		switchGroup: 'd-flex align-items-center',
		switchRadio: 'custom-control-input',
		switchLabel: 'custom-control-label',
		switchControl: 'custom-control custom-radio custom-control-inline',
		row: 'row p-2 m-1',
		rule: 'border',
		ruleSet: 'border',
		invalidRuleSet: 'alert alert-danger',
		emptyWarning: 'text-danger mx-auto',
		operatorControl: 'form-control',
		operatorControlSize: 'col-auto pr-0',
		fieldControl: 'form-control',
		fieldControlSize: 'col-auto pr-0',
		entityControl: 'form-control',
		entityControlSize: 'col-auto pr-0',
		inputControl: 'form-control',
		inputControlSize: 'col-auto'
	};
	public query;

	public config: QueryBuilderConfig;
	public currentConfig: QueryBuilderConfig;

	constructor(
		public dialogRef: MatDialogRef<SubmitComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public appService: AppService,
		public translate: TranslateService,
		private storage: LocalStorageService,
		public sessionStorageService: SessionStorageService,
		public masterDataService: MasterDataService,
		private http: HttpService,
		private formBuilder: FormBuilder
	) {
		this.Schema = data.report.schema;
		this.reportId = data.report.id;
		//	this.Layout = data.report.layout;
		//this.queryCtrl = this.formBuilder.control(this.query);
		this.config = data.report.inputfields;
		this.currentConfig = this.config

		console.log(this.currentConfig, "pupuli");
	}
	switchModes(event: Event) {
		//	this.currentConfig = (<HTMLInputElement>event.target).checked ? this.entityConfig : this.config;
	}

	changeDisabled(event: Event) {
		(<HTMLInputElement>event.target).checked ? this.queryCtrl.disable() : this.queryCtrl.enable();
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
		console.log(this.query, " ...QUERY");

		this.inputData = {
			"id": this.reportId,
			"inputParams": this.query

		};
		console.log(this.displayData, "3333333");
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
