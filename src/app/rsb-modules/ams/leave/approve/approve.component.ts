import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { LeaveService } from '../leave.service';
import { PersonalInfo, EmployementDetails, EmergencyVehicle, PolicyViewObject } from '../leave';
import { Router } from '@angular/router';

import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss']
})
export class ApproveComponent implements OnInit {
  staff:any;
  rejectData:any;
  appRejTime: any;
  showStaff: any;
  approvereject: any;
  id: any;

  public approveData:any={};
  constructor(
    public dialogRef: MatDialogRef<ApproveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private leaveSerice:LeaveService,
    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    public translate:TranslateService


  ) {
     this.approveData=data.approve;
      dialogRef.disableClose = true;
    }

  ngOnInit() {
    
  }

  sendHeader(): void {
      this
        .appService
        .sendHeader("header", 'ams management', 'hello', '');
    
  }

  ngAfterViewInit() {
  }

  execute(approveData){
    this.
    leaveSerice
    .approveLeave(approveData)
    .subscribe(res => {
      if (res.status === 200) {
          this.appService.showSuccess('LEAVE APPROVED SUCCESSFULLY.');
      }
    }, (error: any) => {
        this.appService.showFail('LEAVE FAILED TO APPROVE.');
    });

  }
  
  

  closeModal() {
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
  }

}
