import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { PersonalInfo, EmployementDetails, EmergencyVehicle, PolicyViewObject } from '../time-sheet';
import { Router } from '@angular/router';
import { TimeSheetService } from '../time-sheet.service';
import { LeaveService } from '../leave.service';

import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-approve-rejectd',
  templateUrl: './reject.component.html',
  styleUrls: ['./reject.component.scss']
})
export class RejectComponent implements OnInit {

  public staff: any = {};
  public  mngercmnts: any;
  public now = moment();
  managercomments:any;
  staffcomments:any;
  approvalStatus: boolean;
  
  public cardNumber:string;
  public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));
  public designation: any;
  public showStaff: any;
  viewState: boolean;
  @SessionStorage('approvereject')
  public approvereject;



  @SessionStorage('user')
  public user;
 
  constructor(
  
    public dialogRef: MatDialogRef<RejectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private staffService: TimeSheetService,
    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    public translate:TranslateService,

    private timeSheetService:TimeSheetService,
    private leaveService: LeaveService
    ) {
      dialogRef.disableClose = true;
    this.staff = data;
    console.log(data, 'this.staff');
    //console.log(data.btnid, 'this.staff');
  }

  ngOnInit() {
   // this.sendHeader();
   this.showStaff = false;
   if(this.user.staff_id != 0) {
     this.getDesignation();
   }

   if(this.data.approveReject.id){
    this.leaveService.getLeaveById(this.data.approveReject.id).subscribe(
      res => {
        this.mngercmnts = JSON.parse(res._body);
        console.log(this.mngercmnts);
      }, (error: any) => {
        console.log(error);
      })
  }
  //getting the button type
    if(this.data.btnid === 1){
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
    // console.log(appRejTime, 'ffffffappRejTime');
    this.leaveService.approveLeave(appRejTime).subscribe(
      res => {
        console.log(res);
        if (res.status === 200) {

          this.closeModal();
          /* For Disable the Approve buuton */
          this.approvalStatus = false;
          console.log('it is triggered!!');
        }
      }, (error: any) => {
        console.log(error);
      })
  }
  
  // approve time sheet
  rejectTime(appRejTime) {
    console.log(appRejTime, 'appRejTime');
    if(appRejTime.managercomments) {
      this.leaveService.rejectLeave(appRejTime).subscribe(
      res => {
        console.log(res);
        if (res.status === 200) {
           this.closeModal();
        }
      }, (error: any) => {
        console.log(error);
      })
    } else {

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
        console.log(res);
        if (res.status === 200) {
          this.closeModal();
        }
      }, (error: any) => {
        console.log(error);
      })
  }
}
