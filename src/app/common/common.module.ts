import { DatePipe } from '@angular/common';
//import { CheckComponentList } from './../rsb-modules/ssms/checklist/check/check.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppCommonRoutingModule } from './app-common-routing.module';
import { Ng2Webstorage } from 'ngx-webstorage';

// Importing the Common components
import { SidemenuComponent, } from './sidemenu/sidemenu.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';

// Package for custom scroll bar
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
// breadcrumb module
// import { McBreadcrumbsModule } from 'ngx-breadcrumbs';

// Services
import { AuthenticationService } from './authentication.service';
import { EavWrapperService } from '../utils/services/eav-wrapper.service';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerificationComponent } from './verification/verification.component';
import { ChecklistModule } from '../rsb-modules/ssms/checklist/checklist.module';
import { PatrolComponentList } from '../rsb-modules/ssms/checklist/patrol/patrol.component';
import { CheckComponentList } from '../rsb-modules/ssms/checklist/check/check.component';
import { SecurityService } from '../rsb-modules/ssms/security/security.service';
import { CallNotifyComponent } from 'app/common/call-notify/call-notify.component';
import { VideoCallComponent } from 'app/common/video-call/video-call.component';
import { VideoCallService } from "app/rsb-modules/vics/video-call/video-call.service";
import {TranslateModule} from '@ngx-translate/core';
import {SimpleNotificationsModule} from 'angular2-notifications';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppCommonRoutingModule,
    Ng2Webstorage,
      TranslateModule,
    MalihuScrollbarModule.forRoot(),
    // McBreadcrumbsModule.forRoot()
      SimpleNotificationsModule
  ],
  declarations: [
    LoginComponent,
      ResetPasswordComponent,
    CallNotifyComponent,
    DashboardComponent,
    PatrolComponentList,
    CheckComponentList,
    HeaderComponent,
    SidemenuComponent,
    FooterComponent,
    LayoutComponent,
   
    SubHeaderComponent,
    ConfirmModalComponent,
    ResetPasswordComponent,
    VerificationComponent,
    VideoCallComponent
  ],
  exports: [
    HeaderComponent,
    SidemenuComponent,
    CallNotifyComponent,
    // FooterComponent,
    LayoutComponent,
  ],
  entryComponents: [
    CheckComponentList,
    VideoCallComponent
  ],
  providers: [
    AuthenticationService,
    EavWrapperService,
    SecurityService,
    VideoCallService,
    DatePipe
    
  ]
})
export class AppCommonModule {
  public isCollapsed: Boolean = false;
  public dropdown_toggle: Boolean = false;
}
