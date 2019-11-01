import {VoucherService} from './../voucher.service';
import {DeleteVoucherComponent} from 'app/rsb-modules/homs/voucher/delete-voucher/delete-voucher.component';
import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DateAdapter, MatDialog} from '@angular/material';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {AuthenticationService, LayoutComponent} from '../../../../common';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import {AppService} from '../../../../app.service';

import {AddVoucherComponent} from 'app/rsb-modules/homs/voucher/add-voucher/add-voucher.component';

import {DatePipe} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {PaginationService} from '../../../../pagination-service';
import {CalendarConverterService} from '../../../../calendar-converter-service';
import * as moment from 'jalali-moment';

/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
    selector: 'app-voucher-list',
    templateUrl: './voucher-list.component.html',
    styleUrls: ['./voucher-list.component.scss'],
    providers: [DatePipe]
})
export class VoucherListComponent implements OnInit {
    public mydate: any;

    public page: number = 1;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;

    public vouchers: any = [];

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


    public myDate: Date;


    @SessionStorage('organization')
    public organization;

    @SessionStorage('subsidiary')
    public subsidiary;


    @SessionStorage('addVoucherCount')
    public addVoucherCount;




    public date: any; //= "02/03/2018";//current date
    public pickedDate: any;
    public currentDate: any;
    constructor(public dialog: MatDialog,
                public appService: AppService,
                public masterDataService: MasterDataService,
                public eavWrapperService: EavWrapperService,
                public layoutComponent: LayoutComponent,
                public translate: TranslateService,
                public activatedRoute: Router,
                private voucherService: VoucherService,
                private storage: LocalStorageService,
                private sanitizer: DomSanitizer,
                public svgService: SvgService,
                public sessionStorageService: SessionStorageService,
                private authenticationService: AuthenticationService,
                public dateAdapter: DateAdapter<Date>,
                private datePipe: DatePipe, public paginationService: PaginationService,
                private calendarConverter: CalendarConverterService,

    ) {
        this.dateAdapter.setLocale('en-In');
        var now = Date.now();
        this.currentDate = this.datePipe.transform(now, 'dd/MM/yyyy');
        this.pickedDate = new Date(now);
        this.date = this.currentDate;
    }



    ngOnInit() {
        this.sendHeaderWithLogo();
        if(this.appService.currentLang=='fa'){
            let jalali=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.date));
            this.pickedDate=moment(jalali,'jYYYY,jMM,jDD');
        }
        if(this.appService.currentLang=='en'){
            this.pickedDate=new Date(this.calendarConverter.convertDateFormat(this.date));
        }
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                if(res=='fa'){
                    let jalali=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.date));
                    this.pickedDate=moment(jalali,'jYYYY,jMM,jDD');
                }
                if(res=='en'){
                    this.pickedDate=new Date(this.calendarConverter.convertDateFormat(this.date));
                }
                this.sendHeaderWithLogo();
            }
        )
        this.addVoucherCount = 0;
        this.updateBreadCrums();
        this.storage.observe('addClicked')
            .subscribe((clickedRes) => {
                if (clickedRes && (this.addVoucherCount === 0 || this.addVoucherCount === null) && this.activatedRoute.url === '/rsb-modules/homs/voucher/voucher-list/view-all') {
                    if (this.addVoucherCount === null) {
                        this.addVoucherCount = 0;
                    } else {
                        this.addVoucherCount++;
                    }
                    let prepareDeviceData = {
                        'message': 'new',
                        'index': 1
                    };

                    $('.page-wrapper').addClass('blur-bg');
                    let dialogRef = this
                        .dialog
                        .open(AddVoucherComponent, {
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
                            this.getVouchers(1);
                            if (result) {

                                this.addVoucherCount = 0;
                            } else {
                                this.addVoucherCount = 0;
                            }
                        });
                }
            });
    }
    //this method will convert start date to UTC date if it's not
    convertJalaliDateToUTC(tempDate: any) {
        this.date = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
    }
    convertGregorianDateToUTC(tempDate: any) {
        this.date= this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
    }
    ngAfterViewInit() {

    }

    // sendHeader(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.subsidiary !== null) {
    //     this
    //       .appService
    //       .sendHeader(this.subsidiary.name, 'voucher management', 'manage voucher', 'add voucher');
    //   }
    // }

    // sendHeaderWithLogo(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.subsidiary !== null) {
    //     this
    //       .appService
    //       .sendHeaderWithLogo(this.subsidiary.name, 'voucher management', 'manage daily voucher', 'add voucher','../../../../../assets/images/dashboard/HOSPITALITY-MANAGEMENT-SYSTEM.png');
    //   }
    // }


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
        let routeName = '';
        this.translate.get('sub-header.manage-daily-voucher', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.voucher-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;

                                this.translate.get('route-name.add-voucher', this.appService.currentLang).subscribe(
                                    (routeNameT) => {
                                        routeName = routeNameT;
                                        this
                                            .appService
                                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/HOSPITALITY-MANAGEMENT-SYSTEM.png');
                                    }
                                )


                    }
                );
            }
        );
    }


    getVouchers(pageNO:any) {

        this.vouchers = [];
        let Voucher = {
            'date': this.date,
            'pagination': {'page': pageNO, 'records': 5}
        }
        this
            .voucherService
            .getVoucherList('/HOMS/GetVoucherByDate', Voucher)
            .subscribe(res => {
                if (res.status === 200) {
                    const data = JSON.parse(res._body);
                    this.vouchers = data.records;
                    this.totalRecordsCount = data.totalrecords;
                    var x = this.totalRecordsCount % this.perPage;
                    var y = this.totalRecordsCount - x;
                    if(x == 0){
                        this.totalPages = y / this.perPage ;
                    } else {
                        this.totalPages = y / this.perPage + 1;
                    }
                }
            }, (error: any) => {
                this.translate.get('error-messages.voucher-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            });


    }


    //excute function
    //no params
    excute() {
        console.log('excute is fired');
    }

    updateBreadCrums() {
        this.appService.updateBreadCrums('HOMS-VIEW');
    }


    editVoucher(voucher) {
        this.sessionStorageService.store('voucher', voucher);
        let viewStaffData = {
            'voucher': voucher
        };

        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(AddVoucherComponent, {
                width: '768px',
                height: 'auto',
                data: viewStaffData,
                hasBackdrop: true
            });

        dialogRef
            .afterClosed()
            .subscribe(result => {
                this.getVouchers(1);


                this
                    .layoutComponent
                    .removeClass();


            });

    }


    deleteVoucher(voucher) {
        this.sessionStorageService.store('voucher', voucher);
        let viewStaffData = {
            'voucher': voucher
        };

        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(DeleteVoucherComponent, {
                width: '768px',
                height: 'auto',
                data: viewStaffData,
                hasBackdrop: true
            });

        dialogRef
            .afterClosed()
            .subscribe(result => {

                this.getVouchers(1);
                this
                    .layoutComponent
                    .removeClass();
                if (result) this.getVouchers(1);
            });


    }


    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.getVouchers(this.page)
    }


}
