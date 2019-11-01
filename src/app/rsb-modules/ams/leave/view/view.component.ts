import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  public leaveDetails: any = {};
  
  public cardNumber:string;

  constructor(
    public dialogRef: MatDialogRef<ViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    public translate:TranslateService,

    private router: Router) {
      dialogRef.disableClose = true;
    this.leaveDetails = data.reject; 
    console.log( this.leaveDetails);
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
  
  
 
  closeModal() {
    console.log('sdsd');
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
  }

}
