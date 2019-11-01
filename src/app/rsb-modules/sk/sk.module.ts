import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// Importing different module under organiztion
import {AppCommonModule, ConfirmModalComponent} from '../../common';
import {SubsidiaryListModule} from './subsidiary-list/subsidiary-list.module';
// Package for custom scroll bar
import {MalihuScrollbarModule} from 'ngx-malihu-scrollbar';
import {ContentSchedulingModule} from './sk-manager/programing/content-scheduling.module';
import {TranslateModule} from '@ngx-translate/core';
import {ContentManagementModule} from './sk-manager/content-management/content-management.module';


@NgModule({
    imports: [
        CommonModule,
        MalihuScrollbarModule.forRoot(),
        SubsidiaryListModule,
        ContentSchedulingModule,
        ContentManagementModule,
        AppCommonModule,
        TranslateModule
    ],
    declarations: [],
    entryComponents: [ConfirmModalComponent],
    exports: []
})
export class SkModule {
}


