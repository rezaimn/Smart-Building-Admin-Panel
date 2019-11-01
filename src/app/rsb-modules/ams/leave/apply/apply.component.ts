import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerModule, DateAdapter} from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import {NgModel} from '@angular/forms';
import { LeaveService } from '../leave.service';
import { PersonalInfo, EmployementDetails, EmergencyVehicle, PolicyViewObject, SumbitLeaveData } from '../leave';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { WorkTime } from '../leave';
declare let $ : any;

import {TranslateService} from '@ngx-translate/core';

import {CalendarConverterService} from '../../../../calendar-converter-service';
import * as moment from 'jalali-moment';
@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss'],
  providers: [DatePipe]
})
export class ApplyComponent implements OnInit {

  @SessionStorage('user')
  public user;

  public leaveTypes:any;
  public employeeId:any=this.user.staff_id;
  public eligibility:any;
  public days:number=0;
  public hours:number=0;
  public applyDay:number;
  public applyHours:number;

  public leavedatevalidate : boolean=true;
  public executeDisable : boolean;
  applyLeave: any = {
  };
    public alertObj: any = {};
    public currentDate: any;
    public pickedFromDate: any;
    public fromDate: any;
    public pickedToDate: any;
    public toDate: any;
  @SessionStorage('workTime')
  public workTimePolicyTemp: Array<any>;
  // public workTime: WorkTime = new WorkTime({});
 workTime: any = {
   'workEndTime': "00:00:00",
   'workStartTime': "00:00:00"
 }
  constructor(
    public dialogRef: MatDialogRef<ApplyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private leaveService: LeaveService,
    public appService: AppService,
    public datePipe:DatePipe,
    private sessionStorageService: SessionStorageService,
    public translate:TranslateService,
    public dateAdapter: DateAdapter<Date>,
    private calendarConverter: CalendarConverterService,
    private router: Router) {
      dialogRef.disableClose = true;
      let now = new Date();
      this.dateAdapter.setLocale('en-In');
      this.currentDate = this.datePipe.transform(now, 'dd/MM/yyyy');
      this.pickedFromDate = new Date(now);
      this.fromDate = this.currentDate;
      this.pickedToDate = new Date(now);
      this.toDate = this.currentDate;
  }

  ngOnInit() {
    this.getLeaveType();
  //  this.sendHeader();
      if(this.appService.currentLang=='fa'){
          let jalaliFrom=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.fromDate));
          this.pickedFromDate=moment(jalaliFrom,'jYYYY,jMM,jDD');
          let jalaliTo=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.toDate));
          this.pickedToDate=moment(jalaliTo,'jYYYY,jMM,jDD');
      }
      if(this.appService.currentLang=='en'){
          this.pickedFromDate=new Date(this.calendarConverter.convertDateFormat(this.fromDate));
          this.pickedToDate=new Date(this.calendarConverter.convertDateFormat(this.toDate));
      }
  }

  sendHeader(): void {
    // Send message to subscribers via observable subject
    
      this
        .appService
        .sendHeader("header", 'ams management', 'hello', '');
    
  }
    convertJalaliDateToUTC(tempDate: any,state:any) {
        if(state=='from'){
            this.fromDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
        }
        if(state=='to'){
            this.toDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
        }
    }
    convertGregorianDateToUTC(tempDate: any,state:any) {
        if(state=='from'){
            this.fromDate = this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
        }
        if(state=='to'){
            this.toDate = this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
        }
    }

  ngAfterViewInit() {
  }
  
  getLeaveType(){
    this
      .leaveService
      .getleaveType()
      .subscribe(res => {
        if (res.status === 200) {
          this.leaveTypes = JSON.parse(res._body);
        }
      }, (error: any) => {
          this.appService.showFail('NO LEAVE TYPE AVAILABLE');
      });
  }
  getLeaveElebibityByType(typeid){
    this
    .leaveService
    .getLeaveElebibityByType(this.employeeId,typeid)
    .subscribe(res => {
      if (res.status === 200) {
        this.leavedatevalidate=false;
        let elibilityhours = JSON.parse(res._body);
        this.eligibility=elibilityhours.toString().split(".");
        if(this.eligibility.length>=2)
        {
          this.days=this.eligibility[0];
          this.hours=this.eligibility[1];
          
        }
        else{
          this.days=this.eligibility[0];
          this.hours=0;
        }
        
      }
    }, (error: any) => {
        this.appService.showFail('NO LEAVE ELIGIBILITY AVAILABLE');
    });
  }



  submitLeave(leaveData){
  let fromdate=this.fromDate;
  let todate=this.toDate;
  //debugger
  let obj=  {
      "staffid":this.employeeId,
      "leavetypeid":Number(leaveData.leavetypeid),
      "leavefrom":fromdate+' '+leaveData.workStartTime,
      "leaveto":todate+' '+leaveData.workEndTime,
      "leavedays":this.applyDay,
      "leavehours":Math.floor(this.applyHours),
      "reasonforleave": leaveData.leavereason      
     }

    this.
    leaveService
    .submitLeave(obj)
    .subscribe(res => {
      if (res._body === 1) {
          this.closeModal();
          this.appService.showSuccess('LEAVE ADDED SUCCESSFULLY.');
        //window.location.reload();
        
      }
        if (res._body === 0) {
            this.closeModal();
            this.appService.showFail('LEAVE FAILED TO CREATE.');
            //window.location.reload();

        }
        if(res._body>=2){
            this.appService.generalExceptions(res._body);
        }
    }, (error: any) => {
        this.appService.showFail('LEAVE FAILED TO CREATE.');

    });
  }
  
  closeModal() {
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
  }

  openTimer(event : NgModel, id, data) {
  
    let eve = event;
    let self = this;
    $('#' + id)
      .mdtimepicker({
        timeFormat: 'hh:mm:ss',
        format: 'HH:mm tt',
        theme: 'blue',
        readOnly: false,
        hourPadding: false
      })
      .on('timechanged', function (e) {
        self.workTime[eve.name] = e.time;
        if (eve.name === "workEndTime") {
          self.leaveDateTimeValidation(data);
        }
      });
  }


  leaveDateTimeValidation(data){
     var oneDay = 24*60*60*1000;
     let startdate=this.datePipe.transform(data.leavefrom, 'dd/MM/yyyy');
     let enddate=this.datePipe.transform(data.leaveto, 'dd/MM/yyyy');

     let mins= Date.parse(this.pickedToDate._selected) - Date.parse(this.pickedFromDate._selected);

     let hours=mins / 1000 / 60 / 60;
     console.log("hhhhhhhhhhhhhhhhhhhhhhhh",hours);
     let days2=hours/24;
     this.applyDay=days2;
    
     let a=data.workStartTime.split(':');
     let sec1=(+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    
     let b=data.workEndTime.split(':');
     let sec2=(+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]);

     let totalsec=sec2-sec1;
     let leavehours=totalsec/ 60 / 60;
     let totalhours=(days2*8)+leavehours;

     if(leavehours=>8){
      let calday=leavehours/8;
      let calhours= leavehours%8;
      days2= days2 + (Math.round(calday));
      totalhours=totalhours+calhours;
     }
     this.applyHours= leavehours;
     let remaininghors=Number(this.days*8)+Number(this.hours);
     if(totalhours>remaininghors){
      this.executeDisable = true;
         this.appService.showFail('LEAVE FAILED TO VALIDATE.');


     }else{
      this.executeDisable = false; 
     }
     
  }


}
