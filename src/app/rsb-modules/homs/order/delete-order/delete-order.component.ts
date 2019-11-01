import { OrderService } from './../order.service';
import { Order } from './../order';
import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
//import { OrderService } from '../order.service';
import { PersonalInfo, EmployementDetails, EmergencyVehicle, PolicyViewObject } from '../order';
import { Router } from '@angular/router';
import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-delete-order',
  templateUrl: './delete-order.component.html',
  styleUrls: ['./delete-order.component.scss']
})
export class DeleteOrderComponent implements OnInit {

  public staff: any = {};

  public vehicles: EmergencyVehicle[] = [];

  public now = moment();
  
  public cardNumber:string;
  public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));

  constructor(
    public dialogRef: MatDialogRef<DeleteOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private staffService: OrderService,
    public appService: AppService,
    public translate:TranslateService,
    private sessionStorageService: SessionStorageService,
    private router: Router) {
    this.staff = data.order;
      dialogRef.disableClose = true;
   
  }

  ngOnInit() {
    
   // this.sendHeader();
  }

  sendHeader(): void {
    // Send message to subscribers via observable subject
    
      this
        .appService
        .sendHeader("header", 'alms management', 'hello', '');
    
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

  delete(){
   // alert(this.staff);
  

   
    this
      .staffService
      .getDeleteOrders('/HOMS/DeleteOrder?id='+this.staff.id)
      .subscribe(res => {
          if (res._body === 1) {
              this.translate.get('error-messages.order-delete-success', this.appService.currentLang).subscribe(
                  (subHeaderT) => {
                      this.appService.showSuccess(subHeaderT);
                  }
              );

              this.closeModal();
          }
        if (res._body === 0) {
            this.translate.get('error-messages.order-delete-failed', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    this.appService.showFail(subHeaderT);
                }
            );
          this.closeModal();
        }
      }, (error: any) => {
          this.translate.get('error-messages.order-delete-failed', this.appService.currentLang).subscribe(
              (subHeaderT) => {
                  this.appService.showFail(subHeaderT);
              }
          );
          this.closeModal();
      });
  }
 
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
