import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { OrderService } from '../order.service';
import { PersonalInfo, EmployementDetails, EmergencyVehicle, PolicyViewObject } from '../order';
import { Router } from '@angular/router';

import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewOrderComponent implements OnInit {

  public data1: any = [];
  public showmenu: any =[];
 
  constructor(
    public dialogRef: MatDialogRef<ViewOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    public translate:TranslateService,
    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    public TranslateService:TranslateService,
    private router: Router) {
    
    console.log(data);
    this.data1 = data.order;
    this.showmenu = data.order.orderitems;
      dialogRef.disableClose = true;
  }

  ngOnInit() {
    
   // this.sendHeader();
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
