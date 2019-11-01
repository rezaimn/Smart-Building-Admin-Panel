//import { MenuList } from './../../planner/planner';
import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,DateAdapter } from '@angular/material';

import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { OrderService } from '../order.service';
import { PersonalInfo, EmployementDetails, EmergencyVehicle, PolicyViewObject, Order } from '../order';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// import { Table } from '../table';
import { MenuList} from '../../planner/planner';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'jalali-moment';
import {CalendarConverterService} from '../../../../calendar-converter-service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit,AfterViewInit  {

  @SessionStorage('user')
  public loggedInUser;

  public staff: any = {};
  public tables : any;
  public menuList :any = [];
  public showmenu : any =[];
  
  
  public now = moment();
  public selectedItems = [];

  public selectedTableId : any = "";
  
  @SessionStorage('subsidiary')
  public subsidiary;
  public formdate : any;
  public todate : any;
  public noofpeople :any = 2;

    public currentDate: any;
    public pickedFromDate: any;
    public fromDate: any;
    public pickedToDate: any;
    public toDate: any;

    public alertObj: any = {};
 

  public cardNumber: string;
  public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));

  constructor(
    public dialogRef: MatDialogRef<AddOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private staffService: OrderService,
    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private orderService : OrderService,
    public dateAdapter: DateAdapter<Date>,
    private datePipe: DatePipe,
    public translate:TranslateService,
    private calendarConverter: CalendarConverterService,
  ) {
    this.staff = data.staff;
    //this.menuList : MenuList = new MenuList();
    this.getTables();
    this.getMenus();
   // this.menuList = [];
      dialogRef.disableClose = true;

      let now = new Date();
      this.dateAdapter.setLocale('en-In');
      this.currentDate = this.datePipe.transform(now, 'dd/MM/yyyy');
      this.pickedFromDate = new Date(now);
      this.fromDate = this.currentDate;
      this.pickedToDate = new Date(now);
      this.toDate = this.currentDate;
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
  }

  change(obj){

    console.log(obj);
    
    let updateItem = this.menuList[0].menuitems.filter(x => x.id == obj);

    console.log(updateItem);
    let index = this.selectedItems.indexOf(updateItem);
    
    
    if(index > -1){
      this.selectedItems.splice(index, 1);
    }
    else{
      this.selectedItems.push(updateItem);
    }
    
    console.log(this.selectedItems);
  }


  getTables() {

    this
      .orderService
      .getTables('/HOMS/GetTables')
      .subscribe(res => {
        if (res.status === 200) {
          this.tables = JSON.parse(res._body);
      
          // this.vouchers = Array.of(this.vouchers); 
        }
      }, (error: any) => {

          this.translate.get('error-messages.table-no-data', this.appService.currentLang).subscribe(
              (subHeaderT) => {
                  this.appService.showFail(subHeaderT);
              }
          );

      });


  }

  getMenus() {
    
    this
      .orderService
      .getMenus('/HOMS/GetMenuByDate?subsidiaryid=1&date=26/02/2018')
      .subscribe(res => {
        if (res.status === 200) {
          
          this.menuList = JSON.parse(res._body);
          console.log(this.menuList);
          this.showmenu = this.menuList[0].menuitems;
         // alert (this.menuList[0].menuitems.length);
          
          // this.vouchers = Array.of(this.vouchers); 
        }
      }, (error: any) => {
          this.translate.get('error-messages.menu-no-data', this.appService.currentLang).subscribe(
              (subHeaderT) => {
                  this.appService.showFail(subHeaderT);
              }
          );
      });


  }

 addOrder(){
  // /HOMS/InsertOrder

  let order:Order = new Order();
  order.employeeid = this.loggedInUser.staff_id;
  order.subsidiaryid = this.subsidiary.id;
   order.fromdate =this.fromDate;
   order.todate = this.toDate;

 
   order.noofpeople = this.noofpeople;
   order.tables = this.tables;
   order.orderitems = this.menuList[0].menuitems;     
 
   console.log(order);
   this
      .orderService
      .addOrder('/HOMS/InsertOrder',order)
      .subscribe(res => {

          if (res._body === 1) {
              this.translate.get('error-messages.order-update-success', this.appService.currentLang).subscribe(
                  (subHeaderT) => {
                      this.appService.showSuccess(subHeaderT);
                  }
              );

            this.closeModal();
          }
          if (res._body === 0) {
              this.translate.get('error-messages.order-update-failed', this.appService.currentLang).subscribe(
                  (subHeaderT) => {
                      this.appService.showFail(subHeaderT);
                  }
              );
          }
          if(res._body>=2){
              this.appService.generalExceptions(res._body);
          }

      }, (error: any) => {
          this.translate.get('error-messages.order-update-failed', this.appService.currentLang).subscribe(
              (subHeaderT) => {
                  this.appService.showFail(subHeaderT);
              }
          );
      });


 }



  sendHeader(): void {
    // Send message to subscribers via observable subject

    this
      .appService
      .sendHeader("header", 'homs management', 'hello', '');

  }

  ngAfterViewInit() {
   
  }


  closeModal() {
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
  }

}
