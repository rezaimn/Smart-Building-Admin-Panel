import { DatePipe } from '@angular/common';
import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';

import { Router } from '@angular/router';

import * as moment from 'jalali-moment';
import {CalendarConverterService} from '../../../../calendar-converter-service';


import { AddMenu } from '../planner';
import { PlannerService } from 'app/rsb-modules/homs/planner/planner.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent implements OnInit {

  public addmenu: AddMenu = new AddMenu();

  public date: Date;
  public shiftTypes: any;
  public selectedType: any="any";

  public staff: any;

  public menuItem: any = "";
  public menuPrice: any = "";

    public alertObj: any = {};
    public currentDate: any;
    public pickedFromDate: any;
    public fromDate: any;
    public pickedToDate: any;
    public toDate: any;

  public menuitems : any = [];

  @SessionStorage('subsidiary')
  public subsidiary;
  @SessionStorage('addPlannerCount')
  public addPlannerCount;

  

  constructor(
    public dialogRef: MatDialogRef<AddMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    public translate:TranslateService,
    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    private plannerService: PlannerService,
    public dateAdapter: DateAdapter<Date>,
    private datePipe: DatePipe,
    private calendarConverter: CalendarConverterService,
    private router: Router) {
      let now = new Date();
      this.dateAdapter.setLocale('en-In');
      this.currentDate = this.datePipe.transform(now, 'dd/MM/yyyy');
      this.pickedFromDate = new Date(now);
      this.fromDate = this.currentDate;
      this.pickedToDate = new Date(now);
      this.toDate = this.currentDate;
    if(data.planner){
      this.addmenu = data.planner;
      this.selectedType = this.data.type;
    }
      dialogRef.disableClose = true;
  }

  @SessionStorage('AddMenuCount')
  public addMenuCount;


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
   // this.sendHeader();
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
  addMenu(){
    if (this.menuItem !== ""){
      let men : any = {
        menuitem:this.menuItem,
        quantity: 1,
        amount:this.menuPrice
        }

        this.menuitems.push(men);
  
    }
   
  }

  deleteItem(i: any){
    this.menuitems.splice(i, 1);
  }

  sendHeader(): void {
    // Send message to subscribers via observable subject
    
      this
        .appService
        .sendHeader("header", 'homs management', 'hello', '');
    
  }

  ngAfterViewInit() {
  }
  
  addMenuExe(){
    let obj = {
      "subsidiaryid":this.subsidiary.id,
      "fromdate": this.fromDate,
      "todate":  this.toDate,
      "menuitems": this.menuitems
      }

      this.plannerService.addAddMenu('/HOMS/InsertMenu',obj)
      .subscribe(res => {
        if (res.status === 200) {
        // this.router.navigate(['/rsb-modules/homs/voucher/voucher-list/view-all']);
        // this.router.navigate(['/rsb-modules/homs//planner/planner-list/view-all']);
        this.closeModal();
         // console.log(res);
          if(res._body == 1){
              this.translate.get('error-messages.menu-add-success', this.appService.currentLang).subscribe(
                  (subHeaderT) => {
                      this.appService.showSuccess(subHeaderT);
                  }
              );
          }
          if(res._body == 0){
              this.translate.get('error-messages.menu-add-failed', this.appService.currentLang).subscribe(
                  (subHeaderT) => {
                      this.appService.showFail(subHeaderT);
                  }
              );
          }
            if(res._body>=2){
                this.appService.generalExceptions(res._body);
            }

         }
       },
        (error: any) => {
            this.translate.get('error-messages.menu-add-failed', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    this.appService.showFail(subHeaderT);
                }
            );
      });
      }


  

  updateAddMenu(item){ 
    if(this.addMenuCount == 0)
    {
      
     let obj = {
      "subsidiaryid":item.subsdiaryid,
      "fromdate":  this.fromDate,
      "todate": this.toDate,
      "menuitems": item.menuitem
      }
      this
        .plannerService
        .updateAddMenu('/HOMS/Updateaddmenu',obj)
        .subscribe(res => {
          if (res._body === 1) {
            this.closeModal();
              this.translate.get('error-messages.menu-update-success', this.appService.currentLang).subscribe(
                  (subHeaderT) => {
                      this.appService.showSuccess(subHeaderT);
                  }
              );
          }
            if (res._body === 0) {
                this.translate.get('error-messages.menu-update-failed', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            }
            if(res._body>=2){
                this.appService.generalExceptions(res._body);
            }
        }, (error: any) => {
            this.translate.get('error-messages.menu-update-failed', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    this.appService.showFail(subHeaderT);
                }
            );
        });
    }else{
      
      //let obj = {
        //"number": item.number,
        //"amount": item.amount,
        //"employeeid": item.employeeid
    //}
    
    this.plannerService.addAddMenu('/HOMS/InsertVoucher',this.addmenu)
    .subscribe(res => {
        if (res._body === 1) {
            this.closeModal();
            this.translate.get('error-messages.menu-add-success', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    this.appService.showSuccess(subHeaderT);
                }
            );
        }
        if (res._body === 0) {
            this.translate.get('error-messages.menu-add-failed', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    this.appService.showFail(subHeaderT);
                }
            );
        }
        if(res._body>=2){
            this.appService.generalExceptions(res._body);
        }
    }, (error: any) => {
        this.translate.get('error-messages.menu-add-failed', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                this.appService.showFail(subHeaderT);
            }
        );
    });
    }
    
  }

  

  closeModal() {
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
  }
  
}
