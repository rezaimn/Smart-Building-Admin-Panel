import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UtilsModule} from '../../../utils';
import {TypeSettingsRoutingModule} from './type-settings-routing.module';
import {TypeSettingsComponent} from './type-settings/type-settings.component';
import {PrepareTypeComponent} from './prepare-type/prepare-type.component';
import {TypeSettingsService} from './type-settings.service';
import {EavWrapperService} from '../../../utils/services/eav-wrapper.service';
import {FormsModule} from '@angular/forms';
import {MalihuScrollbarModule} from 'ngx-malihu-scrollbar';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
    imports: [
        CommonModule,
        TypeSettingsRoutingModule,
        UtilsModule,
        FormsModule,
        TranslateModule,
        MalihuScrollbarModule.forRoot()
    ],
    providers: [
        TypeSettingsService, EavWrapperService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [PrepareTypeComponent],
    declarations: [TypeSettingsComponent, PrepareTypeComponent]
})
export class TypeSettingsModule {
}
