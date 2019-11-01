
import { Http, Headers } from '@angular/http';
import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { SafetyService } from '../safety.service';
import { PersonalInfo, EmployementDetails, SafetyVehicle, PolicyViewObject } from '../safety';
import { Router } from '@angular/router';

import * as moment from 'jalali-moment';
import { environment } from '../../../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../../../utils/services';

@Component({
  selector: 'app-view-safety',
  templateUrl: './view-safety.component.html',
  styleUrls: ['./view-safety.component.scss']
})
export class ViewSafetyComponent implements OnInit {

  public staff: any = {};

  public passcode: any ;

  public vehicles: SafetyVehicle[] = [];

  public now = moment();
  
  public cardNumber:string;
  public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));

  constructor(
    public dialogRef: MatDialogRef<ViewSafetyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private staffService: SafetyService,
    public appService: AppService,
    public httpService:HttpService,
    private sessionStorageService: SessionStorageService,
    public translate:TranslateService,
    private router: Router) {
   // alert(data) ;

      dialogRef.disableClose = true;
   
  }

  ngOnInit() {
    
   // this.sendHeader();
  }

  sendHeader(): void {
    // Send message to subscribers via observable subject
    
      this
        .appService
        .sendHeader("header", 'sems management', 'hello', '');
    
  }

  ngAfterViewInit() {
  }

  execute() {
    if(this.passcode == "0000"){
     
     // post(environment.baseUrl2+'/SFMS/UpdateSwitchStatus',
        let data = {
            operationType: 3,
            type: 'SRN',
            state: this.data
        };
        this.httpService
            .post('/rsb-iot/device/command', data)
            .subscribe(data => {
                },
                (error) => {
                    this.appService.showFail('FAILED TO TRIGGER SIRENS.');
                }
            );
    }else{
        this.appService.showFail('FAILED TO TRIGGER SIRENS.');
    }
     this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
            
  }


  closeModal() {
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
  }

  goToParticularStep(step, message, staffObj) {
    console.log(staffObj);
    this.sessionStorageService.store('editStaffStep', step);
    this.sessionStorageService.store('editStaffMessage', message);
    this.sessionStorageService.store('editStaffObj', staffObj);
    // setTimeout(() => {
      this.dialogRef.close();
      this.router.navigate(['/rsb-modules/organization/safety/managesafety/prepare']);
    // }, 2000);
  }
}

