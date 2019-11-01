import { Url } from './../shared/url';
import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { UrlService } from '../url.service';
import { PersonalInfo, EmployementDetails, EmergencyVehicle, PolicyViewObject } from '../url';
import { Router } from '@angular/router';

import * as moment from 'jalali-moment';
import {DatabaseService} from '../../database/database.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-add-url',
  templateUrl: './add-url.component.html',
  styleUrls: ['./add-url.component.scss']
})
export class AddUrlComponent implements OnInit {

  public url: any = {};
  public model: Url;
  public now = moment();
  
  public cardNumber:string;
  public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));

  constructor(public translate:TranslateService,
    public dialogRef: MatDialogRef<AddUrlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private urlService: UrlService,
    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    private databaseService:DatabaseService,
    private router: Router) {
    //this.url = data.url;
    this.model=data.url;
      dialogRef.disableClose = true;
  }

  ngOnInit() {
    
   // this.sendHeader();
  }

    /**
      @Desc Send message to subscribers via observable subject
      @Param
      @return
  */
  sendHeader(): void {
    //
    
      this
        .appService
        .sendHeader("header", 'homs management', 'hello', '');
    
  }

  ngAfterViewInit() {
  }

    /**
      @Desc edit url config data
      @Param
      @return
  */
  editUrl() {
    let obj = {
     "id":this.model.id,
     "system":this.model.system,
     "url":this.model.url,
     "username":this.model.username,
     "password":this.model.password
          }
     this
       .urlService
       .editUrl('/SP/UpdateURLSettings',obj)
       .subscribe(res => {
           if(res._body == 1) {
               this.translate.get('error-messages.url-update-success', this.appService.currentLang).subscribe(
                   (messageText) => {
                       this.appService.showSuccess(messageText);
                   }
               );

               this.closeModal();
           }
           if(res._body==0){
               this.translate.get('error-messages.url-update-failed', this.appService.currentLang).subscribe(
                   (messageText) => {
                       this.appService.showFail(messageText);
                   }
               );

           }
           if(res._body>=2){
               this.appService.generalExceptions(res._body);
           }
       }, (error: any) => {
           this.translate.get('error-messages.url-update-failed', this.appService.currentLang).subscribe(
               (messageText) => {
                   this.appService.showFail(messageText);
               }
           );
       })
 }


    /**
      @Desc close modal
      @Param
      @return
  */
  closeModal() {
    this.urlService.urlCancelButtonClicked.emit(true);
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
  }
  
}
