import { ChecklistModule } from './checklist/checklist.module';



import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule} from '../../common';
// Importing different module under organiztion
import { ConfirmModalComponent } from '../../common';
import { SubsidiaryListModule } from './subsidiary-list/subsidiary-list.module';


// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { SurveillanceModule } from 'app/rsb-modules/ssms/surveillance/surveillance.module';
import { SecurityModule } from 'app/rsb-modules/ssms/security/security.module';









@NgModule({
  imports: [
    CommonModule,
    MalihuScrollbarModule.forRoot(),
    SubsidiaryListModule,
    SurveillanceModule,
    SecurityModule,
    
    AppCommonModule
  ],
  declarations: [],
  entryComponents: [ConfirmModalComponent],
  exports: []
})
export class SsmsModule { }


