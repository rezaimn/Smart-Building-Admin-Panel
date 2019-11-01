import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DateAdapter, MatDialog} from '@angular/material';
import {SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {LayoutComponent} from '../../../../common';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import {AppService} from '../../../../app.service';
import {NotificationManagementService} from '../notification-management.service';
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
    selector: 'app-manage-notification',
    templateUrl: './manage-notification.component.html',
    styleUrls: ['./manage-notification.component.scss'],
    providers: [DatePipe]
})
export class ManageNotificationComponent implements OnInit {

    public page: number = 1;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;

    public alertObj: any = {};
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
    subsidiary: any;

    @SessionStorage('user')
    public user;

    public campusList: any;
    public buildingList: any;
    public floorList: any;
    public floorId=0;
    public notificationList: any = [];
    public designation: any;
   // public showDesignation: any;

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
                public svgService: SvgService,
                public sessionStorageService: SessionStorageService,
                private NotificationManagementService: NotificationManagementService,
                public dateAdapter: DateAdapter<Date>,
                private datePipe: DatePipe,
                public paginationService: PaginationService,
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
        if (!this.subsidiary) {
            this.subsidiary = {
                'id': 1
            };
        }
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.getCampus();
        //this.showDesignation = true;
        // if (this.user.staff_id != 0) {
        //     this.getDesignation();
        // }
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
                this.execute(this.page);
            }
        )

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
        this.translate.get('sub-header.notifications', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.notifications', this.appService.currentLang).subscribe(
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

    updateBreadCrums() {
        this.appService.updateBreadCrums('ALMS-VIEW');
    }

    // // get designation
    // getDesignation() {
    //     this.NotificationManagementService.getDesignation(this.user.staff_id).subscribe(
    //         res => {
    //             this.designation = JSON.parse(res._body);
    //             console.log(this.designation);
    //             if (this.designation.designation == 'CEO' || this.designation.designation == 'Staff') {
    //                 this.showDesignation = false;
    //             } else {
    //                 this.showDesignation = true;
    //             }
    //         }, (error: any) => {
    //             console.log(error);
    //         })
    // }

    // get campus list
    getCampus() {
        this.NotificationManagementService.getCampuses(this.subsidiary.id , this.appService.currentLang).subscribe(
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
        this.NotificationManagementService.getBuildings(campus, this.appService.currentLang).subscribe(
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
        this.NotificationManagementService.getFloors(building, this.appService.currentLang).subscribe(
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
    resetPage(){
        this.page=1;
    }
    // execute
    execute(pageNO:any) {
        this.alertObj.pagination = {'page': pageNO, 'records': 5};
        this.alertObj.fromdate=this.fromDate;
        this.alertObj.todate=this.toDate;

            this.alertObj.floorid = Number(this.floorId);
          if(this.floorId!=0){
              console.log(this.floorId,"ttttttttttttttttttttttt");
            this.NotificationManagementService.getNotificationsByFloor(this.alertObj).subscribe(
                res => {

                    if (res.status === 200) {
                        this.notificationList = JSON.parse(res._body);

                        this.totalRecordsCount = this.notificationList.totalrecords;//this.alertList.length;
                        this.notificationList = this.notificationList.records;
                        if (this.appService.currentCalendar == 'jalali') {
                            for (let i = 0; i < this.notificationList.length; i++) {
                                let FDate=this.calendarConverter.convertDateFormat(this.notificationList[i].fromdate);
                                let GFDate=this.calendarConverter.convertFromGregorianToJalaliString(FDate);
                                this.notificationList[i].fromdate=GFDate;

                                let TDate=this.calendarConverter.convertDateFormat(this.notificationList[i].todate);
                                let GTDate=this.calendarConverter.convertFromGregorianToJalaliString(TDate);
                                this.notificationList[i].todate=GTDate;
                            }
                        }
                        var x = this.totalRecordsCount % this.perPage;
                        var y = this.totalRecordsCount - x;
                        if(x == 0){
                            this.totalPages = y / this.perPage ;
                        } else {
                            this.totalPages = y / this.perPage + 1;
                        }
                        if (this.notificationList.length == 0) {
                            this.translate.get('error-messages.empty-result', this.appService.currentLang).subscribe(
                                (subHeaderT) => {
                                    this.appService.showFail(subHeaderT);
                                }
                            );
                        }
                    }
                }, (error: any) => {
                    this.translate.get('error-messages.notifications-no-data', this.appService.currentLang).subscribe(
                        (translateRes) => {
                            this.appService.showFail(translateRes);
                        }
                    );
                })
        // } else {
        //     this.alertObj.employeeid = this.user.staff_id;
        //     this.NotificationManagementService.getNotificationsByEmployee( this.alertObj).subscribe(
        //         res => {
        //
        //             if (res.status === 200) {
        //                 this.notificationList = JSON.parse(res._body);
        //                 this.totalRecordsCount = this.notificationList.length;
        //                 var x = this.totalRecordsCount % this.perPage;
        //                 var y = this.totalRecordsCount - x;
        //                 if(x == 0){
        //                     this.totalPages = y / this.perPage ;
        //                 } else {
        //                     this.totalPages = y / this.perPage + 1;
        //                 }
        //                 if (this.notificationList.length == 0) {
        //                     this.translate.get('error-messages.empty-result', this.appService.currentLang).subscribe(
        //                         (subHeaderT) => {
        //                             this.appService.showFail(subHeaderT);
        //                         }
        //                     );
        //                 }
        //             }
        //         }, (error: any) => {
        //             this.translate.get('error-messages.notifications-no-data', this.appService.currentLang).subscribe(
        //                 (translateRes) => {
        //                     this.appService.showFail(translateRes);
        //                 }
        //             );
        //         })
        // }
          }
    }

    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.execute(this.page);
    }

}