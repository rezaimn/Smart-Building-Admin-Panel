import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { AlertDashboardService } from '../alert-dashboard.service';

import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-alert-status',
  templateUrl: './alert-status.component.html',
  styleUrls: ['./alert-status.component.scss']
})
export class AlertStatusComponent implements OnInit {

    public alertId: any = {};
    public depContent: any = {} ;


  constructor(
    public dialogRef: MatDialogRef<AlertStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,

    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    private AlertDashboardService:AlertDashboardService,
    private router: Router,
    public translate:TranslateService) {
    this.alertId = data;
      dialogRef.disableClose = true;
   
  }

  ngOnInit() {
    
   // this.sendHeader();
  }


  closeModal() {
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
  }

 // select button


   // close alert action
   closeAlertAction() {
     this.AlertDashboardService.closeAlert(this.alertId).subscribe(
      res => {
        console.log(res);
        if(res.status == 200) {
            this.translate.get('error-messages.status-closed-success',this.appService.currentLang).subscribe(
                (subHeaderT)=> {
                    this.appService.showSuccess(subHeaderT);
                }
            )

          sessionStorage.setItem('popup', '1');
          this.closeModal();
        } else {
            this.translate.get('error-messages.status-failed-close',this.appService.currentLang).subscribe(
                (subHeaderT)=> {
                    this.appService.showFail(subHeaderT);
                }
            )
        }
      }, (error: any) => {
        console.log(error);
      })
   }
}

