import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MasterDataService} from '../../services/master-data.service';
import {EavWrapperService} from '../../services/eav-wrapper.service';
import {FilterArea} from './filter-area';
import {SessionStorage} from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../../app.service';

@Component({selector: 'app-filter-area', templateUrl: './filter-area.component.html', styleUrls: ['./filter-area.component.scss']})
export class FilterAreaComponent implements OnInit {
  
  @Input() public filterFlag;

  @SessionStorage('subdiaryId')
  public subdiaryId;
  
  @Output() passSelectedAreaData: EventEmitter<any> = new EventEmitter();

  public selectAllActive: boolean = false;

  public campusDropdownList: Array<FilterArea> = [];
  public buildingDropdownList: Array<FilterArea> = [];
  public floorDropdownList: Array<FilterArea> = [];
  public areaDropdownList: Array<FilterArea> = [];

  public selectedCampusId: any = 0;
  public selectedBuildingId: any = 0;
  public selectedFloorId: any = 0;
  public selectedAreaList: any = {};
  public selectedAreas: any;
  public tempAreaDropdownList: any = [];

  public showErrorMessage: boolean = false;

  constructor(public appService:AppService, public translate:TranslateService,public masterDataService: MasterDataService, private eavWrapperService: EavWrapperService) { }


  ngOnInit() {
    // Call the service here to load the campus for particular subsidiary
    this.getAllCampus();
  }

  getAllCampus() {
    this.campusDropdownList = [];

    this
      .masterDataService
      .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.subdiaryId)
      .subscribe(res => {
        const allCampusList = JSON.parse(res._body);
        allCampusList.forEach(campus => {
          const campusJson = this
            .eavWrapperService
            .eavToJson(campus, 'CAMPUS');
          if (campusJson !== null) {
            this
              .campusDropdownList
              .push(campusJson);
          }
        });
      }, (error : any) => {

      });
  }

  // On change campus trigger building
  getAllBuildings(event) {

    if (this.selectedCampusId === 0) {
      return;
    }

    // Clearing the Values in the Building dropdown
    this.selectedBuildingId = 0;
    this.buildingDropdownList = [];

    // Clearing the Values in the Floor dropdown
    this.selectedFloorId = 0;
    this.floorDropdownList = [];

    // Clearing the Values in the Areas view
    this.areaDropdownList = [];
    this.tempAreaDropdownList = [];
    this.selectedAreaList = {};

    this
      .masterDataService
      .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedCampusId)
      .subscribe(res => {
        const allBuildingList = JSON.parse(res._body);
        allBuildingList.forEach(building => {
          const buildingJson = this
            .eavWrapperService
            .eavToJson(building, 'STRUCTURE');
          if (buildingJson !== null) {
            this
              .buildingDropdownList
              .push(buildingJson);
          }
        });
      }, (error : any) => {

      });
  }

  getAllFloors(event) {

    if (this.selectedBuildingId === 0) {
      return;
    }

    // Clearing the Values in the Floor dropdown
    this.selectedFloorId = 0;
    this.floorDropdownList = [];

    // Clearing the Values in the Areas view
    this.areaDropdownList = [];
    this.tempAreaDropdownList = [];
    this.selectedAreaList = {};

    this
      .masterDataService
      .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedBuildingId)
      .subscribe(res => {
        const allFloorList = JSON.parse(res._body);
        allFloorList.forEach(floor => {
          const floorJson = this
            .eavWrapperService
            .eavToJson(floor, 'LEVEL');
          if (floorJson !== null) {
            this
              .floorDropdownList
              .push(floorJson);
          }
        });
      }, (error : any) => {

      });
  }

  getAllAreas(event) {
    if (this.selectedFloorId === 0) {
      return;
    }
    this.areaDropdownList = [];
    this.tempAreaDropdownList = [];
    this.selectedAreaList = {};
    this
      .masterDataService
      .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedFloorId)
      .subscribe(res => {
        const allAreaList = JSON.parse(res._body);

        allAreaList.forEach(area => {
          const areaJson = this
            .eavWrapperService
            .eavToJson(area, 'AREA');
          if (areaJson !== null) {
            areaJson.areaNameMultiLingual=areaJson.name;
            this
              .areaDropdownList
              .push(areaJson);
            this.tempAreaDropdownList = this.areaDropdownList;
          }
        });
          console.log("alllllllllllllllll",this.tempAreaDropdownList);
      }, (error : any) => {});
  }

  // Add selected class on click of chips
  selectAreas(event, selectedAreas, area) {
    $(event.currentTarget.children).toggleClass('activeChip');
    if (!$(event.currentTarget.children).hasClass('activeChip')) {
      delete this.selectedAreaList[selectedAreas];
    } else {
      this.selectedAreaList[selectedAreas] = area;
    }
  }

  // add active class to all available area's
  selectAllAvailableAreas() {
    if (this.selectAllActive) {
      this.selectAllActive = false;
    } else {
      this.selectAllActive = true;
    }

    this.tempAreaDropdownList.forEach((element, index) => {

      if(this.selectAllActive) {
        //Add the element
        this.selectedAreaList[index] = element;
        $('#area_' + element.id).addClass('activeChip');
      } else if (!this.selectAllActive) {
        //Remove element
        delete this.selectedAreaList[index];
        $('#area_' + element.id).removeClass('activeChip');
      }
      // if (!$('#area_' + element.id).hasClass('activeChip')) {
      //   this.selectedAreaList[index] = element;
      //   $('#area_' + element.id).addClass('activeChip');
      // } else {
      //   $('#area_' + element.id).removeClass('activeChip');
      //   delete this.selectedAreaList[index];
      // }
    });
  }

  // Collecting all the selected areas
  pushSelectedAreasToPrepareDept() {
    this.selectedAreas = this.selectedAreaList;
    if (this.selectedAreas !== null) {
      this
        .passSelectedAreaData
        .emit(this.selectedAreas);
    }
    let self = this;
    if (this.tempAreaDropdownList.length > 0 && !$('.chips i.select-icon').hasClass('activeChip')) {
      this.showErrorMessage = true;
      setTimeout(function () {
        self.showErrorMessage = false;
      }, 3000);
    }

    Object
      .keys(this.selectedAreas)
      .forEach((element, index) => {
        if (!$('.chips i.select-icon').hasClass('activeChip')) {
          this
            .tempAreaDropdownList
            .splice(index, 1);
        }
      });
  }
}