import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UtilsModule} from '../../../utils';
import {RoleRoutingModule} from './role-routing.module';
import {RoleSettingsComponent} from './role-settings/role-settings.component';
import {PrepareRoleComponent} from './prepare-role/prepare-role.component';
import {RoleService} from './role.service';
import {EavWrapperService} from '../../../utils/services/eav-wrapper.service';
import {FormsModule} from '@angular/forms';
import {MalihuScrollbarModule} from 'ngx-malihu-scrollbar';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
    imports: [
        CommonModule,
        RoleRoutingModule,
        UtilsModule,
        FormsModule,
        TranslateModule,
        MalihuScrollbarModule.forRoot()
    ],
    providers: [
        RoleService, EavWrapperService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [PrepareRoleComponent],
    declarations: [RoleSettingsComponent, PrepareRoleComponent]
})
export class RoleModule {
}
