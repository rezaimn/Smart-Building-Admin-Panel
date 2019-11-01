import { VideoCallModule } from './video-call/video-call.module';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule} from '../../common';
// Importing different module under organiztion
import { ConfirmModalComponent } from '../../common';
import { SubsidiaryListModule } from './subsidiary-list/subsidiary-list.module';

// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { FilterPipe } from './filter/filter.pipe';
import {MaterialModuleNew} from '../../mat.module';


@NgModule({
  imports: [
    CommonModule,
    MalihuScrollbarModule.forRoot(),
    SubsidiaryListModule,
    AppCommonModule,
    VideoCallModule,
   MaterialModuleNew
    
  ],
 
  entryComponents: [ConfirmModalComponent],
  exports: [],
  declarations: []
})
export class VicsModule { }


