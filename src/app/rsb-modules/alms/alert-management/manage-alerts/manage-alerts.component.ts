import {EditAlertsComponent} from './../edit-alerts/edit-alerts.component';
import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DateAdapter, MatDialog} from '@angular/material';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {LayoutComponent} from '../../../../common';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import {AppService} from '../../../../app.service';
import {AlertManagementService} from '../alert-management.service';
import {DeleteAlertComponent} from 'app/rsb-modules/alms/alert-management/delete-alert/delete-alert.component';
import {DatePipe} from '@angular/common';
import {PaginationService} from '../../../../pagination-service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'jalali-moment';
import {CalendarConverterService} from '../../../../calendar-converter-service';

/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
    selector: 'app-manage-alerts',
    templateUrl: './manage-alerts.component.html',
    styleUrls: ['./manage-alerts.component.scss'],
    providers: [DatePipe]
})
export class ManageAlertsComponent implements OnInit {

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
    @SessionStorage('editAlertCount')
    public editAlertCount;
    @SessionStorage('user')
    public user;

    public campusList: any = [];
    public buildingList: any = [];
    public floorList: any = [];
    public floorId=0;
    public alertList: any = [];
    public designation: any;
    //public showDesignation: any;
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
                public svgService: SvgService,
                public activatedRoute: Router,
                public sessionStorageService: SessionStorageService,
                private AlertManagementService: AlertManagementService,
                public dateAdapter: DateAdapter<Date>,
                private datePipe: DatePipe,
                public paginationService: PaginationService,
                private toastr: ToastrService,
                public translate:TranslateService,
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
        this.sendHeaderWithLogo();
        this.editAlertCount = 0;
        this.updateBreadCrums();
        this.storage.observe('addClicked')
            .subscribe((clickedRes) => {
            this.sessionStorageService.store('addAlert', 1);
            if (clickedRes && (this.editAlertCount === 0 ||
                this.editAlertCount === null) &&
                this.activatedRoute.url === '/rsb-modules/alms/alert-management/alert-list/manage') {
                if (this.editAlertCount === null) {
                    this.editAlertCount = 0;
                } else {
                    this.editAlertCount++;
                }
                let prepareStaffData = {
                    'editData':{},
                    'type':'add'
                };

                $('.page-wrapper').addClass('blur-bg');
                let dialogRef = this
                    .dialog
                    .open(EditAlertsComponent, {
                        width: '1024px',
                        height: 'auto',
                        data: prepareStaffData
                    });
                dialogRef
                    .afterClosed()
                    .subscribe(result => {
                        this.execute(this.page);
                        $('.page-wrapper').removeClass('blur-bg');
                        this
                            .storage
                            .store('addClicked', false);
                        if (result) {

                            this.editAlertCount = 0;
                        } else {
                            this.editAlertCount = 0;
                        }
                    });
            }
        });

        this.getCampus();

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
        let routeName='';
        if (this.appService.currentLang == 'en') {
            subsidiaryName = this.subsidiary.name.map.en;
        }
        if (this.appService.currentLang == 'fa') {
            subsidiaryName = this.subsidiary.name.map.fa;
        }
        this.translate.get('sub-header.alert-management', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.manage-alert', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;
                                this.translate.get('route-name.add-alert-list', this.appService.currentLang).subscribe(
                                    (routeNameT) => {
                                        routeName=routeNameT;
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

    // get campus list
    getCampus() {
        this.AlertManagementService.getCampuses(this.subsidiary.id,this.appService.currentLang).subscribe(
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
        this.AlertManagementService.getBuildings(campus,this.appService.currentLang).subscribe(
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
        this.AlertManagementService.getFloors(building,this.appService.currentLang).subscribe(
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
        //
        // let alertObj = {
        //     fromdate: this.fromDate,
        //     todate: this.toDate
        // }
        this.alertObj.pagination = {'page': pageNO, 'records': 5};
        this.alertObj.fromdate=this.fromDate;
        this.alertObj.todate=this.toDate;
        this.alertObj.floorid = Number(this.floorId);
        //console.log(employeeDate)
        if(this.floorId!=0){
        this.AlertManagementService.getAlertsListByFloor(this.alertObj).subscribe(
            res => {
                if (res.status === 200) {
                let dataT = JSON.parse(res._body);
                    this.alertList = dataT.records;
                    if (this.appService.currentCalendar == 'jalali') {
                        for (let i = 0; i < this.alertList.length; i++) {
                            let FDate=this.calendarConverter.convertDateFormat(this.alertList[i].fromdate);
                            let GFDate=this.calendarConverter.convertFromGregorianToJalaliString(FDate);
                            this.alertList[i].fromdate=GFDate;

                            let TDate=this.calendarConverter.convertDateFormat(this.alertList[i].todate);
                            let GTDate=this.calendarConverter.convertFromGregorianToJalaliString(TDate);
                            this.alertList[i].todate=GTDate;
                        }
                    }
                    this.totalRecordsCount = dataT.totalrecords;
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
                this.translate.get('error-messages.alert-no-data', this.appService.currentLang).subscribe(
                    (translateRes) => {
                        this.appService.showFail(translateRes);
                    }
                );
            })
        }
    }

    // delete alert list
    alertStatus(id) {
        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(DeleteAlertComponent, {
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

    // edit alert list
    editAlert(editData) {
        this.sessionStorageService.store('addAlert', 0);
// console.log(editData , "111111111111111");
        let editStaffData = {
            'editData':editData,
            'type':'edit'
        };

        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(EditAlertsComponent, {
                width: '1024px',
                height: 'auto',
                data: editStaffData,
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

    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.execute(this.page);
    }


}

