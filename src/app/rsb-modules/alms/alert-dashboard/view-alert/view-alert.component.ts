import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-view-alert',
  templateUrl: './view-alert.component.html',
  styleUrls: ['./view-alert.component.scss']
})
export class ViewAlertComponent implements OnInit {

  public staff: any = {};


  constructor(
    public dialogRef: MatDialogRef<ViewAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,

    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    public translate:TranslateService) {
    this.staff = data.staff;
      dialogRef.disableClose = true;
    
   
  }

  ngOnInit() {
    
   // this.sendHeader();
  }

  // sendHeader(): void {
  //   // Send message to subscribers via observable subject
    
  //     this
  //       .appService
  //       .sendHeader("header", 'alms management', 'hello', '');
    
  // }

  
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

