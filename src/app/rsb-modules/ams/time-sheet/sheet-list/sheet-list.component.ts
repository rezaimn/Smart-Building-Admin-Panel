import {ApproveRejectComponent} from './../approve-reject/approve-reject.component';

import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DateAdapter, MatDialog} from '@angular/material';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {LayoutComponent} from '../../../../common';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import {AppService} from '../../../../app.service';
import {SubmitComponent} from 'app/rsb-modules/ams/time-sheet/submit/submit.component';
import {TimeSheetService} from '../time-sheet.service';
import {DatePipe} from '@angular/common';
import {PaginationService} from '../../../../pagination-service';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'jalali-moment';
import {CalendarConverterService} from '../../../../calendar-converter-service';

/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
    selector: 'app-sheet-list',
    templateUrl: './sheet-list.component.html',
    styleUrls: ['./sheet-list.component.scss'],
    providers: [DatePipe]
})
export class SheetListComponent implements OnInit {


    public page: number = 1;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;


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

    @SessionStorage('user')
    public user;

    public employeeArr: any = [];
    public myDate: Date;
    public designation: any;
    public showDesignation: any;
    public staffNames: any;
    public employeeId: any = this.user.staff_id;
    public managerId: any = this.user.staff_id;
    public status_approved: boolean;
    public status_rejected: boolean;
    showStaffBtn: any;

    public alertObj: any = {};
    public currentDate: any;
    public pickedFromDate: any;
    public fromDate: any;
    public pickedToDate: any;
    public toDate: any;
    // get employee time sheet
    employeeDate: any = {
        'fromdate': 'From Date',
        'todate': 'To Date'
    };

