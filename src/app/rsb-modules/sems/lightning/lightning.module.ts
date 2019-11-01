import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightningRoutingModule } from './lightning-routing.module';
import { ManageLightningComponent } from './manage-lightning/manage-lightning.component';
import { ViewLightningComponent } from './view-lightning/view-lightning.component';
import { LightningService } from './lightning.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    LightningRoutingModule,
      MatNativeDateModule,
      MatDatepickerModule,
    FormsModule,
      TranslateModule
  ],
  providers: [
    LightningService
  ],
  declarations: [
    ManageLightningComponent,
    ViewLightningComponent
  ],
  entryComponents: [
    ViewLightningComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LightningModule { }
