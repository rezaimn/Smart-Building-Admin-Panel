import { Database } from './../shared/database';
import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { DatabaseService } from '../database.service';

import { Router } from '@angular/router';

import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-edit-database',
  templateUrl: './edit-database.component.html',
  styleUrls: ['./edit-database.component.scss']
})
export class EditDatabaseComponent implements OnInit {

  public database: any = {};
  public model: Database;
  public now = moment();
  
  public cardNumber:string;


  constructor(
    public dialogRef: MatDialogRef<EditDatabaseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private databaseService: DatabaseService,
    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    public translate:TranslateService) {
    //this.database = data.database;
    this.model=data.db;
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
    // Send message to subscribers via observable subject
    
      this
        .appService
        .sendHeader("header", 'homs management', 'hello', '');
    
  }

  ngAfterViewInit() {
  }
  
  //editDatabase(){
    //console.log(this.model);
   // return this.databaseService.editDatabase("/SP/UpdateDatabaseSettings",this.model);
  //}

    /**
         @Desc edit data base configuration
         @Param
         @return
     */
  editDatabase(){//model: any){ 
     let obj = {
      "id":this.model.id,
      "server":this.model.server,
      "dbname":this.model.dbname,
      "username":this.model.username,
      "password":this.model.password
           };
      this
        .databaseService
        .editDatabase('/SP/UpdateDatabaseSettings',obj)
        .subscribe(res => {
          if (res._body === 1) {
            this.closeModal();
              this.translate.get('error-messages.database-update-success', this.appService.currentLang).subscribe(
                  (messageText) => {
                      this.appService.showSuccess(messageText);
                  }
              );

          }
            if (res._body === 0) {
                this.closeModal();
                this.translate.get('error-messages.database-update-failed', this.appService.currentLang).subscribe(
                    (messageText) => {
                        this.appService.showFail(messageText);
                    }
                );

            }
            if (res._body >=2) {
                this.closeModal();
                this.appService.generalExceptions(res._body);
            }
        }, (error: any) => {
            this.translate.get('error-messages.database-update-failed', this.appService.currentLang).subscribe(
                (messageText) => {
                    this.closeModal();
                    this.appService.showFail(messageText);
                }
            );
        });
  }


    /**
         @Desc close the edit modal
         @Param
         @return
     */
  closeModal() {
      this.databaseService.cancelButtonClicked.emit(true);
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
  }
 
}
