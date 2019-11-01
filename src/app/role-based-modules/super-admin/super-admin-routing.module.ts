import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importing the Layout component
import { SaLayoutComponent } from './sa-layout/sa-layout.component';

import { ManageOrganizationComponent } from './manage-organization/manage-organization.component';
import { SecureOtpComponent } from './secure-otp/secure-otp.component';

const routes: Routes = [
  {
    path: '',
    component: SaLayoutComponent,
    children: [
      {
        path: 'manage',
        component: ManageOrganizationComponent
      },
      {
        path: 'otp',
        component: SecureOtpComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
