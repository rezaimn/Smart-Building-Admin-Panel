import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';


import {DatabaseRoutingModule} from './database-routing.module';
import {ViewDatabaseComponent} from './view-database/view-database.component';
// Service
import {DatabaseService} from './database.service';
import {EavWrapperService} from '../../../utils/services/eav-wrapper.service';
import {EditDatabaseComponent} from 'app/rsb-modules/sp/database/edit-database/edit-database.component';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialModuleNew} from '../../../mat.module';

@NgModule({
    imports: [
        CommonModule,
        DatabaseRoutingModule,
        MaterialModuleNew,
        FormsModule,
        TranslateModule
    ],
    entryComponents: [
        EditDatabaseComponent,

    ],
    providers: [DatabaseService, EavWrapperService],
    declarations: [ViewDatabaseComponent, EditDatabaseComponent]
})
export class DatabaseModule {
}
