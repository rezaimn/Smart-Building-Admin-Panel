import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { PersonalInfo, EmployementDetails, EmergencyVehicle, PolicyViewObject } from '../time-sheet';
import { Router } from '@angular/router';
import { TimeSheetService } from '../time-sheet.service';

import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-approve-reject',
  templateUrl: './approve-reject.component.html',
  styleUrls: ['./approve-reject.component.scss']
})
export class ApproveRejectComponent implements OnInit {

  public staff: any = {};

  public now = moment();
  
  public cardNumber:string;
  public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));
  public designation: any;
  public showStaff: any;
  viewState: boolean;
  rejectState:boolean;

  @SessionStorage('approvereject')
  public approvereject;

  @SessionStorage('user')
  public user;

  constructor(
    public dialogRef: MatDialogRef<ApproveRejectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private staffService: TimeSheetService,
    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    public translate:TranslateService,

    private router: Router,
    private timeSheetService:TimeSheetService
    ) {
      dialogRef.disableClose = true;
    this.staff = data;
    console.log(data, 'this.staff');
  }

  ngOnInit() {
    
        console.log('the data is:'+ this.approvereject);

   // this.sendHeader();
   this.showStaff = false;
   if(this.user.staff_id != 0) {
     this.getDesignation();
   }
   //getting button
    if(this.data.btnId === 1){
      this.viewState = true;
    } else if(this.data.btnId === 2) {
      this.rejectState = true;
    }
    if(this.user.staff_id == 0) {
      this.viewState = true;
    }
  }

  sendHeader(): void {
    // Send message to subscribers via observable subject
    
      this
        .appService
        .sendHeader("header", 'alms management', 'hello', '');
    
  }

  ngAfterViewInit() {
  }
  
  
  closeModal() {
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
  }

  // get designation
  getDesignation() {
    this.timeSheetService.getDesignation(this.user.staff_id).subscribe(
    res => {
      this.designation = JSON.parse(res._body);
      console.log(this.designation);
      if(this.designation.designation == 'Staff'){
        this.showStaff = true;
      }
    }, (error: any) => {
      console.log(error);
    })
  }

  // approve time sheet
  appRejTime: any = {
    "id": this.approvereject.id,
    "employeeid": this.approvereject.employeeid
  }
  approveTime(appRejTime) {
    console.log(appRejTime, 'appRejTime');
    this.timeSheetService.approveTimeSheet(appRejTime).subscribe(
      res => {
        console.log(res);
        if (res.status === 200) {
            this.translate.get('error-messages.time-approved-success',this.appService.currentLang).subscribe(
                (subHeaderT)=> {
                    this.appService.showSuccess(subHeaderT);
                }
            );

            this.closeModal();
        }
      }, (error: any) => {
            this.translate.get('error-messages.time-failed-to-approve',this.appService.currentLang).subscribe(
                (subHeaderT)=> {
                    this.appService.showFail(subHeaderT);
                }
            )

        })
  }
  
  // approve time sheet
  rejectTime(appRejTime) {
    console.log(appRejTime, 'appRejTime');
    if(appRejTime.managercomments) {
      this.timeSheetService.rejectTimeSheet(appRejTime).subscribe(
      res => {
        console.log(res);
        if (res.status === 200) {
            this.translate.get('error-messages.time-rejected-success',this.appService.currentLang).subscribe(
                (subHeaderT)=> {
                    this.appService.showSuccess(subHeaderT);
                }
            );

            this.closeModal();
        }
      }, (error: any) => {
        console.log(error);
      })
    } else {
        this.translate.get('error-messages.time-failed-to-reject',this.appService.currentLang).subscribe(
            (subHeaderT)=> {
                this.appService.showFail(subHeaderT);
            }
        )

    }
  }

  // approve time sheet
  submitTime(submitTime) {
    console.log(submitTime, 'appRejTime');
    submitTime.employeeid = this.approvereject.employeeid;
    submitTime.timesheetdate = this.approvereject.timesheetdate;
    submitTime.fromtime = this.approvereject.fromtime;
    submitTime.totime = this.approvereject.totime;
    submitTime.staffcomments = this.approvereject.staffcomments
    this.timeSheetService.submitTimeSheet(submitTime).subscribe(
      res => {
          if(res._body == 1) {
              this.translate.get('error-messages.time-added-success',this.appService.currentLang).subscribe(
                  (subHeaderT)=> {
                      this.appService.showSuccess(subHeaderT);
                  }
              );
              this.closeModal();
          }
          if(res._body==0){
              this.translate.get('error-messages.time-failed-to-approve',this.appService.currentLang).subscribe(
                  (subHeaderT)=> {
                      this.appService.showFail(subHeaderT);
                  }
              )

          }
          if(res._body>=2){
              this.appService.generalExceptions(res._body);
          }
      }, (error: any) => {
            this.translate.get('error-messages.time-failed-to-approve',this.appService.currentLang).subscribe(
                (subHeaderT)=> {
                    this.appService.showFail(subHeaderT);
                }
            )
        })
  }
}
