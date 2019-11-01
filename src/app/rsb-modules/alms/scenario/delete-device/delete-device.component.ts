import { Device } from './../shared/device';
import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { DeviceConService } from '../device.service';
import { PersonalInfo, EmployementDetails, EmergencyVehicle, PolicyViewObject } from '../device';
import { Router } from '@angular/router';
import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-delete-device',
  templateUrl: './delete-device.component.html',
  styleUrls: ['./delete-device.component.scss']
})
export class DeleteDeviceComponent implements OnInit {

  public staff: any = {};

  public vehicles: EmergencyVehicle[] = [];

  public now = moment();
  public model: any = [];
  public cardNumber:string;
  public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));

  constructor(public translate:TranslateService,
    public dialogRef: MatDialogRef<DeleteDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private staffService: DeviceConService,
    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private deviceService: DeviceConService
  ) {
    this.staff = data.staff;
   
    this.model=data.device;
    console.log(this.model);
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
        .sendHeader("header", 'alms management', 'hello', '');
    
  }

  ngAfterViewInit() {
  }

    /**
      @Desc delete device type
      @Param
      @return
  */
   deleteDeviceType(){
     return this
     .deviceService
     .deleteDevice("/SP/DeleteSmartScenario?id="+this.model.id)
         .subscribe(res => {
          if (res._body == 1 ){//&& JSON.stringify(res._body) ==="1") {
              this.translate.get('error-messages.scenario-delete-success', this.appService.currentLang).subscribe(
                  (messageText) => {
                      this.appService.showSuccess(messageText);
                  }
              );
              this
             .dialogRef
             .close(true);
  
          }
          if(res._body==0){
              this.translate.get('error-messages.scenario-delete-failed', this.appService.currentLang).subscribe(
                  (messageText) => {
                      this.appService.showFail(messageText);
                  }
              );

          }

         }, (error: any) => {
             this.translate.get('error-messages.scenario-delete-failed', this.appService.currentLang).subscribe(
                 (messageText) => {
                     this.appService.showFail(messageText);
                 }
             );

         });
   }






    /**
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

    /**
      @Desc it seems this is unused method
      @Param
      @return
  */
  goToParticularStep(step, message, staffObj) {
    console.log(staffObj);
    this.sessionStorageService.store('editStaffStep', step);
    this.sessionStorageService.store('editStaffMessage', message);
    this.sessionStorageService.store('editStaffObj', staffObj);
    // setTimeout(() => {
      this.dialogRef.close();
      this.router.navigate(['/rsb-modules/organization/alert/managealert/prepare']);
    // }, 2000);
  }
}
