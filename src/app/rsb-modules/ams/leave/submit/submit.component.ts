import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LeaveService } from '../leave.service';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss'],
  providers:[DatePipe]
})
export class SubmitComponent implements OnInit {

  public submitLeave: any = {};

  public now = moment();
  
  public cardNumber:string;

  constructor(
    public dialogRef: MatDialogRef<SubmitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    public appService: AppService,
    public datePipe: DatePipe,
    public leaveService:LeaveService,
    private sessionStorageService: SessionStorageService,
    public translate:TranslateService,

    private router: Router) {
      dialogRef.disableClose = true;
    this.submitLeave = data.reject; 
    console.log(this.submitLeave);
  }

  ngOnInit() {

  }

  sendHeader(): void {
      this
        .appService
        .sendHeader("header", 'ams management', 'hello', '');
    
  }

  submitLeaveByEmployee(leave){
    let obj:any={
      "id":leave.id,
      "staffid":leave.staffid,
      "leavetypeid":leave.leavetypeid,
      "leavefrom":leave.leavefrom,
      "leaveto":leave.leaveto,
      "leavedays":leave.leavedays,
      "leavehours":leave.leavehours,
      "reasonforleave":leave.reasonforleave
    }
    console.log(leave);
    this.leaveService
      .submitLeaveByEmployee(obj)
      .subscribe(res => {
          if(res._body == 1) {
              this.appService.showSuccess('LEAVE ADDED SUCCESSFULLY.');
              this.closeModal();
          }
          if(res._body==0){
              this.appService.showFail('LEAVE FAILED TO CREATE.');
          }
          if(res._body>=2){
              this.appService.generalExceptions(res._body);
          }
      }, (error: any) => {
          this.appService.showFail('LEAVE FAILED TO CREATE.');
      })
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
