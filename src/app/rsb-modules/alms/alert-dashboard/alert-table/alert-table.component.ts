import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DateAdapter, MatDialog} from '@angular/material';
import {SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {AuthenticationService, LayoutComponent} from '../../../../common';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import {AppService} from '../../../../app.service';
import {AlertStatusComponent} from 'app/rsb-modules/alms/alert-dashboard/alert-status/alert-status.component';
import {AlertDashboardService} from '../alert-dashboard.service';
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
    selector: 'app-alert-table',
    templateUrl: './alert-table.component.html',
    styleUrls: ['./alert-table.component.scss'],
    providers: [DatePipe]
})
export class AlertTableComponent implements OnInit {

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

    @SessionStorage('popup')
    public popup;

    public campusList: any;
    public buildingList: any;
    public floorList: any;
    public floorId = 0;

    public alertList: any = [];
    public designation: any;
    // public showDesignation: boolean;


    public popupFlag: any;
    public storedObj: any;

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
                public  paginationService: PaginationService,
                private sanitizer: DomSanitizer,
                public svgService: SvgService,
                public sessionStorageService: SessionStorageService,
                private authenticationService: AuthenticationService,
                private AlertDashboardService: AlertDashboardService,
                public dateAdapter: DateAdapter<Date>,
                private datePipe: DatePipe,
                public translate: TranslateService,
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
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.getCampus();
        // this.showDesignation = true;
        //  if (this.user.staff_id != 0) {
        //      this.getDesignation();
        //  }
        if (this.appService.currentLang == 'fa') {
            let jalaliFrom = this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.fromDate));
            this.pickedFromDate = moment(jalaliFrom, 'jYYYY,jMM,jDD');
            let jalaliTo = this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.toDate));
            this.pickedToDate = moment(jalaliTo, 'jYYYY,jMM,jDD');
        }
        if (this.appService.currentLang == 'en') {
            this.pickedFromDate = new Date(this.calendarConverter.convertDateFormat(this.fromDate));
            this.pickedToDate = new Date(this.calendarConverter.convertDateFormat(this.toDate));
        }
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                if (res == 'fa') {
                    let jalaliFrom = this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.fromDate));
                    this.pickedFromDate = moment(jalaliFrom, 'jYYYY,jMM,jDD');
                    let jalaliTo = this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.toDate));
                    this.pickedToDate = moment(jalaliTo, 'jYYYY,jMM,jDD');
                }
                if (res == 'en') {
                    this.pickedFromDate = new Date(this.calendarConverter.convertDateFormat(this.fromDate));
                    this.pickedToDate = new Date(this.calendarConverter.convertDateFormat(this.toDate));

                }
                this.sendHeaderWithLogo();
                this.execute(this.page);
            }
        )

    }

    convertJalaliDateToUTC(tempDate: any, state: any) {
        if (state == 'from') {
            this.fromDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
        }
        if (state == 'to') {
            this.toDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
        }
    }

    convertGregorianDateToUTC(tempDate: any, state: any) {
        if (state == 'from') {
            this.fromDate = this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
        }
        if (state == 'to') {
            this.toDate = this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
        }
    }
    resetPage(){
        this.page=1;
    }
    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.execute(this.page);
    }

    ngAfterViewInit() {
        if (this.popup) {
            this.popupFlag = this.popup;
            if (this.popupFlag == 1) {
                this.storedObj = JSON.parse('employeDate');
                this.execute(1);
            }
        }
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
        this.translate.get('sub-header.alert-dashboard', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.alert-dashboard', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;
                        this
                            .appService
                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, '', '../../../../../assets/images/dashboard/ALERT-MANAGEMENT-SYSTEM.png');
                    }
                );
            }
        );
    }


    //excute function

    updateBreadCrums() {
        this.appService.updateBreadCrums('ALMS-VIEW');
    }

    alertStatus(id) {
        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(AlertStatusComponent, {
                width: '600px',
                height: 'auto',
                data: id,
                hasBackdrop: true
            });

        dialogRef
            .afterClosed()
            .subscribe(result => {
                this
                    .layoutComponent
                    .removeClass();

                this.execute(this.page);

            });
    }

    // get designation
    // getDesignation() {
    //     this.AlertDashboardService.getDesignation(this.user.staff_id).subscribe(
    //         res => {
    //             this.designation = JSON.parse(res._body);
    //             console.log(this.designation);
    //             if (this.designation.designation == 'CEO' || this.designation.designation == 'Staff') {
    //                 this.showDesignation = false;
    //             }
    //         }, (error: any) => {
    //             console.log(error);
    //         })
    // }

    // get campus list
    getCampus() {
        this.AlertDashboardService.getCampuses(this.subsidiary.id, this.appService.currentLang).subscribe(
            res => {
                this.campusList = JSON.parse(res._body);
                console.log(this.campusList);
            }, (error: any) => {
                this.translate.get('error-messages.campus-no-data', this.appService.currentLang).subscribe(
                    (translateRes) => {
                        this.appService.showFail(translateRes);
                    }
                );
            })
    }

    // get building list
    getBuilding(campus) {
        console.log(campus);
        this.AlertDashboardService.getBuildings(campus, this.appService.currentLang).subscribe(
            res => {
                this.buildingList = JSON.parse(res._body);
                console.log(this.buildingList);
            }, (error: any) => {
                this.translate.get('error-messages.building-no-data', this.appService.currentLang).subscribe(
                    (translateRes) => {
                        this.appService.showFail(translateRes);
                    }
                );

            })
    }

    // get building list
    getFloor(building) {
        console.log(building);
        this.AlertDashboardService.getFloors(building, this.appService.currentLang).subscribe(
            res => {
                this.floorList = JSON.parse(res._body);
                console.log(this.floorList);
            }, (error: any) => {
                this.translate.get('error-messages.floor-no-data', this.appService.currentLang).subscribe(
                    (translateRes) => {
                        this.appService.showFail(translateRes);
                    }
                );

            })
    }

    // get floor Id
    getFloorId(floorId) {
        console.log(floorId);
        this.floorId = floorId;
    }


    // execute
    execute(pageNO: any) {
        this.alertList = [];
        let alertObj = {
            fromdate: this.fromDate,
            todate: this.toDate
        }
        this.alertObj.pagination = {'page': pageNO, 'records': 5};
        this.alertObj.fromdate = this.fromDate;
        this.alertObj.todate = this.toDate;
        sessionStorage.setItem('alertObj', JSON.stringify(alertObj));
        // if (this.showDesignation == true) {
        this.alertObj.floorid = Number(this.floorId);
        if (this.floorId != 0) {

            if (this.storedObj == undefined) {
                sessionStorage.setItem('employeDate', JSON.stringify(this.alertObj));
            }
            this.AlertDashboardService.getAlertsByFloor(this.alertObj).subscribe(
                res => {

                    if (res.status === 200) {
                        this.alertList = JSON.parse(res._body);
                        this.totalRecordsCount = this.alertList.totalrecords;//this.alertList.length;
                        this.alertList = this.alertList.records;
                        if (this.appService.currentCalendar == 'jalali') {
                            for (let i = 0; i < this.alertList.length; i++) {
                                let FDate = this.calendarConverter.convertDateFormat(this.alertList[i].alerttime.substr(0,10));
                                let GFDate = this.calendarConverter.convertFromGregorianToJalaliString(FDate);
                                this.alertList[i].alerttime = GFDate+' -'+this.alertList[i].alerttime.substr(10,this.alertList[i].alerttime.length);

                            }
                        }
                        var x = this.totalRecordsCount % this.perPage;
                        var y = this.totalRecordsCount - x;
                        if (x == 0) {
                            this.totalPages = y / this.perPage;
                        } else {
                            this.totalPages = y / this.perPage + 1;
                        }
                        if (this.alertList.length == 0) {
                            this.translate.get('error-messages.empty-result', this.appService.currentLang).subscribe(
                                (translateRes) => {
                                    this.appService.showFail(translateRes);
                                }
                            );
                        }
                    }

                }, (error: any) => {
                    this.translate.get('error-messages.alert-no-data', this.appService.currentLang).subscribe(
                        (translateRes) => {
                            this.appService.showFail(translateRes);
                        }
                    );
                })
        }
    }

}
