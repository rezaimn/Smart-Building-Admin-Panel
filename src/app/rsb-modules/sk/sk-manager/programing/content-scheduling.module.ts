import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentSchedulingRoutingModule } from './content-scheduling-routing.module';
import { ContentSchedulingComponent } from './content-scheduling/content-scheduling.component';
import { SkService } from '../../sk.service';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {AttachFileComponent} from 'app/rsb-modules/sk/sk-manager/programing/attach-sk-file/attach-file.component';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service';
import {MaterialModuleNew} from '../../../../mat.module';
import {MalihuScrollbarModule} from 'ngx-malihu-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    ContentSchedulingRoutingModule,
    MaterialModuleNew,
    FormsModule,
    TranslateModule,
      MalihuScrollbarModule.forRoot()

  ],
    entryComponents: [
        AttachFileComponent
    ],
  providers: [
    SkService,
      EavWrapperService
  ],
  declarations: [
    ContentSchedulingComponent,
      AttachFileComponent,
  ],

})
export class ContentSchedulingModule { }
