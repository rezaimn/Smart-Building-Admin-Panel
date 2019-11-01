import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../app.service';
import { SessionStorage, LocalStorageService, LocalStorage } from 'ngx-webstorage';
import {  MatDialog, MatDialogRef } from '@angular/material';
import { LayoutComponent } from '../../../../common';
import { ConfirmModalComponent } from '../../../../common';
import { Router } from '@angular/router';
import { PoliciesService } from '../policies.service';
import { ManageGrade } from '../grade/grade';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss'],
})
export class TilesComponent implements OnInit {

  // Worktime
  public showData : boolean;
  public workTimeAssignedCount : any =0;
  public allWorkTimeCount : any;

  // Grades
  // public manageGrades: any = [];
  public manageGrades: ManageGrade[] = [];
  public allManageGrades: any = [];
  public gradePresent: boolean = false;

  // Allowance
  public allwancePresent : Boolean = false;
  public manageAllowance : any[] = [];
  // public allwancePresent: Boolean = false;

  constructor(public translate:TranslateService,public appService : AppService, private storage : LocalStorageService, public dialog : MatDialog, private layoutComponent : LayoutComponent, private activatedRoute : Router, private policiesService : PoliciesService) {}

  @SessionStorage('designation')
  public designation;

  @SessionStorage('subsidiary')
  public subsidiary;

  // sendHeader() : void {
  //   // send message to subscribers via observable subject
  //   if(this.designation) {
  //     this
  //       .appService
  //       .sendHeader(this.designation.designation, 'Policies', 'Manage Policy', '');
  //   }
  // }
  sendHeaderWithLogo(): void {
    // Send message to subscribers via observable subject
    if (this.designation) {
      this
        .appService
        .sendHeaderWithLogo(this.designation.designation, 'Policies', 'Manage Policy', '','../../../../../assets/images/dashboard/OMS.png');
    }
  }

  updateBreadCrums() {
    this
      .appService
      .updateBreadCrums('POLICY');
  }

  ngOnInit() {
    this.sendHeaderWithLogo();
    this.updateBreadCrums();

    // To fill the Grids
    this.getWorkTimePolicies();
    this.getGradePolicies();
    this.getGradesAvailable();
    this.getAllowanceAvailable();
  }

  getWorkTimePolicies() {
    this
      .policiesService
      .getAllWorkTimePolicy(`/rsb-oms/oms/getAllWorkTimePoliciesBySubsidairyId?subsidairyId=` + this.subsidiary.id)
      .subscribe((data) => {
        data = JSON.parse(data._body);
        if (data.length > 0) {
          this.showData = true;
          data.length = data.length <= 9
            ? '0' + data.length
            : data.length;
          this.allWorkTimeCount = data.length;
          this
            .policiesService
            .getAllWorkTimePolicy(`/rsb-oms/oms/getWorkTimePolicyGroup?subsidairyId=` + this.subsidiary.id + '&designationId=' + this.designation.id)
            .subscribe((res) => {
              let count=0;
              res = JSON.parse(res._body)
              console.log(data);
              data.forEach(element => {
                res
                  .workTimeGroupRelation
                  .forEach(e => {
                    if (element.id == e.workTimePolicy.id) {
                      count++;
                    }
                  })
              });
              this.workTimeAssignedCount = count;
            }, (error) => {
              // this
              //   .snackBar
              //   .open('Error Occured', 'okay', {
              //     duration: 1000,
              //     extraClasses: ['error-snackbar']
              //   })
            })
        } else {
          this.showData = false;
        }
      }, (error) => {
        // this
        //   .snackBar
        //   .open('Error occured', '', {duration: 1000});
      });
  }

  // Get Grade Policies
  getGradePolicies() {
    this.manageGrades = [];
    this
      .policiesService
      .getGradeList(`/rsb-oms/oms/getGradePolicyGroup?subsidairyId=` + this.subsidiary.id + '&designationId=' + this.designation.id)
      .subscribe(res => {
        if (res.status === 200 && res._body !== '') {
          let selectedGradeArrFromApi = JSON.parse(res._body);
          if (Object.keys(selectedGradeArrFromApi.gradePolicy).length >= 1) {
            this.manageGrades = selectedGradeArrFromApi.gradePolicy;
            this.gradePresent = true;
          }
        }
      }, (error : any) => {
        // this
        //   .snackBar
        //   .open('Error occured', 'Ok', {
        //     duration: 5000,
        //     // extraClasses: ['error-snackbar']
        //   });
      });
  }
  //  get allowance policies
  getAllowanceAvailable() {
    this.manageAllowance = [];
    this
      .policiesService
      .getGradeList(`/rsb-oms/oms/getAllowancePoliciesByDesignationId?designationId=` + this.designation.id)
      .subscribe(res => {
        if (res.status === 200 && res._body !== '') {
          let selectedAllowanceArrFromApi = JSON.parse(res._body);
          if (selectedAllowanceArrFromApi.length >= 1) {
            this.manageAllowance = selectedAllowanceArrFromApi;
            this.allwancePresent = true;
          }
        }
      }, (error : any) => {
        // this
        //   .snackBar
        //   .open('Error occured', 'Ok', {
        //     duration: 5000,
        //     // extraClasses: ['error-snackbar']
        //   });
      });
  }
  // get the grdaes
  getGradesAvailable() {
    this.allManageGrades = [];
    this
      .policiesService
      .getGradeList(`/rsb-oms/oms/getAllGradesPoliciesBySubsidairyId?subsidairyId=` + this.subsidiary.id)
      .subscribe(res => {
        if (res.status === 200 && res._body !== '') {
          let selectedAllowanceArrFromApi = JSON.parse(res._body);
          if (selectedAllowanceArrFromApi.length >= 1) {
            this.allManageGrades = selectedAllowanceArrFromApi;
            this.gradePresent = true;
          }
        }
      }, (error : any) => {
        // this
        //   .snackBar
        //   .open('Error occured', 'Ok', {
        //     duration: 5000,
        //     // extraClasses: ['error-snackbar']
        //   });
      });
  }

}
