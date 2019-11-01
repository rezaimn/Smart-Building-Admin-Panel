import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FilterAreaComponent } from '../../../../utils/components/filter-area/filter-area.component';
import { SessionStorage, LocalStorageService } from 'ngx-webstorage';
import { SubDepartmentService } from '../sub-department.service';
import { EavWrapperService } from '../../../../utils/services/eav-wrapper.service'
import { ManageSubDepartment, PrepareSubDepartment } from '../sub-department'
import { sampleTime } from 'rxjs/operator/sampleTime';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';
declare let $: any;
@Component({ selector: 'app-prepare-sub-department', templateUrl: './prepare-sub-department.component.html', styleUrls: ['./prepare-sub-department.component.scss'] })
export class PrepareSubDepartmentComponent implements OnInit,
  OnDestroy {
  @SessionStorage('department')
  public departments;
  public addAreClicked: Boolean = false;
  public subDeptFlag: boolean = false;
  public testArr: any = [];
  public filterFlag: any;
  public mode: string;
  public index: number;
  public selectedAreas = [];
  public prepareSubDepartment;
  public departmentAreas = [];

  public selectAllActive: boolean = false;
  public showErrorMessage: boolean = false;

  @SessionStorage('prepareDepartmentComponentOpenCount')
  public prepareDepartmentComponentOpenCount;

  public addClicked = false;
  public scrollbarOptions = {
    axis: 'y',
    theme: "light-3",
    mouseWheel: {
      enable: true
    },
    contentTouchScroll: 200,
    scrollInertia: 0,
    mouseWheelPixels: 100
  };

  constructor(public translate:TranslateService,public dialogRef: MatDialogRef<PrepareSubDepartmentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private storage: LocalStorageService,
              public appService:AppService,
              private subDepartmentService: SubDepartmentService) {
    this.mode = data.message;
    this.index = data.index;
    this.prepareSubDepartment = new PrepareSubDepartment(data.subdept);
      dialogRef.disableClose = true;
    this.departmentAreas = data.dept_areas;
    if (this.mode == 'edit') {
      this.selectedAreas = data.subdept.areas;
    }
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.prepareDepartmentComponentOpenCount = 0;
    this
      .storage
      .store('addClicked', false);
  }

  expandAddArea() {
    $('#left-elements').addClass('after-slide');
    this.addAreClicked = true;
  }

  closeModal() {
      this
          .dialogRef
          .close();
      this.dialogRef = null;
  }

  onSubmit() {
    this.prepareSubDepartment.areaIds = [];
    this.prepareSubDepartment.departmentName=this.prepareSubDepartment.deptnameMultiLingual.map.en;
    this
      .selectedAreas
      .forEach((ele, index) => {
        this
          .prepareSubDepartment
          .areaIds
          .push(ele.id);
      })
    if (this.mode == 'new') {
      this
        .subDepartmentService
        .createUpdateSubDepartment(`/rsb-oms/oms/dept/createDept?Accept-Language=`+this.appService.currentLang, this.prepareSubDepartment)
        .subscribe((data) => {
          this
            .dialogRef
            .close(true);
        }, (error) => {
          // this
          //   .snackBar
          //   .open("Error Occured on creating Sub Department", '', { duration: 1000 });
        })
    } else {
      this
        .subDepartmentService
        .createUpdateSubDepartment(`/rsb-oms/oms/dept/updateDept?Accept-Language=`+this.appService.currentLang, this.prepareSubDepartment)
        .subscribe((data) => {
          this
            .dialogRef
            .close(true);
        }, (error) => {
          // this
          //   .snackBar
          //   .open("Error Occured on creating Sub Department", '', { duration: 1000 });
        })
    }
  }

  selectArea(area) {
    if (!$('#area_' + area.id).hasClass('activeChip')) {
      $('#area_' + area.id).addClass('activeChip');
    } else {
      $('#area_' + area.id).removeClass('activeChip');
    }
  }

  removeArea(areaToRemove) {
    this
      .selectedAreas
      .forEach((element, key) => {
        if (element.id === areaToRemove.id) {
          this
            .selectedAreas
            .splice(key, 1);
        }
      });
  }

  isAreaChoosen(areaId) {
    let areaSelected: boolean = false;
    this
      .selectedAreas
      .forEach(element => {
        if (element.id === areaId && areaSelected === false) {
          areaSelected = true;
        }
      });
    return areaSelected;
  }

  pushSelectedAreasToPrepareDept() {
    this.departmentAreas.forEach((area) => {
      let areaSelected = this.isAreaChoosen(area.id);
      if (!areaSelected && $('#area_' + area.id).hasClass('activeChip')) {
        this.selectedAreas.push(area);
      }
    });

    let self = this;
    if (this.departmentAreas.length > 0 && !$('.chips i.select-icon').hasClass('activeChip')) {
      this.showErrorMessage = true;
      setTimeout(function () {
        self.showErrorMessage = false;
      }, 3000);
    }
  }

  selectAllAvailableAreas() {

    if (this.selectAllActive) {
      this.selectAllActive = false;
    } else {
      this.selectAllActive = true;
    }

    this.departmentAreas.forEach((element, index) => {
      if (this.selectAllActive) {
        $('#area_' + element.id).addClass('activeChip');
      } else {
        $('#area_' + element.id).removeClass('activeChip');
      }
    });
  }
}
