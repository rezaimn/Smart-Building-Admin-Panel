import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../app.service';
import {  MatDialog, MatDialogRef } from '@angular/material';
import { PrepareGradeComponent } from '../grade/prepare-grade/prepare-grade.component';
import { LayoutComponent } from '../../../../common/layout/layout.component';
import { PagerComponent } from '../pager/pager.component';
import { PoliciesService } from '../policies.service';
import { ManageGrade } from '../grade/grade';
import { Router } from '@angular/router';
import { SessionStorage } from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-assign-area',
  templateUrl: './assign-area.component.html',
  providers: [PagerComponent],
  styleUrls: ['./assign-area.component.scss']
})
export class AssignAreaComponent implements OnInit {
  @SessionStorage('subdiaryid')
  public subdiaryid;
  @SessionStorage('designation')
  public designation;
  public manageGrades: any[] = [];
  public selectedAreaList: any = {};
  public selectedGrades: any[] = [];
  public selectedGradeArr: any[] = [];
  constructor(
      public translate:TranslateService,
    private appService: AppService,
    private dialog: MatDialog,
    private router: Router,
    private layoutComponent: LayoutComponent, private pagerComponent: PagerComponent, private policiesService: PoliciesService ) { }

  ngOnInit() {
    this.sendHeaderWithLogo();
    this.getGradesAvailable();
    this.updateBreadCrums();
    this.getGradesAvailableForParticularDesin();
    this.pagerComponent.changeState('pager', true, '', '');
    this.pagerComponent.changeState('create', false, '', '');
    this.pagerComponent.changeState('close', true, '', '');
    this.pagerComponent.changeState('edit', false, '', '');
    this.pagerComponent.changeState('step', false, 'next policy', '');
  }

  // sendHeader(): void {
  //   if(this.designation) {
  //     this
  //       .appService
  //       .sendHeader(this.designation.designation, 'Assign grades', 'Manage Grade Policy', '');
  //   }
  // }

  sendHeaderWithLogo(): void {
    // Send message to subscribers via observable subject
    if (this.designation) {
      this
        .appService
        .sendHeaderWithLogo(this.designation.designation, 'Assign grades', 'Manage Grade Policy', '','../../../../../assets/images/dashboard/OMS.png');
    }
  }

  updateBreadCrums() {
    this
      .appService
      .updateBreadCrums('GRADES');
  }

  // make createGradeClicked as true on click of create grade
  openPrepareGrade() {
    let prepareGradeComponentData = {
      "message": "new",
      "index": this.manageGrades.length + 1,
      "department": {}
    };
    this
      .layoutComponent
      .addClass();
    const dialogRef = this
      .dialog
      .open(PrepareGradeComponent, {
        width: '620px',
        height: 'auto',
        data: prepareGradeComponentData,
        hasBackdrop: false
      });
    dialogRef
      .afterClosed()
      .subscribe(result => {
        this
          .layoutComponent
          .removeClass();
        this.getGradesAvailable();
      });
  }
  // get the grdaes
  getGradesAvailable() {
    this.manageGrades = [];
    this
      .policiesService
      .getGradeList(`/rsb-oms/oms/getAllGradesPoliciesBySubsidairyId?subsidairyId=` + this.subdiaryid)
      .subscribe(res => {
        if (res.status === 200) {
          // console.log(res._body);
          this.manageGrades = JSON.parse(res._body);
          console.log(this.manageGrades);
        }
      }, (error: any) => {
      });
  }
  // get the grdaes for particular designation
  getGradesAvailableForParticularDesin() {
    this.selectedGradeArr = [];
    this
      .policiesService
      .getGradeList(`/rsb-oms/oms/getGradePolicyGroup?subsidairyId=` + this.subdiaryid + '&designationId=' + this.designation.id)
      .subscribe(res => {
        if (res.status === 200) {
          console.log(JSON.parse(res._body));
          let selectedGradeArrFromApi;
          selectedGradeArrFromApi = JSON.parse(res._body);
          this.selectedGradeArr = selectedGradeArrFromApi.gradePolicy;
          console.log(this.selectedGradeArr);
        }
      }, (error: any) => {

      });
  }
  // add selected class on click of chips
  selectGrades(event, selectedGradeIndex, grade) {
    $(event.currentTarget.children).toggleClass('activeChip');
    if (!$(event.currentTarget.children).hasClass('activeChip')) {
      delete this.selectedAreaList[selectedGradeIndex];
    } else {
      this.selectedAreaList[selectedGradeIndex] = grade;
    }
  }
  // Collecting all the selected areas
  pushSelectedAreasToSelectedGrades() {
    if (Object.keys(this.selectedAreaList).length <= 0) {

    }else {
      this.passSelectedAreaData(this.selectedAreaList);
    }
    // this.selectedGradeArr = this.selectedAreaList;
  }

