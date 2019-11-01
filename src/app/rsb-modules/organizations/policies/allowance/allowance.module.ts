import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllowanceRoutingModule } from './allowance-routing.module';
import { PrepareAllowanceComponent } from './prepare-allowance/prepare-allowance.component';
import { ManageAllowanceComponent } from './manage-allowance/manage-allowance.component';
import { AllowanceService } from './allowance.service';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    AllowanceRoutingModule,
    FormsModule,
      TranslateModule
  ],
  declarations: [PrepareAllowanceComponent, ManageAllowanceComponent],
  providers: [AllowanceService]
})
export class AllowanceModule { }
