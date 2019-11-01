import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { TicketManagementService } from '../ticket-management.service';
import { PersonalInfo, EmployementDetails, EmergencyVehicle, PolicyViewObject } from '../ticket-management';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {NgModel} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
declare let $ : any;
import {CalendarConverterService} from '../../../../calendar-converter-service';
import * as moment from 'jalali-moment';
@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.scss'],
  providers: [DatePipe]
})
export class EditTicketComponent implements OnInit {
  public alertData: any = {};
  designation: any;
  showDesignation: any;
  departmentList: any;
  subDepartmentList: any;
  systemList: any;
  severityList: any;
  ownerList: any;
  dateTimeObj: any = {
    'etcdate': '',
    'etctime': ''
  };
    public date: any; //= "02/03/2018";//current date
    public pickedDate: any;
    public currentDate: any;
  constructor(
    public dialogRef: MatDialogRef<EditTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    public translate:TranslateService,
    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    private TicketManagementService:TicketManagementService,
    public dateAdapter: DateAdapter<Date>,
    private datePipe: DatePipe,
    private calendarConverter: CalendarConverterService,
    private router: Router) {
      this.dateAdapter.setLocale('en-In');
      var now = Date.now();
      this.currentDate = this.datePipe.transform(now, 'dd/MM/yyyy');
      this.pickedDate = new Date(now);
      this.date = this.currentDate;
    this.alertData = data;

    console.log(this.alertData, 'this.alertData');
      dialogRef.disableClose = true;
  }

  @SessionStorage('subsidiary')
  subsidiary: any;

  @SessionStorage('user')
  public user;

  @SessionStorage('addAlert')
  public addAlert;

