import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { JsonSchemaFormService } from '../json-schema-form.service';
import { buildTitleMap, isArray } from '../shared';

import { HttpService } from '../../../services/http.service';
import { AppService } from '../../../../app.service';
import index from '@angular/cli/lib/cli';

@Component({
	selector: 'inputrsb-widget',
	template: `

		<div
      [class]="options?.htmlClass || ''">
      <label *ngIf="options?.title"
        [attr.for]="'control' + layoutNode?._id"
        [class]="options?.labelHtmlClass || ''"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></label>
      <select *ngIf="boundControl"
        [formControl]="formControl"
		(change)="updateValue($event)"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode?._id"
        [name]="controlName">
        <ng-template ngFor let-selectItem [ngForOf]="selectList">
          <option *ngIf="!isArray(selectItem?.items)"
            [value]="selectItem?.value">
            <span [innerHTML]="selectItem?.name"></span>
          </option>
          <optgroup *ngIf="isArray(selectItem?.items)"
            [label]="selectItem?.group">
            <option *ngFor="let subItem of selectItem.items"
              [value]="subItem?.value">
              <span [innerHTML]="subItem?.name"></span>
            </option>
          </optgroup>
        </ng-template>
      </select>
      <select *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        (change)="updateValue($event)">
        <ng-template ngFor let-selectItem [ngForOf]="selectList">
          <option *ngIf="!isArray(selectItem?.items)"
            [selected]="selectItem?.value === controlValue"
            [value]="selectItem?.value">
            <span [innerHTML]="selectItem?.name"></span>
          </option>
          <optgroup *ngIf="isArray(selectItem?.items)"
            [label]="selectItem?.group">
            <option *ngFor="let subItem of selectItem.items"
              [attr.selected]="subItem?.value === controlValue"
              [value]="subItem?.value">
              <span [innerHTML]="subItem?.name"></span>
            </option>
          </optgroup>
        </ng-template>
      </select>
	  </div>`,
})
export class RSBSelectComponent implements OnInit {

	public name: any = [];


	formControl: AbstractControl;
	controlName: string;
	controlValue: any;
	controlDisabled = false;
	boundControl = false;
	nextControl: any;
	options: any;
	api: any;
	data: any = {};

	queryParams: any;
	selectList: any[] = [];

	isArray = isArray;
	@Input() layoutNode: any;
	@Input() layoutIndex: number[];
	@Input() dataIndex: number[];
	@Input() queryString: any;
	@Input() parentId: any;
	@Input() getApi: any;

	constructor(
		private jsf: JsonSchemaFormService,
		private http: HttpService,
		public appService: AppService
	) {

	}
	ngOnInit() {

		this.options = this.layoutNode.options || {};
		this.nextControl = this.options.nextControl;
		this.selectList = buildTitleMap(
			this.options.titleMap || this.options.enumNames,
			this.options.enum, !!this.options.required, !!this.options.flatList
		);
		this.jsf.initializeControl(this);
		this.jsf.addToComponentList(this);
		this.getData();
	}
	getData() {
		console.log('111: options ::',this.options , '2222:queryParams :: ', this.options.queryParams);
        this.api = this.options.api;

		if (this.options.queryParams > 0) {
			this.data = {
				"queryString": this.options.queryString,
				"inputParams": {
					"parentId": this.options.queryParams
				}
			};
		} else {
			this.data = {
				"queryString": this.options.queryString,
				"inputParams": {
				}
			};
		}
		this.options.enumNames = [];
		this.options.enum = [];
		this.http.post(this.api +'?Accept-Language=' + this.appService.currentLang  , this.data).subscribe(res => {
			// { a loop of the data }  push to this.options.enum the ids and this.options.enumNames the names
			const allItems = JSON.parse(res._body);
			for (let i = 0; allItems.length > i; i++) {
				let name = allItems[i].name;
				let id = allItems[i].id;
				this.options.enumNames.push(name);
				this.options.enum.push(id);
			}
			this.selectList = buildTitleMap(
				this.options.titleMap || this.options.enumNames,
				this.options.enum, !!this.options.required, !!this.options.flatList
			);

		});
	}

	updateValue(event) {
		this.jsf.updateValue(this, event.target.value);
	}
	updateQueryParam(value) {
		this.options.queryParams = value;
		console.log(this.queryParams , "queryparam" , this.controlName , this.controlValue);
		this.getData();
	}
}