  //  remove grade's on change of area's list
  removeGrades(event, selectedGradeIndex, area) {
    this.selectedGradeArr.splice(selectedGradeIndex, 1);
    console.log(this.selectedGradeArr);
  }

  // passSelectedAreaData(event) {
  //   Object.keys(event).forEach((key) => {
  //     // console.log(event[key]);
  //     // if (this.hasOwnProperty(key) !== this.selectedGradeArr.hasOwnProperty(key)) {
  //     //   return;
  //     // }else {
  //       this.selectedGradeArr.push(event[key]);
  //     // }
  //   });
  //   console.log(this.selectedGradeArr);
  // }

  saveGradesForParticularDesig() {
    // console.log(this.selectedGradeArr);
    // // let selectedGradesForParticulardesignation: ManageGrade [] = [];
    // let someArray = [];
    // // this.selectedGrades.push(new ManageAsignArea());
    // this.selectedGradeArr.forEach(element => {
    //   someArray.push(element.id);
    // });

    let createGradeData = {
      subsidairyId: this.subdiaryid,
      designationId: this.designation.id,
      gradePolicy: this.selectedGradeArr
    };
    if (this.selectedGradeArr.length >= 1){
      this
      .policiesService
      .createUpdateGrade(`/rsb-oms/oms/createGradePolicyGroup`, createGradeData)
      .subscribe(res => {
        if (res.status === 200) {
          // console.log(res._body);
          let selectedGradeArrFromApi;
          selectedGradeArrFromApi = JSON.parse(res._body);
          this.selectedGradeArr = selectedGradeArrFromApi;
          // let snackref = this.snackBar.open('Grade assigned successfully', 'okay', { duration: 3000 });
          // this.getGradesAvailable();
          this.getGradesAvailableForParticularDesin();
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
    
  }
  //  delete grade
  deleteGrade() {
    let gradeIds = [];
    console.log('delete');
    Object.keys(this.selectedAreaList).forEach((key) => {
      console.log(key);
      gradeIds.push(this.selectedAreaList[key].id);
    });
    const deleteGradesData = {
      ids: gradeIds
    };
    if (gradeIds.length >= 1) {
      this.policiesService.deleteGrade('/rsb-oms/oms/deleteGradeDetailsByIdList', deleteGradesData)
      .subscribe(res => {
        if (res.status === 200) {
          this.getGradesAvailable();
        }
      }, (error: any) => {

      });
    }
  }
  isAreaChoosen(areaId) {
    let areaSelected: boolean = false;
    this.selectedGradeArr.forEach(element => {
      if (element.id === areaId && areaSelected === false) {
        areaSelected = true;
      }
    });
    return areaSelected;
  }
  passSelectedAreaData(event) {
    Object.keys(event).forEach((key) => {
      let areaSelected = this.isAreaChoosen(event[key].id);
      if (!areaSelected) {
        let value = event[key];
        if (value.name === undefined) {
          event[key].name = event[key].areaName;
        }
        this.selectedGradeArr.push(event[key]);
      }
    });
  }

  cancelAssignArea() {
    this
    .router
    .navigate(['/rsb-modules/organization/dept/policies/grade/manage']);
  }
}