  ngOnInit() {
    if(!this.subsidiary) {
      this.subsidiary = {
        'id': 1
      };
    }
    this.showDesignation = true;
    this.getDepartment();
    this.getSystem();
    this.getSeverity();
    if(this.alertData.module) {
      this.alertData.departmentId = this.alertData.department.id;
      this.alertData.moduleid = this.alertData.module.id;
      this.getSubDepartment(this.alertData.departmentId);
      this.getOwner(this.alertData.subdepartment.id);
      this.alertData.subdepartmentId = this.alertData.department.id;
      this.alertData.ownerid = this.alertData.owner.id;
      let splitTime = this.alertData.etcdatetime.split(" ");
       this.dateTimeObj = {
        'etcdate': splitTime[0],
           'etctime': splitTime[1]
       };

    }
      if(this.appService.currentLang=='fa'){
          let jalali=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.dateTimeObj.etcdate));
          this.pickedDate=moment(jalali,'jYYYY,jMM,jDD');
      }
      if(this.appService.currentLang=='en'){
          this.pickedDate=new Date(this.calendarConverter.convertDateFormat(this.date));
      }

  }


    //this method will convert start date to UTC date if it's not
    convertJalaliDateToUTC(tempDate: any) {
        this.date = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
    }
    convertGregorianDateToUTC(tempDate: any) {
        this.date= this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
    }

    closeModal() {
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
 
  }

  openTimer(event : NgModel, id) {
  
    let eve = event;
    let self = this;
    $('#' + id)
      .mdtimepicker({
        timeFormat: 'hh:mm:ss',
        // format: 'HH:mm tt',
        theme: 'blue',
        readOnly: false,
        hourPadding: false
      })
      .on('timechanged', function (e) {
        console.log(e.time);
        self.dateTimeObj['etctime'] = e.time;
      });
  }

  // get designation
  getDesignation() {
    this.TicketManagementService.getDesignation(this.user.staff_id).subscribe(
    res => {
      this.designation = JSON.parse(res._body);
      console.log(this.designation);
      if(this.designation.designation == 'CEO' || this.designation.designation == 'Staff') {
        this.showDesignation = false;
      }
    }, (error: any) => {
      console.log(error);
    })
  }

  // get department list
  getDepartment() {
    this.TicketManagementService.getDepartments(this.subsidiary.id , this.appService.currentLang).subscribe(
      res => {
        this.departmentList = JSON.parse(res._body);
        console.log(this.departmentList);
      }, (error: any) => {
            this.translate.get('error-messages.department-no-data', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    this.appService.showFail(subHeaderT);
                }
            );
      })
  }

  // get sub department list
  getSubDepartment(departmentId) {
    this.TicketManagementService.getSubDepartments(departmentId , this.appService.currentLang).subscribe(
      res => {
        this.subDepartmentList = JSON.parse(res._body);
        console.log(this.subDepartmentList);
      }, (error: any) => {
            this.translate.get('error-messages.sub-department-no-data', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    this.appService.showFail(subHeaderT);
                }
            );
      })
  }
  // get staff by subdepartment
  getOwner(subId) {
    this.TicketManagementService.getStaffBySubDep(subId).subscribe(
      res => {
        this.ownerList = JSON.parse(res._body);
        console.log(this.ownerList);
      }, (error: any) => {
            this.translate.get('error-messages.owner-no-data', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    this.appService.showFail(subHeaderT);
                }
            );
      })
  }

  // get system list
  getSystem() {
    this.TicketManagementService.getSystems().subscribe(
      res => {
        this.systemList = JSON.parse(res._body);
        console.log(this.systemList);
      }, (error: any) => {
            this.translate.get('error-messages.system-no-data', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    this.appService.showFail(subHeaderT);
                }
            );
      })
  }

  // get severity list
  getSeverity() {
    this.TicketManagementService.getSeverity().subscribe(
      res => {
        this.severityList = JSON.parse(res._body);
        console.log(this.severityList);
      }, (error: any) => {
            this.translate.get('error-messages.severity-no-data', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    this.appService.showFail(subHeaderT);
                }
            );

      })
  }

  // update ticket
  updateEdit(ticketData) {
    console.log(this.dateTimeObj, '');
    console.log(ticketData, 'ticketData');
    ticketData.comments = '';
    ticketData.etcdatetime = this.date + ' ' + this.dateTimeObj['etctime'];
    if(this.addAlert == 0) {
      let ticketObj = {
        "id":ticketData.id,
        "subject":ticketData.subject,
        "description":ticketData.description,
        "moduleid":ticketData.moduleid,
        "ownerid":ticketData.ownerid,
        "severity":ticketData.severity,
        "comments":"",
        "status":ticketData.status,
        "etcdatetime":ticketData.etcdatetime
      };
      this.TicketManagementService.updateTicket(ticketObj).subscribe(
      res => {
        console.log(res, 'res');
        if(res._body == 1) {
            this.translate.get('error-messages.ticket-update-success', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    this.appService.showSuccess(subHeaderT);
                }
            );
            this.closeModal();
        }
          if(res._body == 0) {
              this.translate.get('error-messages.ticket-update-failed', this.appService.currentLang).subscribe(
                  (translateRes) => {
                      this.appService.showFail(translateRes);
                  }
              );
          }
          if(res._body>=2){
              this.appService.generalExceptions(res._body);
          }
      }, (error: any) => {
              this.translate.get('error-messages.ticket-update-failed', this.appService.currentLang).subscribe(
                  (translateRes) => {
                      this.appService.showFail(translateRes);
                  }
              );
      })
    } else {
      this.TicketManagementService.createTicket(ticketData).subscribe(
      res => {
        console.log(res, 'res');
          if(res._body == 1) {
              this.translate.get('error-messages.ticket-add-success', this.appService.currentLang).subscribe(
                  (subHeaderT) => {
                      this.appService.showSuccess(subHeaderT);
                  }
              );
          }
          if(res._body == 0) {
              this.translate.get('error-messages.ticket-add-failed', this.appService.currentLang).subscribe(
                  (subHeaderT) => {
                      this.appService.showFail(subHeaderT);
                  }
              );
          }
          if(res._body>=2){
              this.appService.generalExceptions(res._body);
          }
      }, (error: any) => {
              this.translate.get('error-messages.ticket-add-failed', this.appService.currentLang).subscribe(
                  (subHeaderT) => {
                      this.appService.showFail(subHeaderT);
                  }
              );
          })
    }
  }  
}
