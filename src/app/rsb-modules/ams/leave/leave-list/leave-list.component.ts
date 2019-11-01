import { RejectComponent } from './../reject/reject.component';
import { ApproveComponent } from './../approve/approve.component';
import { ViewComponent } from './../view/view.component';
import { SubmitComponent } from './../submit/submit.component';
//import { ApproveRejectComponent } from './../../time-sheet/approve-reject/approve-reject.component';//./../approve-reject/approve-reject.component
//import { ApproveRejectComponent } from './../approve-reject/approve-reject.component';//./../approve-reject/approve-reject.component
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerModule, DateAdapter} from '@angular/material';
import { SessionStorage, SessionStorageService, LocalStorageService } from 'ngx-webstorage';
import { LayoutComponent, ConfirmModalComponent } from '../../../../common';
import { DevicePointComponent } from '../../../../utils';
import { MasterDataService, EavWrapperService, SvgService } from '../../../../utils';
import { AppService } from '../../../../app.service';
import { LeaveService } from '../leave.service';
import { ApplyComponent } from 'app/rsb-modules/ams/leave/apply/apply.component';
import { FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';
import {PaginationService} from '../../../../pagination-service';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'jalali-moment';
import {CalendarConverterService} from '../../../../calendar-converter-service';

/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;


@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss'],
  providers:[DatePipe]
})
export class LeaveListComponent implements OnInit {

  public page : number = 1;
  public perPage: number = 5;
  public totalRecordsCount:number=0;
  public totalPages:number=0;


  public scrollbarOptions = {
    axis: 'y',
    theme: 'minimal-dark',
    mouseWheel: {
      enable: true
    },
    contentTouchScroll: 200,
    scrollInertia: 0,
    mouseWheelPixels: 100
  };

  @SessionStorage('subsidiary')
  public subsidiary;
  @SessionStorage('addLeaveCount')
  public addLeaveCount;

  @SessionStorage('user')
  public user;


  public employeeArr: any;

  public myDate: Date;
  public employeeId: any = this.user.staff_id;
  public managerId: any = this.user.staff_id;
  public staffNames:any;

  public reject: any;
  public leaveStatus:any;
  leaveStatuS:any;
  public dateFlag;
  public designation:any;
  public leaveList:any;
  public isEmployee:boolean;

  showSubmit:boolean;
  showReject: boolean;

  minFromDate:Date;

    public alertObj: any = {};
    public currentDate: any;
    public pickedFromDate: any;
    public fromDate: any;
    public pickedToDate: any;
    public toDate: any;

  constructor(public dialog: MatDialog,
    public appService: AppService,
    public masterDataService: MasterDataService,
    public eavWrapperService: EavWrapperService,
    public layoutComponent: LayoutComponent,
    private sanitizer: DomSanitizer,
    private storage: LocalStorageService,
    private leaveService:LeaveService,
    public svgService: SvgService,
    public activatedRoute: Router,
    public dateAdapter: DateAdapter<Date>,
    public datePipe:DatePipe,
    public paginationService:PaginationService,
    private calendarConverter: CalendarConverterService,
    public sessionStorageService: SessionStorageService,
              public translate:TranslateService

  ) {
      let now = new Date();
      this.minFromDate = new Date();
      this.dateAdapter.setLocale('en-In');
      this.currentDate = this.datePipe.transform(now, 'dd/MM/yyyy');
      this.pickedFromDate = new Date(now);
      this.fromDate = this.currentDate;
      this.pickedToDate = new Date(now);
      this.toDate = this.currentDate;
   }

