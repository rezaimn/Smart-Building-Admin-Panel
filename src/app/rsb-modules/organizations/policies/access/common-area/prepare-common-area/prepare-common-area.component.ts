import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../../../app.service';
import { PagerComponent } from '../../../pager/pager.component';
import { PoliciesService } from '../../../policies.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MasterDataService, EavWrapperService } from '../../../../../../utils';
import { SessionStorage } from 'ngx-webstorage';
import { ManageArea } from '../common-area';
import { AccessService } from '../../access.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-prepare-common-area',
  templateUrl: './prepare-common-area.component.html',
  styleUrls: ['./prepare-common-area.component.scss']
})
export class PrepareCommonAreaComponent implements OnInit {

  @SessionStorage('designation')
  public designation;

  @SessionStorage('subdiaryId')
  public subdiaryId;
  public campusDropdownList: Array<ManageArea> = [];
  public buildingDropdownList: Array<ManageArea> = [];
  public floorDropdownList: Array<ManageArea> = [];
  public areaDropdownList: Array<ManageArea> = [];
  public tempAreaDropdownList: Array<any> = [];
  public selectedCampusId: any = 0;
  public selectedBuildingId: any = 0;
  public selectedFloorId: any = 0;
  public scrollbarOptions = {
    axis: 'y',
    theme: 'minimal-dark',
    mouseWheel: {
      enable: true
    },
    contentTouchScroll: 200,
    scrollInertia: 0,
    mouseWheelPixels: 100
  };
  public selectedAreaList: Array<any> = [];
  public selectedAreas: any = [];
  public selectedAreaId: any = [];
  public showErrorMessage: boolean = false;
  public selectAllActive: boolean = false;
  constructor(
    public masterDataService: MasterDataService,
    public eavWrapperService: EavWrapperService,
    private appService: AppService,
    private pagerComponent: PagerComponent,
    private policiesService: PoliciesService,
    private accessService:AccessService,
    public translate:TranslateService
  ) {
    this.pagerComponent.changeState('pager', true, '', '');
    this.pagerComponent.changeState('create', false, '', '');
    this.pagerComponent.changeState('close', true, '', '');
    this.pagerComponent.changeState('edit', false, '', '');
    this.pagerComponent.changeState('step', false, '', '');
  }

