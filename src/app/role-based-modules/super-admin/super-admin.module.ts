import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppCommonModule} from '../../common';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { ManageOrganizationComponent } from './manage-organization/manage-organization.component';
import { PrepareOrganizationComponent } from './prepare-organization/prepare-organization.component';
import { SecureOtpComponent } from './secure-otp/secure-otp.component';
import { SaLayoutComponent } from './sa-layout/sa-layout.component';

//Services
import { SuperAdminService } from './super-admin.service';
import { LoggerService } from '../../utils/services/logger.service';
import { EavWrapperService } from '../../utils/services/eav-wrapper.service';

@NgModule({
  imports: [
    CommonModule,
    SuperAdminRoutingModule,
    AppCommonModule,
    FormsModule
  ],
  declarations: [
    ManageOrganizationComponent,
    SecureOtpComponent,
    SaLayoutComponent,PrepareOrganizationComponent
  ],
  providers: [
    SuperAdminService,
    LoggerService,
    EavWrapperService
  ]
})
export class SuperAdminModule { }
