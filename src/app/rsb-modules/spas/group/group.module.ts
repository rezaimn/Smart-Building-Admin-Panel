import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupRoutingModule } from './group-routing.module';
import { ManageAccessGroupComponent } from './manage-access-group/manage-access-group.component';
import { PrepareAccessGroupComponent } from './prepare-access-group/prepare-access-group.component';
import { GroupService } from './group.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
      GroupRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
      TranslateModule
  ],
  providers: [
    GroupService
  ],
  declarations: [
    ManageAccessGroupComponent,
      PrepareAccessGroupComponent
  ],
  entryComponents: [
    PrepareAccessGroupComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GroupModule { }