    constructor(public dialog: MatDialog,
                public appService: AppService,
                public masterDataService: MasterDataService,
                public eavWrapperService: EavWrapperService,
                public layoutComponent: LayoutComponent,
                private sanitizer: DomSanitizer,
                private storage: LocalStorageService,
                public svgService: SvgService,
                public translate: TranslateService,
                public activatedRoute: Router,
                public sessionStorageService: SessionStorageService,
                private timeSheetService: TimeSheetService,
                public dateAdapter: DateAdapter<Date>,
                private datePipe: DatePipe,
                public paginationService: PaginationService,
                private calendarConverter: CalendarConverterService,
    ) {
        let now = new Date();
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
                this.getEmployeeData(this.page);
            }
        )
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.showStaffBtn = false;
        if (this.user.staff_id != 0) {
            this.getDesignation();
            this.getEmployeeByManger();
        }
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
        // let routeName='';
        this.translate.get('sub-header.manage-sheet-list', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.sheet-list-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;


                        this
                            .appService
                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, '', '../../../../../assets/images/dashboard/AMS.png');

                    }
                );

            }
        );

    }

    updateBreadCrums() {
        this.appService.updateBreadCrums('AMS-VIEW');
    }

    /* Submit PopUp for Employee  */
    submit(submit) {
        this.sessionStorageService.store('submit', submit);
        let submitData = {
            'submit': submit
        };

        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(SubmitComponent, {
                width: '768px',
                height: 'auto',
                data: submitData,

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

    approveReject(approveReject, id, btnStatus) {
        this.sessionStorageService.store('approveReject', approveReject);
        let approveRejectData = {
            'approveReject': approveReject,
            'id': id,
            'btnId': btnStatus
        };

        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(ApproveRejectComponent, {
                width: '768px',
                height: 'auto',
                data: approveRejectData,
                hasBackdrop: true,


            });

        dialogRef
            .afterClosed()
            .subscribe(result => {
                this
                    .layoutComponent
                    .removeClass();
            });
    }

    // get designation
    getDesignation() {
        this.timeSheetService.getDesignation(this.user.staff_id).subscribe(
            res => {
                this.designation = JSON.parse(res._body);
                console.log(this.designation);
                if (this.designation.designation == 'CEO') {
                    this.showDesignation = true;
                } else if (this.designation.designation == 'Staff' || this.user.staff_id == 0) {
                    this.showDesignation = false;
                }
            }, (error: any) => {
                console.log(error);
            })
    }

    // get staff name types
    getEmployeeByManger() {
        this.timeSheetService.getEmployeeByMangerId(this.employeeId).subscribe(
            res => {
                this.staffNames = JSON.parse(res._body);
                console.log(this.staffNames);
            }, (error: any) => {
                console.log(error);
            })
    }

    getEmployeeData(pageNO:any) {
        this.employeeArr = [];
        let alertObj = {
            fromdate: this.fromDate,
            todate: this.toDate
        }
        this.alertObj.pagination = {'page': pageNO, 'records': 5};
        this.alertObj.fromdate=this.fromDate;
        this.alertObj.todate=this.toDate;
        this.alertObj.subsidiaryid=this.subsidiary.id;
        // if (this.user.staff_id == 0) {
            this.timeSheetService.getEmployeeTimeSheet(this.alertObj, this.appService.currentLang).subscribe(
                res => {
                    if (res._body != '[]') {
                        this.employeeArr = JSON.parse(res._body);
                        this.totalRecordsCount = this.employeeArr.length;
                        var x = this.totalRecordsCount % this.perPage;
                        var y = this.totalRecordsCount - x;
                        if (x == 0) {
                            this.totalPages = y / this.perPage;
                        } else {
                            this.totalPages = y / this.perPage + 1;
                        }

                        let employeeL = JSON.parse(res._body);
                        this.totalRecordsCount = employeeL.totalrecords;//this.alertList.length;
                        this.employeeArr = employeeL.records;
                        if (this.appService.currentCalendar == 'jalali') {
                            for (let i = 0; i < this.employeeArr.length; i++) {
                                let FDate=this.calendarConverter.convertDateFormat(this.employeeArr[i].timesheetdate);
                                let GFDate=this.calendarConverter.convertFromGregorianToJalaliString(FDate);
                                this.employeeArr[i].timesheetdate=GFDate;
                            }
                        }

                        var x = this.totalRecordsCount % this.perPage;
                        var y = this.totalRecordsCount - x;
                        if (x == 0) {
                            this.totalPages = y / this.perPage;
                        } else {
                            this.totalPages = y / this.perPage + 1;
                        }

                        if (this.employeeArr.status === 'Approved') {
                            this.status_approved = true;
                        } else if (this.employeeArr.status === 'Submitted') {
                            this.status_rejected = true;
                        }

                    } else {
                        this.appService.showFail('NO EMPLOYEE AVAILABLE');

                    }
                }, (error: any) => {
                    console.log(error);
                    this.appService.showFail('NO EMPLOYEE AVAILABLE');

                })
        // }
        // if (this.showDesignation == false) {
        //     if (this.designation.designation == 'Staff') {
        //         this.showStaffBtn = true;
        //         this.alertObj.employeeid = this.employeeId;
        //         this.timeSheetService.getTimeSheetByEmployee(this.alertObj).subscribe(
        //             res => {
        //                 if (res._body != '[]') {
        //
        //                     let employeeL = JSON.parse(res._body);
        //                     this.totalRecordsCount = employeeL.totalrecords;//this.alertList.length;
        //                     this.employeeArr = employeeL.records;
        //                     var x = this.totalRecordsCount % this.perPage;
        //                     var y = this.totalRecordsCount - x;
        //                     if (x == 0) {
        //                         this.totalPages = y / this.perPage;
        //                     } else {
        //                         this.totalPages = y / this.perPage + 1;
        //                     }
        //                 } else {
        //                     this.appService.showFail('NO EMPLOYEE AVAILABLE');
        //
        //                 }
        //             }, (error: any) => {
        //                 this.appService.showFail('NO EMPLOYEE AVAILABLE');
        //
        //             })
        //     }
        // } else if (this.showDesignation == true) {
        //     if (this.designation.designation == 'CEO') {
        //         this.alertObj.managerid = this.employeeId;
        //         this.timeSheetService.getTimeSheetByManager(employeeDate).subscribe(
        //             res => {
        //                 if (res._body != '[]') {
        //
        //                     let employeeL = JSON.parse(res._body);
        //                     this.totalRecordsCount = employeeL.totalrecords;//this.alertList.length;
        //                     this.employeeArr = employeeL.records;
        //                     var x = this.totalRecordsCount % this.perPage;
        //                     var y = this.totalRecordsCount - x;
        //                     if (x == 0) {
        //                         this.totalPages = y / this.perPage;
        //                     } else {
        //                         this.totalPages = y / this.perPage + 1;
        //                     }
        //
        //                 } else {
        //                     this.appService.showFail('NO EMPLOYEE AVAILABLE');
        //
        //                 }
        //             }, (error: any) => {
        //                 this.appService.showFail('NO EMPLOYEE AVAILABLE');
        //
        //             })
        //     }
        // }
        // console.log(alertObj);
        // employeeDate.fromdate = alertObj.fromdate;
        // employeeDate.todate = alertObj.todate;
    }

    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.getEmployeeData(this.page);
    }
}

