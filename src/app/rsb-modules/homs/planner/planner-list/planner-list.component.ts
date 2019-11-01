import {PlannerService} from './../planner.service';
import {DatePipe} from '@angular/common';
import {MenuComponent} from './../menu/menu.component';
import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DateAdapter, MatDialog} from '@angular/material';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {LayoutComponent} from '../../../../common';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import {AppService} from '../../../../app.service';
import {AddMenuComponent} from 'app/rsb-modules/homs/planner/add-menu/add-menu.component';
import {ViewOrderComponent} from '../../order/view/view.component';
import {TranslateService} from '@ngx-translate/core';
import {CalendarConverterService} from '../../../../calendar-converter-service';
import * as moment from 'jalali-moment';

/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
    selector: 'app-planner-list',
    templateUrl: './planner-list.component.html',
    styleUrls: ['./planner-list.component.scss']
})
export class PlannerListComponent implements OnInit {

    public page: number = 1;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;
    public orders: any = [];

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
    @SessionStorage('addPlannerCount')
    public addPlannerCount;

    public menu: any;

    public planner: any = [];

    public date: any; //= "02/03/2018";//current date
    public pickedDate: any;
    public currentDate: any;


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
                private datePipe: DatePipe,
                public dateAdapter: DateAdapter<Date>,
                public translate: TranslateService,
                public plannerService: PlannerService,
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
        this.addPlannerCount = 0;
        this.updateBreadCrums();
        this.storage.observe('addClicked').subscribe((clickedRes) => {
            if (clickedRes && (this.addPlannerCount === 0 || this.addPlannerCount === null) && this.activatedRoute.url === '/rsb-modules/homs/planner/planner-list/view-all') {
                if (this.addPlannerCount === null) {
                    this.addPlannerCount = 0;
                } else {
                    this.addPlannerCount++;
                }
                let prepareDeviceData = {
                    'message': 'new',
                    'index': 1
                };

                $('.page-wrapper').addClass('blur-bg');
                let dialogRef = this
                    .dialog
                    .open(AddMenuComponent, {
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

                            this.addPlannerCount = 0;
                        } else {
                            this.addPlannerCount = 0;
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

    execute(pageNO:any) {
        this.planner=[];
        //http://localhost:55408/RSBService.svc/HOMS/GetMenuByDate?subsidiaryid=1&date=26/02/2018
        let vouchers = [];
        let Voucher = {
            'date':this.date,
            'pagination': {'page': pageNO, 'records': 5}
        }
        this
            .plannerService
            .getPlannerList('/HOMS/GetMenuByDate?subsidiaryid=' + this.subsidiary.id + '&date=' + this.date)
            .subscribe(res => {
                if (res.status === 200) {
                    const data = JSON.parse(res._body);
                    this.planner = data.records;
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
                this.translate.get('error-messages.planner-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            });

        let obj = {
            'date':this.date,
            'subsidiaryid': this.subsidiary.id
        };

        this
            .plannerService
            .getOrders('/HOMS/GetOrders', obj)
            .subscribe(res => {
                if (res.status === 200) {
                    let items = JSON.parse(res._body);
                    this.orders = items.records;
                    console.log(this.orders);
                    // this.vouchers = Array.of(this.vouchers);
                }
            }, (error: any) => {
                this.translate.get('error-messages.order-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            });

    }


    viewOrder(order) {
        this.sessionStorageService.store('order', order);
        let orderData = {
            'order': order
        };

        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(ViewOrderComponent, {
                width: '768px',
                height: 'auto',
                data: orderData,
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
        this.translate.get('sub-header.manage-planner', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.planner-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;
                                this.translate.get('route-name.add-planner', this.appService.currentLang).subscribe(
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


    updateBreadCrums() {
        this.appService.updateBreadCrums('HOMS-VIEW');
    }

    consolidatedMenu() {
        let obj = {
            'date': this.date,
            'subsidiaryid': this.subsidiary.id
        };

        this
            .plannerService
            .getOrders('/HOMS/GetConsolidatedOrder', obj)
            .subscribe(res => {
                if (res.status === 200) {
                    //this.orders = JSON.parse(res._body);

                    // this.vouchers = Array.of(this.vouchers);
                    let menuData = {
                        'menu': JSON.parse(res._body)
                    };

                    this
                        .layoutComponent
                        .addClass();

                    const dialogRef = this
                        .dialog
                        .open(MenuComponent, {
                            width: '768px',
                            height: 'auto',
                            data: menuData,
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
            }, (error: any) => {
                this.translate.get('error-messages.consolidate-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            });


        // this.sessionStorageService.store('menu', menu);

    }


}

