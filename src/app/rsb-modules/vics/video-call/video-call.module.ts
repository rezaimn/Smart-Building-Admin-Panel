import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoCallRoutingModule } from './video-call-routing.module';
import { VideoCallComponent } from './call/call.component';


import { VideoCallService } from './video-call.service';
import {
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { VideomodelComponent } from './videomodel/videomodel.component';
import { FilterPipe } from '../filter/filter.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialModuleNew} from '../../../mat.module';

@NgModule({
  imports: [
    CommonModule,
    VideoCallRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MalihuScrollbarModule.forRoot(),
    FormsModule,
    MatTooltipModule,
    TranslateModule,
      MaterialModuleNew

  ],
  providers: [
    VideoCallService,
    FilterPipe
  ],
  declarations: [
    VideoCallComponent,
    VideomodelComponent,
    FilterPipe

  ],
  entryComponents: [
    VideomodelComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VideoCallModule { }
