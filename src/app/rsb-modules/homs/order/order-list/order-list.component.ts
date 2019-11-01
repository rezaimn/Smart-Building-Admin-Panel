import { DeleteOrderComponent } from './../delete-order/delete-order.component';
import { ViewOrderComponent } from './../view/view.component';
import { AddOrderComponent } from './../add-order/add-order.component';

import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,DateAdapter } from '@angular/material';
import { SessionStorage, SessionStorageService, LocalStorageService } from 'ngx-webstorage';
import { LayoutComponent, ConfirmModalComponent } from '../../../../common';
import { DevicePointComponent } from '../../../../utils';
import { MasterDataService, EavWrapperService, SvgService } from '../../../../utils';
import { AppService } from '../../../../app.service';
import { DatePipe } from '@angular/common';
import { OrderService } from '../order.service';
import { Order } from '../order';
import {TranslateService} from '@ngx-translate/core';
import {PaginationService} from '../../../../pagination-service';

import {CalendarConverterService} from '../../../../calendar-converter-service';
import * as moment from 'jalali-moment';
/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {


    public page: number = 1;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;


    public date: any; //= "02/03/2018";//current date
    public pickedDate: any;
    public currentDate: any;

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

  @SessionStorage('addOrderCount')
  public addOrderCount;

  @SessionStorage('user')
  public loggedInUser;

  public designationName:any;

  public orders : any = [];


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
    public translate:TranslateService,
    public dateAdapter: DateAdapter<Date>,
    private datePipe: DatePipe,
    private orderService: OrderService,
              public paginationService:PaginationService,
              private calendarConverter: CalendarConverterService,
  ) {
      this.dateAdapter.setLocale('en-In');
      var now = Date.now();
      this.currentDate = this.datePipe.transform(now, 'dd/MM/yyyy');
      this.pickedDate = new Date(now);
      this.date = this.currentDate;
    this.designationName = this.loggedInUser.designationName;
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
    this.addOrderCount = 0;
    this.updateBreadCrums();
    this.storage.observe('addClicked').subscribe((clickedRes) => {
      if (clickedRes && (this.addOrderCount === 0 || this.addOrderCount === null) && this.activatedRoute.url === '/rsb-modules/homs/order/order-list/view-all') {
        if (this.addOrderCount === null) {
          this.addOrderCount = 0;
        } else {
          this.addOrderCount++;
        }
        let prepareDeviceData = {
          'message': 'new',
          'index': 1
        };

        $('.page-wrapper').addClass('blur-bg');
        let dialogRef = this
          .dialog
          .open(AddOrderComponent, {
            width: '900px',
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
              
              this.addOrderCount = 0;
            } else {
              this.addOrderCount = 0;
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
        this.translate.get('sub-header.manage-order-sheet', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.order-management', this.appService.currentLang).subscribe(
                            (pageDetailsT) => {
                                pageDetails = pageDetailsT;
                                this.translate.get('sub-header.manage-order-sheet', this.appService.currentLang).subscribe(
                                    (pageDetailsT) => {
                                        routeName = pageDetailsT;


                                        this
                                            .appService
                                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/HOSPITALITY-MANAGEMENT-SYSTEM.png');
                                    }
                                )

                            }
                )
            }
        );

    }


    getOrders(pageNO:any) {

        this.orders = [];
    let obj = {
      "date":this.date,
       "subsidiaryid" : this.subsidiary.id ,
        'pagination': {'page': pageNO, 'records': 5}
    };

    this
      .orderService
      .getOrders('/HOMS/GetOrders',obj)
      .subscribe(res => {
        if (res.status === 200) {
            const data = JSON.parse(res._body);
            this.orders=data.records;
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
          this.translate.get('error-messages.order-no-data', this.appService.currentLang).subscribe(
              (subHeaderT) => {
                  this.appService.showFail(subHeaderT);
              }
          );
      });


  }

  updateBreadCrums() {
    this.appService.updateBreadCrums('HOMS-VIEW');
  }

  deleteOrder(order:any){
    this.sessionStorageService.store('order', order);
    let orderData = {
      'order': order
    };

    this
      .layoutComponent
      .addClass();

    const dialogRef = this
      .dialog
      .open(DeleteOrderComponent, {
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
          this.getOrders(1);
      });
  }

  viewOrder(order){
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
          this.getOrders(1);
      });
  }
  editOrder(order){
    this.sessionStorageService.store('order', order);
    let orderData = {
      'order': order
    };

    this
      .layoutComponent
      .addClass();

    const dialogRef = this
      .dialog
      .open(AddOrderComponent, {
        width: '900px',
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
          this.getOrders(1);
      });
  }


    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.getOrders(this.page);
    }

}

