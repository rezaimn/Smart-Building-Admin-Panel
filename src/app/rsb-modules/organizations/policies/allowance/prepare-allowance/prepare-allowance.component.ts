import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppService } from '../../../../../app.service';
import { PrepareAllowance } from '../allowance';
import { SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { PoliciesService } from '../../policies.service';
import { PagerComponent } from '../../pager/pager.component';
import { Location } from '@angular/common';
import { AllowanceService } from '../allowance.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-prepare-allowance',
  templateUrl: './prepare-allowance.component.html',
  providers: [PagerComponent],
  styleUrls: ['./prepare-allowance.component.scss']
})
export class PrepareAllowanceComponent implements OnInit {
  @Input() prepareAllowanceDataGot;
  @SessionStorage('subdiaryid')
  public subdiaryid;
  @SessionStorage('designation')
  public designation;
  public mode: string;
  public index: number;
  // public prepareAllowance: PrepareAllowance;
  public prepareAllowanceData: any;
  selectedGrade: any;
  public gradePolicy: Array<any> = [];
  message: any;
  public prepareAllowance = new PrepareAllowance();
  subscription: Subscription;
  constructor(public translate:TranslateService,private appService: AppService,
    public sessionStorageService: SessionStorageService, private policiesService: PoliciesService, private pagerComponent: PagerComponent, private _location: Location, private allowanceService: AllowanceService, private router: Router) {
    // this.mode = 'new';

    // this.prepareAllowance = new PrepareAllowance();
    // setTimeout(function(){

  }
  ngOnInit() {
    this.sendHeaderWithLogo();
    this.pagerComponent.changeState('pager', true, '', '');
    this.pagerComponent.changeState('create', false, '', '');
    this.pagerComponent.changeState('close', true, '', '');
    this.pagerComponent.changeState('edit', false, '', '');
    this.pagerComponent.changeState('step', false, 'next policy', '');
    // this.allowanceService.subject.subscribe(message => {
    //   debugger;
    //   console.log(message);
    if (this.prepareAllowanceDataGot.message === 'edit') {
      this.mode = this.prepareAllowanceDataGot.message;
      this.index = this.prepareAllowanceDataGot.index;
      this.prepareAllowance = new PrepareAllowance(this.prepareAllowanceDataGot.desgn);
      console.log(this.prepareAllowance);
      this.gradePolicy.push(this.prepareAllowanceDataGot.desgn.gradePolicy);
      this.selectedGrade = this.prepareAllowanceDataGot.desgn.gradePolicy;
    } else {
      this.mode = 'new';
      this.index = this.prepareAllowanceDataGot.index;
      this.prepareAllowance = new PrepareAllowance();
      this.getGradesForAPrticularDesignation();
      this.selectedGrade = '';
    }
    // });
    console.log(this.prepareAllowanceDataGot);
  }
  // closeModal() {
  //   this
  //   .dialogRef
  //   .close();
  //   this.dialogRef = null;
  // }
  // sendHeader(): void {
  //   // send message to subscribers via observable subject
  //   if (this.designation) {
  //     this
  //       .appService
  //       .sendHeader(this.designation.designation, 'Create allowance policy', 'add Allowance policy', '');
  //   }
  // }
  sendHeaderWithLogo(): void {
    // Send message to subscribers via observable subject
    if (this.designation) {
      this
        .appService
        .sendHeaderWithLogo(this.designation.designation, 'Create allowance policy', 'add Allowance policy', '','../../../../../assets/images/dashboard/OMS.png');
    }
  }

  onSubmit() {
    console.log(JSON.stringify(this.prepareAllowance));
    if (this.mode === 'new') {
      this.prepareAllowance.designationId = this.designation.id;
      this.prepareAllowance.gradePolicy = this.selectedGrade;
      // delete this.prepareAllowance.id;
      this
        .policiesService
        .createUpdateGrade(`/rsb-oms/oms/createAllowancePolicy`, this.prepareAllowance)
        .subscribe((data) => {
          console.log(data);
          // this
          //   .dialogRef
          //   .close(true);
          // let snackref = this.snackBar.open('Allowance created successfully', 'okay', { duration: 3000 });
          // window.location.reload();
          this.returnToManage();
        }, (error) => {
          if (error.status === 1006) {
            // this.snackBar.open('Allowance name already exists', 'okay', { duration: 3000 });
          } else {
            // this.snackBar.open('create allowance policy unsuccessfull', 'okay', { duration: 3000 });
          }
        });
    } else if (this.mode === 'edit') {
      this.prepareAllowance.designationId = this.designation.id;
      this.prepareAllowance.gradePolicy = this.gradePolicy[0];
      this
        .policiesService
        .createUpdateGrade(`/rsb-oms/oms/updateAllowancePolicy`, this.prepareAllowance)
        .subscribe((data) => {
          data = JSON.parse(data._body);
          // let snackref = this.snackBar.open('updated allowance policy', 'okay', { duration: 3000 });
          // this.dialogRef.close(true);
          this.returnToManage();
        }, (error) => {
          // this.snackBar.open('update allowance policy unsuccessfull', 'okay', { duration: 3000 });
        });
    }
  }

  createUpdateAllowancePolices() {
    console.log(this.prepareAllowance);
  }

  //  get grade list
  getGradesForAPrticularDesignation() {
    console.log(this.designation.id);
    // this.prepareAllowance = [];
    this
      .policiesService
      .getGradeList(`/rsb-oms/oms/getGradePolicyGroupForAllowancePolicy?subsidairyId=` + this.subdiaryid + '&designationId=' + this.designation.id)
      .subscribe(res => {
        if (res.status === 200) {
          let data = JSON.parse(res._body);
          this.gradePolicy = data.gradePolicy;
        }
      }, (error: any) => {
        // this
        //   .snackBar
        //   .open('Error occured', 'Ok', {
        //     duration: 5000,
        //     // extraClasses: ['error-snackbar']
        //   });
      });
  }
  returnToManage() {
    this.sessionStorageService.store('createClicked', false);
  }

}
