import { Device, DeviceType } from './../shared/device';
import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { DeviceConService } from '../device.service';
import { PersonalInfo, EmployementDetails, EmergencyVehicle, PolicyViewObject } from '../device';
import { Router } from '@angular/router';

import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'app-add-device-frequency',
  templateUrl: './add-device-frequency.component.html',
  styleUrls: ['./add-device-frequency.component.scss']
})
export class AddDeviceFrequencyComponent implements OnInit {

  public device: any = {};
  public devicetypes: DeviceType[];

  public model:Device;
  public now = moment();
  
  public cardNumber:string;
  public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));

  constructor(public translate:TranslateService,
    public dialogRef: MatDialogRef<AddDeviceFrequencyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private deviceService: DeviceConService,
    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    private router: Router) {
    this.device = data.device;
    //this.model=new Device();
    this.model=data.device;
      dialogRef.disableClose = true;
   
  }

  ngOnInit() {
    this.getDeviceTypes();
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
      @Desc get device types for fill the  device types  drop down
      @Param
      @return
  */
  getDeviceTypes(){
    this
    .deviceService
    .getDevicetypes("/SP/GetSettingsDeviceTypes")
    .subscribe(res => {
      if (res.status === 200) {
        let items = JSON.parse(res._body);
        this.devicetypes=items;
      }
    }, (error: any) => {
        this.translate.get('error-messages.device-no-data', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                this.appService.showFail(subHeaderT);
            }
        );

    });
}


    /**
      @Desc edit device type data
      @Param
      @return
  */
  editDeviceType(){
    let obj = {
      "devicetypeid":this.model.devicetypeid,
      "ontime":this.model.ontime,
      "offtime":this.model.offtime
          }
     this
       .deviceService
       .addDeviceType('/SP/UpdateDeviceTypeSchedule',obj)
       .subscribe(res => {
           let x=res._body;
           //if (res.status === 200){// && res._body ===1) {
           if(x==1){
               this.closeModal();
               this.translate.get('error-messages.device-type-update-success', this.appService.currentLang).subscribe(
                   (messageText) => {
                       this.appService.showSuccess(messageText);
                   }
               );

           }
           if(x===0){
               this.translate.get('error-messages.device-type-update-failed', this.appService.currentLang).subscribe(
                   (messageText) => {
                       this.appService.showFail(messageText);
                   }
               );
           }
           //else if(res.status === 200 && res._body ===2){
           if(x>=2){
               this.appService.generalExceptions(x);

           }
       }, (error: any) => {
           this.translate.get('error-messages.device-type-update-failed', this.appService.currentLang).subscribe(
               (messageText) => {
                   this.appService.showFail(messageText);
               }
           );

       });
 }

    /**
      @Desc edit device type frequency data
      @Param
      @return
  */
 editDeviceTypeFrequency(){
  let obj = {
    "devicetypeid":this.model.devicetypeid,
    "minutes":this.model.minutes,
    "seconds":this.model.seconds
        }
        
   this
     .deviceService
     .editDeviceTypeFrequency('/SP/UpdateDeviceTypeFrequency',obj)
     .subscribe(res => {
         let x=res._body;
         //if (res.status === 200){// && res._body ===1) {
         if(x==1){
             this.closeModal();
             this.translate.get('error-messages.device-type-frequency-update-success', this.appService.currentLang).subscribe(
                 (messageText) => {
                     this.appService.showSuccess(messageText);
                 }
             );

         }
         if(x===0){
             this.translate.get('error-messages.device-type-frequency-update-failed', this.appService.currentLang).subscribe(
                 (messageText) => {
                     this.appService.showFail(messageText);
                 }
             );
         }
         //else if(res.status === 200 && res._body ===2){
         if(x>=2){
             this.appService.generalExceptions(x);

         }
     }, (error: any) => {
         this.translate.get('error-messages.device-type-frequency-update-failed', this.appService.currentLang).subscribe(
             (messageText) => {
                 this.appService.showFail(messageText);
             }
         );

     });
}

    /**
      @Desc open set time modal to set time for device type form
      @Param elemnt id and element name
      @return
  */
openTimer(id, field) {
  //let eve = event;
  let self = this;
  $('#'+id).mdtimepicker({
      timeFormat: 'hh:mm:ss',
      format: 'HH:mm tt',
      theme: 'blue',
      readOnly: false,
      hourPadding: false
    })
    .on('timechanged', function (e) {
      if(field=="ontime"){
        self.model.ontime=e.time;
      }

      if(field=="offtime"){
        self.model.offtime=e.time;
      }
    });
    ;
}


    /*
      @Desc close modal
      @Param
      @return
  */
  closeModal() {
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
  }
  
}
