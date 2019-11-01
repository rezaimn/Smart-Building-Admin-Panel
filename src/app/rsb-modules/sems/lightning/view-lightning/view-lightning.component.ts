import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { LightningService } from '../lightning.service';
import { PersonalInfo, EmployementDetails, LightningVehicle, PolicyViewObject } from '../lightning';
import { Router } from '@angular/router';

import * as moment from 'jalali-moment';

@Component({
  selector: 'app-view-lightning',
  templateUrl: './view-lightning.component.html',
  styleUrls: ['./view-lightning.component.scss']
})
export class ViewLightningComponent implements OnInit {

  public Lighting: any = {};

  public vehicles: LightningVehicle[] = [];

  public now = moment();
  
  public cardNumber:string;
  public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));

  constructor(
    public dialogRef: MatDialogRef<ViewLightningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private staffService: LightningService,
    public appService: AppService,
    private sessionStorageService: SessionStorageService,
    private router: Router) {
    this.Lighting = data.lighting;
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
        .updateAccessCard( this.Lighting)
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
          this.vehicles.push(new LightningVehicle(vehicle));
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
      this.router.navigate(['/rsb-modules/organization/lightning/managelightning/prepare']);
    // }, 2000);
  }
}
