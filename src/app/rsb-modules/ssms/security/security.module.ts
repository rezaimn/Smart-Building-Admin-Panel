import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityRoutingModule } from './security-routing.module';
import { PatrolComponent } from './patrol/patrol.component';
import { CheckComponent } from './check/check.component';
import { SecurityService } from './security.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
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
    PatrolComponent,
    CheckComponent
  ],
  entryComponents: [
    CheckComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SecurityModule { }
