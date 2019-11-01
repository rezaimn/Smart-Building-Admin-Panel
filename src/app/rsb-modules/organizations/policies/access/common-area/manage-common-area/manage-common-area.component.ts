import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../../../app.service';
import { PagerComponent } from '../../../pager/pager.component';
import { PoliciesService } from '../../../policies.service';
import { MatDialog, MatDialogRef } from '@angular/material';

import { SessionStorage } from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-manage-common-area',
  templateUrl: './manage-common-area.component.html',
  styleUrls: ['./manage-common-area.component.scss']
})
export class ManageCommonAreaComponent implements OnInit {
  @SessionStorage('subdiaryid')
  public subdiaryid;

  @SessionStorage('designation')
  public designation;
  public tipActive: boolean = false;
  public tipX: number;
  public tipY: number;
  // public manageGrades: ManageGrade[] = [];
  constructor(
    private appService: AppService,
    private pagerComponent: PagerComponent,
    private policiesService: PoliciesService,
    public translate:TranslateService
  ) {
    this.pagerComponent.changeState('pager', true, '', '');
    this.pagerComponent.changeState('create', true, '', '/rsb-modules/organization/dept/policies/common-area/prepare');
    this.pagerComponent.changeState('close', true, '', '');
    this.pagerComponent.changeState('edit', false, '', '/rsb-modules/organization/dept/policies/assignarea');
    this.pagerComponent.changeState('step', true, 'next policy', '/rsb-modules/organization/dept/policies/allowance/manage');
  }

  ngOnInit() {
    this.sendHeaderWithLogo();
    // this.getGradesAvailable();
    this.updateBreadCrums();
  }
  // sendHeader(): void {
  //   // send message to subscribers via observable subject
  //   if (this.designation) {
  //     this
  //       .appService
  //       .sendHeader(this.designation.designation, 'common area', 'Manage common area Policy', '');
  //   }
  // }
  sendHeaderWithLogo(): void {
    // Send message to subscribers via observable subject
    if (this.designation) {
      this
        .appService
        .sendHeaderWithLogo(this.designation.designation, 'common area', 'Manage common area Policy', '','../../../../../assets/images/dashboard/OMS.png');
    }
  }
  updateBreadCrums() {
    this
      .appService
      .updateBreadCrums('common area');
  }
  showTooltip(event) {
    console.log(event);
    this.tipActive = true;
    this.tipX = event.layerX - 110;
    this.tipY = event.layerY + 20;
    if (this.tipX < 0) {
      this.tipX = 10;
    }

  }
}
