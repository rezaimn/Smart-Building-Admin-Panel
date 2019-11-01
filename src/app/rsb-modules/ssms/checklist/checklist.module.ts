//import { SecurityService } from './../security/security.service';
import { CheckComponentList } from './check/check.component';
import { PatrolComponentList } from './patrol/patrol.component';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
//import { SecurityRoutingModule } from './security-routing.module';

//import { SecurityService } from './security.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SecurityRoutingModule } from 'app/rsb-modules/ssms/checklist/checklist-routing.module';
import { SecurityService } from './checklist.service';
//import { SecurityService } from '../check/security.service';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [

    SecurityRoutingModule,
      MatDatepickerModule,
      MatNativeDateModule,
    FormsModule,
    TranslateModule
  ],
  providers: [
    SecurityService
  ],
  declarations: [
   // PatrolComponentList,
   // CheckComponentList
  ],
  exports:
  [
   // PatrolComponentList,
   // CheckComponentList
  ],
  entryComponents: [
    PatrolComponentList
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChecklistModule { }
