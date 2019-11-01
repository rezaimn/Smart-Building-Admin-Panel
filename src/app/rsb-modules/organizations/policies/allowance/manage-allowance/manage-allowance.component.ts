import { PrepareAllowance } from '../allowance';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppService } from '../../../../../app.service';
import { LayoutComponent } from '../../../../../common/layout/layout.component';
import {  MatDialog, MatDialogRef } from '@angular/material';
import { PrepareAllowanceComponent } from '../prepare-allowance/prepare-allowance.component';
import { ConfirmModalComponent } from '../../../../../common/confirm-modal/confirm-modal.component';
import { PoliciesService } from '../../policies.service';
import { PagerComponent } from '../../pager/pager.component';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AllowanceService } from '../allowance.service';
import { SessionStorage, SessionStorageService } from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-manage-allowance',
  templateUrl: './manage-allowance.component.html',
  styleUrls: ['./manage-allowance.component.scss']
})
export class ManageAllowanceComponent implements OnInit {
  @SessionStorage('designation')
  public designation;
  public manageAllowance: any[] = [];
  public prepareAllowanceDataGot;
  public editClicked = false;
  public editClikedFromPrepareDept = localStorage.getItem('editClikedFromPrepareDept');
  constructor(public translate:TranslateService,private appService: AppService, private layoutComponent: LayoutComponent,
    public dialog: MatDialog,
    private policiesService: PoliciesService, private pagerComponent: PagerComponent,
    private router: Router, private allowanceService: AllowanceService, public sessionStorageService: SessionStorageService) { }

  ngOnInit() {
    this.sendHeaderWithLogo();
    this.getAllowanceAvailable();
    this.updateBreadCrums();
    this.pagerComponent.changeState('pager', true, '', '');
    this.pagerComponent.changeState('create', false, '', '/rsb-modules/organization/dept/policies/allowance/prepare/');
    this.pagerComponent.changeState('close', true, '', '');
    this.pagerComponent.changeState('edit', false, '', '');
    this.pagerComponent.changeState('step', false, 'next policy', '');
    // localStorage.setItem('editClikedFromPrepareDept', 'false');

    this
      .sessionStorageService
      .observe('createClicked')
      .subscribe((clickedRes) => {
        // this.editClikedFromPrepareDept = clickedRes;
        if (clickedRes == false) {
          this.editClicked = false;
          this.getAllowanceAvailable();
        } else {
          this.editClicked = true;
        }
      });

  }
  // sendHeader(): void {
  //   // send message to subscribers via observable subject
  //   if(this.designation) {
  //     this
  //       .appService
  //       .sendHeader(this.designation.designation, 'Manage allowance policy', 'manage allowance policies', '');
  //   }
  // }
  sendHeaderWithLogo(): void {
    // Send message to subscribers via observable subject
    if (this.designation) {
      this
        .appService
        .sendHeaderWithLogo(this.designation.designation, 'Manage allowance policy', 'manage allowance policies', '','../../../../../assets/images/dashboard/OMS.png');
    }
  }

  updateBreadCrums() {
    this
      .appService
      .updateBreadCrums('ALLOWANCE');
  }
  //  manage allowance
  getAllowanceAvailable() {
    this.manageAllowance = [];
    this
      .policiesService
      .getGradeList(`/rsb-oms/oms/getAllowancePoliciesByDesignationId?designationId=` + this.designation.id)
      .subscribe(res => {
        if (res.status === 200) {
          this.manageAllowance = JSON.parse(res._body);
        }
      }, (error: any) => {

      });
  }
  // Create Designation
  prepareAllowanceFunction(message, index, allowance) {
    let prepareAllowanceComponentData = {
      'message': message,
      'index': index,
      'desgn': allowance ? allowance : new PrepareAllowance()
    };
    this.sessionStorageService.store("createClicked", true);
    this.editClicked = true;
    this.prepareAllowanceDataGot = prepareAllowanceComponentData;
  }

  // // delete Designation
  // deleteAllowance(message, index, desgn) {
  //   let deleteAllowanceComponentData = {
  //     'message': message,
  //     'index': index,
  //     'desgn': desgn
  //   };
  //   this
  //     .layoutComponent
  //     .addClass();
  //   const dialogRef = this
  //     .dialog
  //     .open(ConfirmModalComponent, {
  //       width: '640px',
  //       height: 'auto',
  //       data: deleteAllowanceComponentData
  //     });
  //   dialogRef
  //     .afterClosed()
  //     .subscribe(result => {
  //       this
  //         .layoutComponent
  //         .removeClass();
  //       // this.getDesignation();
  //     });
  // }
  deleteAllowance(id) {
    const deleteUrl = '/rsb-oms/oms/deleteAllowancePolicyById?id=' + id;
    this
      .layoutComponent
      .addClass();
    const dialogRef = this
      .dialog
      .open(ConfirmModalComponent, {
        width: '640px',
        height: 'auto',
        data: deleteUrl
      });

    dialogRef
      .afterClosed()
      .subscribe(result => {
        this
          .layoutComponent
          .removeClass();
        this.getAllowanceAvailable();
      });
  }
}
