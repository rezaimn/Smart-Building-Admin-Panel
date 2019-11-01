import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { SwitchService } from '../switch.service';
import { PersonalInfo, EmployementDetails, SwitchVehicle, PolicyViewObject } from '../switch';
import { Router } from '@angular/router';

import * as moment from 'jalali-moment';

@Component({
  selector: 'app-view-switch',
  templateUrl: './view-switch.component.html',
  styleUrls: ['./view-switch.component.scss']
})
export class ViewSwitchComponent implements OnInit {

  public staff: any = {};

  public vehicles: SwitchVehicle[] = [];

  public now = moment();
  
  public cardNumber:string;
  public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));

  constructor(
    public dialogRef: MatDialogRef<ViewSwitchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private staffService: SwitchService,
    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    private router: Router) {
    this.staff = data.staff;
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
  
  onSubmit(){
    
    this
        .staffService
        .updateAccessCard( this.staff)
        .subscribe((data) => {
          //alert ("card updated successfully");
          let jsonData = JSON.parse(data._body);
          console.log(jsonData);
         
          if (jsonData.length){
           
            console.log(jsonData.length);
            jsonData = JSON.parse(jsonData);
            //jsonData = JSON.format();
            // this.snackBar.open(jsonData.error+" : "+jsonData.message, 'okay', { duration: 3000 });
          } else {
            // this.snackBar.open("Card Updated Successfully", 'okay', { duration: 3000 });
          }
         
          this.closeModal() ;
        }, (error) => {
          // this.snackBar.open('There was an error while updating the card', 'okay', { duration: 3000 });
        });
    
  }

  getPolicyDetails(staffId) {
    this.staffService
      .getPolicyDetails(staffId)
      .subscribe((res) => {
        this.policyObject = new PolicyViewObject(JSON.parse(res._body), this.now.format('YYYY-MM-DD') + 'T');
      }, (err) => {

      });
  }

  closeModal() {
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
  }
  getVehicleDetails(staffId) {
    this.staffService
      .getVehicleDetails(staffId)
      .subscribe((res) => {
        let responseVehicles = JSON.parse(res._body);
        // vehicles
        responseVehicles.forEach(vehicle => {
          this.vehicles.push(new SwitchVehicle(vehicle));
        });
      }, (err) => {

      });
  }
  goToParticularStep(step, message, staffObj) {
    console.log(staffObj);
    this.sessionStorageService.store('editStaffStep', step);
    this.sessionStorageService.store('editStaffMessage', message);
    this.sessionStorageService.store('editStaffObj', staffObj);
    // setTimeout(() => {
      this.dialogRef.close();
      this.router.navigate(['/rsb-modules/organization/switch/manageswitch/prepare']);
    // }, 2000);
  }
}