  ngOnInit() {
    this.sendHeader();
    // this.getGradesAvailable();
    this.updateBreadCrums();
    this.getAllCampus();
  }
  sendHeader(): void {
    // send message to subscribers via observable subject
    if (this.designation) {
      this.appService
        .sendHeader(this.designation.designation, 'common area access Policy', 'common area access Policy', '');
    }
  }
  updateBreadCrums() {
    this
      .appService
      .updateBreadCrums('common area');
  }
  getAllAreas(event) {
    if (this.selectedFloorId == 0) {
      this.areaDropdownList = [];
      this.tempAreaDropdownList = [];
      return;
    }
    this.areaDropdownList = [];
    this.masterDataService.getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedFloorId.id)
      .subscribe(res => {
        const allAreaList = JSON.parse(res._body);
        allAreaList.forEach(area => {
          const areaJson = this.eavWrapperService.eavToJson(area, 'AREA');
          if (areaJson !== null) {
            this.areaDropdownList.push(areaJson);
            this.tempAreaDropdownList = this.areaDropdownList;
          }
        });
      }, (error: any) => {
        // this.snackBar.open('Error occured while retriving area list', 'Ok', {
        //   duration: 5000,
        //   extraClasses: ['error-snackbar']
        // });
      });
  }

  getAllBuildings(event) {
    if (this.selectedCampusId == 0) {
      this.selectedBuildingId = 0;
      this.selectedFloorId = 0;
      this.areaDropdownList = [];
      this.tempAreaDropdownList = [];
      this.buildingDropdownList = [];
      this.floorDropdownList = [];
      return;
    }
    this.buildingDropdownList = [];
    this
      .masterDataService
      .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedCampusId)
      .subscribe(res => {
        const allBuildingList = JSON.parse(res._body);
        allBuildingList.forEach(building => {
          const buildingJson = this.eavWrapperService.eavToJson(building, 'STRUCTURE');
          if (buildingJson !== null) {
            this.buildingDropdownList.push(buildingJson);
          }
        });
      }, (error: any) => {
        // this
        //   .snackBar
        //   .open('Error occured while retriving area list', 'Ok', {
        //     duration: 5000,
        //     extraClasses: ['error-snackbar']
        //   });
      });
  }

  getAllCampus() {
    this.campusDropdownList = [];
    this.masterDataService.getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.subdiaryId)
      .subscribe(res => {
        const allCampusList = JSON.parse(res._body);
        allCampusList.forEach(campus => {
          const campusJson = this.eavWrapperService.eavToJson(campus, 'CAMPUS');
          if (campusJson !== null) {
            this.campusDropdownList.push(campusJson);
          }
        });
      }, (error: any) => {
        // this
        //   .snackBar
        //   .open('Error occured while retriving area list', 'Ok', {
        //     duration: 5000,
        //     extraClasses: ['error-snackbar']
        //   });
      });
  }

  getAllFloors(event) {
    if (this.selectedBuildingId == 0) {
      this.selectedFloorId = 0;
      this.areaDropdownList = [];
      this.tempAreaDropdownList = [];
      this.floorDropdownList = [];
      return;
    }
    this.floorDropdownList = [];
    this
      .masterDataService
      .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedBuildingId)
      .subscribe(res => {
        const allFloorList = JSON.parse(res._body);
        allFloorList.forEach(floor => {
          const floorJson = this.eavWrapperService.eavToJson(floor, 'LEVEL');
          if (floorJson !== null) {
            this.floorDropdownList.push(floorJson);
          }
        });
      }, (error: any) => {
        // this
        //   .snackBar
        //   .open('Error occured while retriving area list', 'Ok', {
        //     duration: 5000,
        //     extraClasses: ['error-snackbar']
        //   });
      });
  }
  selectArea(event, selectedAreaIndex, area) {
    $(event.currentTarget.children).toggleClass('activeChip');
    if (!$(event.currentTarget.children).hasClass('activeChip')) {
      delete this.selectedAreaList[selectedAreaIndex];
    } else {
      this.selectedAreaList[selectedAreaIndex] = area;
    }
  }

  selectAllAvailableAreas() {
    if (this.selectAllActive) {
      this.selectAllActive = false;
    } else {
      this.selectAllActive = true;
    }

    this.tempAreaDropdownList.forEach((element, index) => {
      if (this.selectAllActive) {
        this.selectedAreaList[index] = element;
        $('#area_' + element.id).addClass('activeChip');
      } else {
        delete this.selectedAreaList[index];
        $('#area_' + element.id).removeClass('activeChip');
      }
    });
  }
  
  cancelZone() {
    //this.localStorageService.store('addClicked', false);
   // this.manageZoneComponent.getZone();
  }
  isAreaChoosen(areaId) {
    let areaSelected: boolean = false;
    this.selectedAreas.forEach(element => {
      if (element.id === areaId && areaSelected === false) {
        areaSelected = true;
      }
    });
    return areaSelected;
  }

  pushSelectedAreas() {
    let self = this;
    if (this.tempAreaDropdownList.length > 0 && !$('.chips i.select-icon').hasClass('activeChip')) {
      this.showErrorMessage = true;
      setTimeout(function () {
        self.showErrorMessage = false;
      }, 3000);
    }
    this.passSelectedAreaData(this.selectedAreaList);
  }

  passSelectedAreaData(event) {
    Object.keys(event).forEach((key) => {
      let areaSelected = this.isAreaChoosen(event[key].id);
      if (!areaSelected) {
        let value = event[key];
        if (value.name === undefined) {
          event[key].name = event[key].areaName;
          event[key].code = event[key].areaCode;
        }
        this.selectedAreas.push(event[key]);
        //this.prepareZone.areaIds.push(event[key].id);
      }
    });
  }

  removeGrades(event, selectedGradeIndex, area) {
    this.selectedAreas.splice(selectedGradeIndex, 1);
    //this.prepareZone.areaIds.splice(selectedGradeIndex, 1);
  }

  onSubmit() {    
    let url;
    this.accessService.createUpdateZone(url, '')
      .subscribe(res => {
        // this.snackBar.open('Successfully updated the Common area list', 'Ok', {
        //   duration: 5000,
        //   extraClasses: ['success-snackbar']
        // });
      }, (error: any) => {
        // this.snackBar.open('Error occured', 'Ok', {
        //   duration: 5000,
        //   extraClasses: ['error-snackbar']
        // });
      });
  }
}
