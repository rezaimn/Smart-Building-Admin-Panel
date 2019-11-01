import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { PlugService } from '../plug.service';
import { PersonalInfo, EmployementDetails, PlugVehicle, PolicyViewObject } from '../plug';
import { Router } from '@angular/router';

import * as moment from 'jalali-moment';

@Component({
  selector: 'app-view-plug',
  templateUrl: './view-plug.component.html',
  styleUrls: ['./view-plug.component.scss']
})
export class ViewPlugComponent implements OnInit {

  public staff: any = {};

  public vehicles: PlugVehicle[] = [];

  public now = moment();
  
  public cardNumber:string;
  public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));

  constructor(
    public dialogRef: MatDialogRef<ViewPlugComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private staffService: PlugService,
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
// get the plug details
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
          this.vehicles.push(new PlugVehicle(vehicle));
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
      this.router.navigate(['/rsb-modules/organization/plug/manageplug/prepare']);
    // }, 2000);
  }
}
