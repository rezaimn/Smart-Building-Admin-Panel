import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
// Importing different module under organiztion
import {AppCommonModule, ConfirmModalComponent} from '../../common';
// Package for custom scroll bar
import {MalihuScrollbarModule} from 'ngx-malihu-scrollbar';
import {DatabaseModule} from 'app/rsb-modules/sp/database/database.module';

import {UrlModule} from 'app/rsb-modules/sp/url/url.module';

import {RoleModule} from './role/role.module';
import {TypeSettingsModule} from './type-settings/type-settings.module';
import {SpaceSettingsModule} from './space-management/space-settings.module';

@NgModule({
    imports: [
        CommonModule,
        MalihuScrollbarModule.forRoot(),
        DatabaseModule,
        UrlModule,
        AppCommonModule,
        RoleModule,
        TypeSettingsModule,
        SpaceSettingsModule
    ],
    declarations: [],
    entryComponents: [ConfirmModalComponent],
    exports: [
    ]
})
export class SpModule {
}


