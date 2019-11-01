import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DateAdapter, MatDialog} from '@angular/material';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {LayoutComponent} from '../../../../common';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import {AppService} from '../../../../app.service';
import {EditTicketComponent} from 'app/rsb-modules/alms/ticket-management/edit-ticket/edit-ticket.component';
import {TicketManagementService} from 'app/rsb-modules/alms/ticket-management/ticket-management.service';
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
    selector: 'app-manage-ticket',
    templateUrl: './manage-ticket.component.html',
    styleUrls: ['./manage-ticket.component.scss'],
    providers: [DatePipe]
})
export class ManageTicketComponent implements OnInit {

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
    subsidiary: any;
    @SessionStorage('editAlertCount')
    public editAlertCount;
    @SessionStorage('user')
    public user;

    // variables
    departmentList: any;
    subDepartmentList: any;
    public alertData: any = {};
    alertList: any = [];
    // public showDesignation: any;
    designation: any;
    public alertObj: any = {};
    subDepartmentId=0;
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
                public svgService: SvgService,
                public activatedRoute: Router,
                private TicketManagementService: TicketManagementService,
                public sessionStorageService: SessionStorageService,
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
        this.editAlertCount = 0;
        // this.showDesignation = true;
        this.updateBreadCrums();
        this.storage.observe('addClicked').subscribe((clickedRes) => {
            if (clickedRes && (this.editAlertCount === 0 || this.editAlertCount === null) && this.activatedRoute.url === '/rsb-modules/alms/ticket-management/ticket-list/manage') {
                if (this.editAlertCount === null) {
                    this.editAlertCount = 0;
                } else {
                    this.editAlertCount++;
                }
                this.sessionStorageService.store('addAlert', 1);
                let prepareDeviceData = {};

                $('.page-wrapper').addClass('blur-bg');
                let dialogRef = this
                    .dialog
                    .open(EditTicketComponent, {
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

                            this.editAlertCount = 0;
                        } else {
                            this.editAlertCount = 0;
                        }
                            this.execute(this.page);

                    });
            }
        });

        this.getDepartment();
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
        let routeName = '';
        if (this.appService.currentLang == 'en') {
            subsidiaryName = this.subsidiary.name.map.en;
        }
        if (this.appService.currentLang == 'fa') {
            subsidiaryName = this.subsidiary.name.map.fa;
        }
        this.translate.get('sub-header.ticket-management', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.manage-ticket', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;
                                this.translate.get('route-name.add-ticket', this.appService.currentLang).subscribe(
                                    (routeNameT) => {
                                        routeName = routeNameT;
                                        this
                                            .appService
                                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/ALERT-MANAGEMENT-SYSTEM.png');
                                    }
                                )
                    }
                );
            }
        );
    }

    updateBreadCrums() {
        this.appService.updateBreadCrums('ALMS-VIEW');
    }

    // edit ticket
    editTicket(editData) {
        this.sessionStorageService.store('addAlert', 0);
        $('.page-wrapper').addClass('blur-bg');
        let dialogRef = this
            .dialog
            .open(EditTicketComponent, {
                width: '768px',
                height: 'auto',
                data: editData
            });
        dialogRef
            .afterClosed()
            .subscribe(result => {
                $('.page-wrapper').removeClass('blur-bg');
                this
                    .storage
                    .store('addClicked', false);
                if (result) {

                    this.editAlertCount = 0;
                } else {
                    this.editAlertCount = 0;
                }

                    this.execute(this.page);

            });
    }

    // get designation
    // getDesignation() {
    //     this.TicketManagementService.getDesignation(this.user.staff_id).subscribe(
    //         res => {
    //             this.designation = JSON.parse(res._body);
    //             console.log(this.designation);
    //             if (this.designation.designation == 'CEO' || this.designation.designation == 'Staff') {
    //                 this.showDesignation = true;
    //             }
    //         }, (error: any) => {
    //             console.log(error);
    //         })
    // }

    // get department list
    getDepartment() {
        this.TicketManagementService.getDepartments(this.subsidiary.id,this.appService.currentLang).subscribe(
            res => {
                this.departmentList = JSON.parse(res._body);
            }, (error: any) => {
                this.translate.get('error-messages.department-no-data', this.appService.currentLang).subscribe(
                    (translateRes) => {
                        this.appService.showFail(translateRes);
                    }
                );
            })
    }

    // get sub department list
    getSubDepartment(departmentId) {
        this.TicketManagementService.getSubDepartments(departmentId, this.appService.currentLang).subscribe(
            res => {
                this.subDepartmentList = JSON.parse(res._body);
            }, (error: any) => {
                this.translate.get('error-messages.sub-department-no-data', this.appService.currentLang).subscribe(
                    (translateRes) => {
                        this.appService.showFail(translateRes);
                    }
                );
            })
    }
    resetPage(){
        this.page=1;
    }
    // execute
    execute(pageNO:any) {
        this.alertList = [];

        //this.showDesignation = false;
        this.alertObj.pagination = {'page': pageNO, 'records': 5};
        this.alertObj.fromdate=this.fromDate;
        this.alertObj.todate=this.toDate;
        this.alertObj.subdepartmentid=this.subDepartmentId;
         if (this.subDepartmentId !=0) {
            this.TicketManagementService.getTicketsByDepartment(this.alertObj).subscribe(
                res => {

                    if (res.status === 200) {
                        let dataT = JSON.parse(res._body);
                        this.totalRecordsCount = dataT.totalrecords;//this.alertList.length;
                        this.alertList = dataT.records;
                        if (this.appService.currentCalendar == 'jalali') {
                            for (let i = 0; i < this.alertList.length; i++) {
                                let FDate=this.calendarConverter.convertDateFormat(this.alertList[i].etcdatetime.substr(0,10));
                                let GFDate=this.calendarConverter.convertFromGregorianToJalaliString(FDate);
                                this.alertList[i].etcdatetimej=GFDate+' -'+this.alertList[i].etcdatetime.substr(10,this.alertList[i].etcdatetime.length);

                            }
                        }
                        var x = this.totalRecordsCount % this.perPage;
                        var y = this.totalRecordsCount - x;
                        if(x == 0){
                            this.totalPages = y / this.perPage ;
                        } else {
                            this.totalPages = y / this.perPage + 1;
                        }
                        if (this.alertList.length == 0) {
                            this.translate.get('error-messages.empty-result', this.appService.currentLang).subscribe(
                                (subHeaderT) => {
                                    this.appService.showFail(subHeaderT);
                                }
                            );
                        }
                    }

                }, (error: any) => {
                    this.translate.get('error-messages.ticket-no-data', this.appService.currentLang).subscribe(
                        (translateRes) => {
                            this.appService.showFail(translateRes);
                        }
                    );
                })
         }
             // else {
        //     this.alertObj.employeeid = this.user.staff_id;
        //     this.TicketManagementService.getTicketsByEmployee(this.alertObj).subscribe(
        //         res => {
        //             if (res.status === 200) {
        //                 let dataT = JSON.parse(res._body);
        //                 this.totalRecordsCount = dataT.totalrecords;
        //                 this.alertList = dataT.records;
        //                 var x = this.totalRecordsCount % this.perPage;
        //                 var y = this.totalRecordsCount - x;
        //                 if(x == 0){
        //                     this.totalPages = y / this.perPage ;
        //                 } else {
        //                     this.totalPages = y / this.perPage + 1;
        //                 }
        //             }  if (this.alertList.length == 0) {
        //                 this.translate.get('error-messages.empty-result', this.appService.currentLang).subscribe(
        //                     (subHeaderT) => {
        //                         this.appService.showFail(subHeaderT);
        //                     }
        //                 );
        //             }
        //         }, (error: any) => {
        //             this.translate.get('error-messages.ticket-no-data', this.appService.currentLang).subscribe(
        //                 (translateRes) => {
        //                     this.appService.showFail(translateRes);
        //                 }
        //             );
        //         })
        // }
    }

    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.execute(this.page);
    }

}

