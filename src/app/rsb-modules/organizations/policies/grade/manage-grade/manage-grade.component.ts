import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../../app.service';
import { PagerComponent } from '../../pager/pager.component';
import { PoliciesService } from '../../policies.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ManageGrade } from '../grade';
import { SessionStorage } from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-manage-grade',
  templateUrl: './manage-grade.component.html',
  styleUrls: ['./manage-grade.component.scss']
})
export class ManageGradeComponent implements OnInit {

  @SessionStorage('subdiaryid')
  public subdiaryid;
  
  @SessionStorage('designation')
  public designation;
  
  public manageGrades: ManageGrade[] = [];

  constructor(
    private appService: AppService,
    private pagerComponent: PagerComponent,
    private policiesService: PoliciesService,
    public translate:TranslateService) { }

  ngOnInit() {
    this.sendHeaderWithLogo();
    this.getGradesAvailable();
    this.updateBreadCrums();
    this.pagerComponent.changeState('pager', true, '', '');
    this.pagerComponent.changeState('create', false, '', '');
    this.pagerComponent.changeState('close', true, '', '');
    this.pagerComponent.changeState('edit', true, '', '/rsb-modules/organization/dept/policies/assignarea');
    this.pagerComponent.changeState('step', true, 'next policy', '/rsb-modules/organization/dept/policies/allowance/manage');
  }
  // sendHeader(): void {
  //   // send message to subscribers via observable subject
  //   if(this.designation) {
  //     this
  //     .appService
  //     .sendHeader(this.designation.designation, 'Grade policy', 'Manage Grade Policy', '');
  //   }
  // }
  sendHeaderWithLogo(): void {
    // Send message to subscribers via observable subject
    if (this.designation) {
      this
        .appService
        .sendHeaderWithLogo(this.designation.designation, 'Grade policy', 'Manage Grade Policy', '','../../../../../assets/images/dashboard/OMS.png');
    }
  }
  updateBreadCrums() {
    this
      .appService
      .updateBreadCrums('GRADES');
  }
  //  manage grade list
  getGradesAvailable() {
    this.manageGrades = [];
    this
      .policiesService
      .getGradeList(`/rsb-oms/oms/getGradePolicyGroup?subsidairyId=` + this.subdiaryid + '&designationId=' + this.designation.id)
      .subscribe(res => {
        if (res.status === 200) {
          let selectedGradeArrFromApi;
          selectedGradeArrFromApi = JSON.parse(res._body);
          this.manageGrades = selectedGradeArrFromApi.gradePolicy;
        }
      }, (error: any) => {
        // this
        //   .snackBar
        //   .open('Error occured', 'Ok', {
        //     duration: 5000,
        //     // extraClasses: ['error-snackbar']
        //   });
      });
  }

}