  ngOnInit() {
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
      this.appService.currentLangEmit.subscribe(
          (res: any) => {
              if(res=='fa'){
                  let jalaliFrom=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.fromDate));
                  this.pickedFromDate=moment(jalaliFrom,'jYYYY,jMM,jDD');
                  let jalaliTo=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.toDate));
                  this.pickedToDate=moment(jalaliTo,'jYYYY,jMM,jDD');
              }
              if(res=='en'){
                  this.pickedFromDate=new Date(this.calendarConverter.convertDateFormat(this.fromDate));
                  this.pickedToDate=new Date(this.calendarConverter.convertDateFormat(this.toDate));

              }
              this.sendHeaderWithLogo();
              this.getLeaves(this.page);
          }
      )
    this.sendHeaderWithLogo();
    this.addLeaveCount = 0;
    this.getLeaveStatus();
    this.showSubmit = false;
    this.showReject = false;
    if(this.user.staff_id != 0) {
      //this.getDesignation();
      this.getEmployeeByManger();
    }
    this.getLeaveStatus();
    this.updateBreadCrums();
    this.storage.observe('addClicked').subscribe((clickedRes) => {
      if (clickedRes && (this.addLeaveCount === 0 || this.addLeaveCount === null) && this.activatedRoute.url === '/rsb-modules/ams/leave/leave-list/manage') {
        if (this.addLeaveCount === null) {
          this.addLeaveCount = 0;
        } else {
          this.addLeaveCount++;
        }
        let prepareDeviceData = {
          'message': 'new',
          'index': 1
        };

        $('.page-wrapper').addClass('blur-bg');
        let dialogRef = this
          .dialog
          .open(ApplyComponent, {
            width: '768px',
            height: 'auto',
            data: prepareDeviceData
          });
        dialogRef
          .afterClosed()
          .subscribe(result => {

            $('.page-wrapper').removeClass('blur-bg');
            this
              .storage
              .store('addClicked', false);
            if (result) {

              this.addLeaveCount = 0;
            } else {
              this.addLeaveCount = 0;
            }

              this.dateFlag = 1;

                this.getLeaves(this.page);


          });
      }
    });

  }

  ngAfterViewInit() {

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

  getLeaveStatus(){
    this
      .leaveService
      .getLeaveStatus()
      .subscribe(res => {
        if (res.status === 200) {
          this.leaveStatus = JSON.parse(res._body);
          console.log(this.leaveStatus);
        }
      }, (error: any) => {
          this.appService.showFail('NO LEAVE STATUS AVAILABLE');

      });
  }


    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        let subHeader = '';
        let pageDetails = '';
        let subsidiaryName: '';
        if (this.appService.currentLang == 'en') {
            subsidiaryName = this.subsidiary.name.map.en;
        }
        if (this.appService.currentLang == 'fa') {
            subsidiaryName = this.subsidiary.name.map.fa;
        }
        let routeName='';
        this.translate.get('sub-header.manage-leaves', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.leave-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;

                                this.translate.get('route-name.apply-leave', this.appService.currentLang).subscribe(
                                    (routeNameT) => {
                                        routeName=routeNameT;
                                        this
                                            .appService
                                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/AMS.png');

                            }
                        );

                    }
                );
            }
        );
    }


  approveReject(approveReject, id, btnid) {
    console.log('the button is '+ btnid);
    this.sessionStorageService.store('approveReject', approveReject);
    let approveRejectData = {
      'approveReject': approveReject,
      'id': id,
      'btnid':btnid
    };

    this
      .layoutComponent
      .addClass();

    const dialogRef = this
      .dialog
      .open(RejectComponent, {
        width: '768px',
        height: 'auto',
        data: approveRejectData,
        hasBackdrop: true
      });

    dialogRef
      .afterClosed()
      .subscribe(result => {
        this
          .layoutComponent
          .removeClass();

            this.dateFlag = 1;
            this.getLeaves(this.page);

      });

  }

  getEmployeeByManger() {
    this.leaveService.getEmployeeByMangerId(this.employeeId).subscribe(
      res => {
        this.staffNames = JSON.parse(res._body);
        console.log(this.staffNames);
      }, (error: any) => {
        console.log(error);
      })
  }


  getLeaves(pageNO:any){
      let alertObj = {
          fromdate: this.fromDate,
          todate: this.toDate
      }
      this.alertObj.pagination = {'page': pageNO, 'records': 5};
      this.alertObj.fromdate=this.fromDate;
      this.alertObj.todate=this.toDate;
      this.alertObj.subsidiaryid=this.subsidiary.id;
      sessionStorage.setItem('alertObj', JSON.stringify(alertObj));

      this.leaveService
      .getLeaveslistBySub( this.alertObj,this.appService.currentLang)
      .subscribe(res => {
        //debugger;
        if(res._body != '[]') {
            this.leaveList = JSON.parse(res._body);
            this.totalRecordsCount = this.leaveList.totalrecords;//this.alertList.length;
            this.leaveList= this.leaveList.records;
            if (this.appService.currentCalendar == 'jalali') {
                for (let i = 0; i < this.leaveList.length; i++) {
                    let FDate=this.calendarConverter.convertDateFormat(this.leaveList[i].leavefrom);
                    let GFDate=this.calendarConverter.convertFromGregorianToJalaliString(FDate);
                    this.leaveList[i].leavefromj=GFDate;

                    let TDate=this.calendarConverter.convertDateFormat(this.leaveList[i].leaveto);
                    let GTDate=this.calendarConverter.convertFromGregorianToJalaliString(TDate);
                    this.leaveList[i].leavetoj=GTDate;
                }
            }
            // console.log("eeddddddddddddddddddd",this.leaveList);
            var x = this.totalRecordsCount % this.perPage;
            var y = this.totalRecordsCount - x;
            if(x == 0){
                this.totalPages = y / this.perPage ;
            } else {
                this.totalPages = y / this.perPage + 1;
            }          // if(this.totalPages > 1){
          //   this.totalPages = y / this.perPage + 1;
          // }
        } else {
            this.appService.showFail('NO LEAVE AVAILABLE');

        }
      }, (error: any) => {
          this.appService.showFail('NO LEAVE AVAILABLE');

      });
  }


  updateBreadCrums() {
    this.appService.updateBreadCrums('AMS-VIEW');
  }

  approveLeave(leave){

    let approvedata:any={
       "id":leave.id,
       "staffid":leave.staffid,
       "managercomments":""
    }
    this.sessionStorageService.store('approve', approvedata);
    let rejectData = {
      'reject':approvedata
    };

    this
      .layoutComponent
      .addClass();

    const dialogRef = this
      .dialog
      .open(RejectComponent, {
        width: '768px',
        height: 'auto',
        data: rejectData,
        hasBackdrop: true
      });

    dialogRef
      .afterClosed()
      .subscribe(result => {
        this
          .layoutComponent
          .removeClass();

            this.getLeaves(this.page);

      });
  }

  rejectLeave(reject) {

    let rejectdata:any={
      "id":reject.id,
      "staffid":reject.staffid,
      "managercomments":""
   }
    this.sessionStorageService.store('reject', rejectdata);
    let rejectData = {
      'reject': rejectdata,
      'type':'reject'
    };

    this
      .layoutComponent
      .addClass();

    const dialogRef = this
      .dialog
      .open(RejectComponent, {
        width: '768px',
        height: 'auto',
        data: rejectData,
        hasBackdrop: true
      });

    dialogRef
      .afterClosed()
      .subscribe(result => {
        this
          .layoutComponent
          .removeClass();

            this.getLeaves(this.page);

      });
  }


  submitLeave(leave){

    this.sessionStorageService.store('approve', leave);
    let rejectData = {
      'reject':leave
    };

    this
      .layoutComponent
      .addClass();

    const dialogRef = this
      .dialog
      .open(SubmitComponent, {
        width: '768px',
        height: 'auto',
        data: rejectData,
        hasBackdrop: true
      });

    dialogRef
      .afterClosed()
      .subscribe(result => {
        this
          .layoutComponent
          .removeClass();

            this.getLeaves(this.page);

      });
  }


  viewLeave(leave){
    this.sessionStorageService.store('approve', leave);
    let rejectData = {
      'reject':leave
    };

    this
      .layoutComponent
      .addClass();

    const dialogRef = this
      .dialog
      .open(RejectComponent, {
        width: '768px',
        height: 'auto',
        data: rejectData,
        hasBackdrop: true
      });

    dialogRef
      .afterClosed()
      .subscribe(result => {
        this
          .layoutComponent
          .removeClass();
      });
  }
    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.getLeaves(this.page);
    }

}

