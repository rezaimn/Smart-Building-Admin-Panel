import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
	QueryBuilderComponent,
	QueryInputDirective,
	QueryFieldDirective,
	QueryEntityDirective,
	QueryOperatorDirective,
	QueryButtonGroupDirective,
	QuerySwitchGroupDirective,
	QueryRemoveButtonDirective,
	QueryEmptyWarningDirective
} from './components';

@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [
		QueryBuilderComponent,
		QueryInputDirective,
		QueryOperatorDirective,
		QueryFieldDirective,
		QueryEntityDirective,
		QueryButtonGroupDirective,
		QuerySwitchGroupDirective,
		QueryRemoveButtonDirective,
		QueryEmptyWarningDirective
	],
	exports: [
		QueryBuilderComponent,
		QueryInputDirective,
		QueryOperatorDirective,
		QueryFieldDirective,
		QueryEntityDirective,
		QueryButtonGroupDirective,
		QuerySwitchGroupDirective,
		QueryRemoveButtonDirective,
		QueryEmptyWarningDirective
	]
})
export class QueryBuilderModule { }
