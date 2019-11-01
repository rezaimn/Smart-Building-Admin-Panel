import { SecurityService } from './../../security/security.service';
//import { LayoutComponent } from './../../../../common/layout/layout.component';
//import { SecurityService } from './../security.service';
import { Security } from 'app/rsb-modules/ssms/security/security';



import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionStorage, SessionStorageService, LocalStorageService } from 'ngx-webstorage';
import { ConfirmModalComponent } from '../../../../common';
//import {LayoutComponent} from '../../../../common';
import { DevicePointComponent } from '../../../../utils';
import { MasterDataService, EavWrapperService, SvgService } from '../../../../utils';
import { AppService } from '../../../../app.service';
import { CheckComponentList } from '../check/check.component';
import {TranslateService} from '@ngx-translate/core';
//import { CheckComponent } from 'app/rsb-modules/ssms/security/check/check.component';





@Component({
  selector: 'app-patrol',
  templateUrl: './patrol.component.html',
  styleUrls: ['./patrol.component.scss']
})
export class PatrolComponentList implements OnInit {

  public checkLists: any[];
  public checks: any = [];
  public campusDropdownList: any[];
  public subDropdownList: any[];
  
  public buildingDropdownList: any[];
  public floorDropdownList: any[];
  public selectedCampusId: any = 0;
  public selectedBuildingId: any = 0;
  public selectedFloorId: any = 0;
  public fileExist: boolean = false;

  public firstpage : any = 1;

  public circleSubsidiary : boolean = true;
  public circleCampus: boolean = false;
  public circleBuilding: boolean = false;
  public circleFloor: boolean = false;
  public circleList: boolean = false;

 
  



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

  @SessionStorage('subsidiary')
  public subsidiary;


  
  @SessionStorage('addCheckCount')
  public addCheckCount;

  public subsidiaryId : any;


  constructor(public dialog: MatDialog,
    public appService: AppService,
    public masterDataService: MasterDataService,
    public eavWrapperService: EavWrapperService,
    public translate:TranslateService,
    private sanitizer: DomSanitizer,
    private storage: LocalStorageService,
    public svgService: SvgService,
    public activatedRoute: Router,
    public securityService: SecurityService,
    public sessionStorageService: SessionStorageService
  ) { }

  ngOnInit() {
    
    this.getAllSub();
    //this.getAllCampus();
    this.sendHeaderWithLogo();
    this.addCheckCount = 0;
    this.updateBreadCrums();
    
  }

  ngAfterViewInit() {
  
  }
  deleteVisitorAccess(staff) {
    let deleteUrl = '/SSMS/DeleteCheckList?id='+staff.id;

 
  }

  editCheck(prepareDeviceData){
   
    
    $('.page-wrapper').addClass('blur-bg');
    let dialogRef = this
      .dialog
      .open(CheckComponentList, {
        width: '768px',
        height: 'auto',
        data: prepareDeviceData
      });
    dialogRef
      .afterClosed()
      .subscribe(result => {

        $('.page-wrapper').removeClass('blur-bg');
        this
          .storage
          .store('addClicked', false);
        if (result) {
          
          this.addCheckCount = 0;
        } else {
          this.addCheckCount = 0;
        }
      });
  }

 
  getAllSub() {
    this.subDropdownList = [];
    this
      .masterDataService
      .getCampusDropdownListPe(`/Common/GetSubsidiaries?organizationid=1`)
      .subscribe(res => {
        if (res.status === 200) {
          
          this.subDropdownList = JSON.parse(res._body);
          this.circleSubsidiary = true;
          this.circleFloor = false;
          this.circleCampus = false;
          this.circleBuilding = false;
          this.circleCampus = false;
          this.circleList = false;
        }
      }, (error: any) => {
          this.translate.get('error-messages.sub-department-no-data',this.appService.currentLang).subscribe(
              (subHeaderT)=> {
                  this.appService.showFail(subHeaderT);
              }
          )
      });
  }

  getAllCampusTitle(){
    this.getAllCampus(this.subsidiaryId); 
  }
  
  
  getAllCampus(event:any) {
    this.subsidiaryId = event;
   // this.subsidiary.id = event;
    this.storage.store('subsidiaryId', event);
    
    this.campusDropdownList = [];
    this
      .masterDataService
      .getCampusDropdownListPe(`/Common/GetCampuses?subsidiaryid=` + event+ `&Accept_Language=` + this.appService.currentLang)
      .subscribe(res => {
        if (res.status === 200) {
          
          this.campusDropdownList = JSON.parse(res._body);
          this.circleSubsidiary = false;
          this.circleFloor = false;
          this.circleCampus = false;
          this.circleBuilding = false;
          this.circleCampus = true;
          this.circleList = false;
    
        }
      }, (error: any) => {
          this.translate.get('error-messages.campus-no-data',this.appService.currentLang).subscribe(
              (subHeaderT)=> {
                  this.appService.showFail(subHeaderT);
              }
          )
      });
  }

  // On change campus trigger building

 

  getAllBuildings(event) {
  //  this.selectedBuildingId = event

    if (this.selectedCampusId === 0) {
      return;
    }
    this.buildingDropdownList = [];
    this
      .masterDataService
      .getCampusDropdownListPe(`/Common/GetBuildings?campusid=` + this.selectedCampusId+ `&Accept_Language=` + this.appService.currentLang)
      .subscribe(res => {
        if (res.status === 200) {
          
          this.buildingDropdownList = JSON.parse(res._body);
        }
      }, (error: any) => {
          this.translate.get('error-messages.building-no-data',this.appService.currentLang).subscribe(
              (subHeaderT)=> {
                  this.appService.showFail(subHeaderT);
              }
          )
      });
  }

  getAllBuildingsNewTitle(){
    this.getAllBuildingsNew(this.selectedCampusId);
  }

  getAllBuildingsNew(event: any) {

    // if (this.selectedCampusId === 0) {
    //   return;
    // }
    this.selectedCampusId = event;
    this.buildingDropdownList = [];
    this
      .masterDataService
      .getCampusDropdownListPe(`/Common/GetBuildings?campusid=` + event+ `&Accept_Language=` + this.appService.currentLang)
      .subscribe(res => {

        if (res.status === 200) {
            console.log(JSON.parse(res._body));
          this.buildingDropdownList = JSON.parse(res._body);
          this.circleSubsidiary = false;
          this.circleFloor = false;
          this.circleCampus = false;
          this.circleBuilding = true;
          this.circleList = false;
          console.log(this.buildingDropdownList);
        }
      }, (error: any) => {
          this.translate.get('error-messages.building-no-data',this.appService.currentLang).subscribe(
              (subHeaderT)=> {
                  this.appService.showFail(subHeaderT);
              }
          )
      });
  }


  getAllFloors() {

    if (this.selectedBuildingId === 0) {
      return;
    }
    this.floorDropdownList = [];
    this
      .masterDataService
      .getCampusDropdownListPe(`/Common/GetFloors?buildingid=`+ this.selectedBuildingId+`&Accept_Language=` + this.appService.currentLang)
      .subscribe(res => {
        if (res.status === 200) {
          
          this.floorDropdownList = JSON.parse(res._body);
        }
      }, (error: any) => {
          this.translate.get('error-messages.floor-no-data',this.appService.currentLang).subscribe(
              (subHeaderT)=> {
                  this.appService.showFail(subHeaderT);
              }
          )
      });
  }

  getAllFloorsNewTitle(){
    this.getAllFloorsNew( this.selectedBuildingId );
  }

  getAllFloorsNew(build: any) {

    // if (this.selectedBuildingId === 0) {
    //   return;
    // }
    this.selectedBuildingId = build;
    this.floorDropdownList = [];
    this
      .masterDataService
      .getCampusDropdownListPe(`/Common/GetFloors?buildingid=`+ build+`&Accept_Language=` + this.appService.currentLang)
      .subscribe(res => {
        if (res.status === 200) {
          
          this.floorDropdownList = JSON.parse(res._body);
          this.circleSubsidiary = false;
          this.circleFloor = true;
          this.circleBuilding = false;
          this.circleCampus = false;
          this.circleList = false;
        }
      }, (error: any) => {
          this.translate.get('error-messages.floor-no-data',this.appService.currentLang).subscribe(
              (subHeaderT)=> {
                  this.appService.showFail(subHeaderT);
              }
          )
      });
  }

  previouspage(){
    if(this.firstpage > 1){
      this.firstpage = this.firstpage - 1;
      this.getCheckLists();
    }
  }

  nextpage(){
    if(this.firstpage >= 1){
      this.firstpage = this.firstpage + 1;
      this.getCheckLists();
    }
  }
  getCheckListsNew(floor: any){
  //  this.selectedFloorId = floor;
      console.log(floor);
    this.checkLists = [];
    let obj = {
      "floorid": floor
    } 
   // alert(floor);
  
  this.securityService.getCheckListNew('/SSMS/GetCheckListByFloor', obj,this.firstpage)
  .subscribe(res => {
    if (res.status === 200) {
      // console.log("11111111111111111111111111",res);
      // console.log(res._body);
      this.circleSubsidiary = false;
      this.circleCampus = false;
      this.circleBuilding = false;
      this.circleFloor = false;
      this.circleList = true;
      this.checks = JSON.parse(res._body).records;
      
    
     }
   }, (error: any) => {
      this.translate.get('error-messages.no-checklist-avail',this.appService.currentLang).subscribe(
          (subHeaderT)=> {
              this.appService.showFail(subHeaderT);
          }
      )
      });
  }
  

  getCheckLists() {
    this.checkLists = [];
    let obj = {
      "floorid": this.selectedFloorId
    } 
  
  this.securityService.getCheckList('/SSMS/GetCheckListByFloor', obj,this.firstpage)
  .subscribe(res => {
    if (res.status === 200) {
      console.log(res);
      console.log(res._body);
      this.checks = JSON.parse(res._body);
    
     }
   }, (error: any) => {
      this.translate.get('error-messages.no-checklist-avail',this.appService.currentLang).subscribe(
          (subHeaderT)=> {
              this.appService.showFail(subHeaderT);
          }
      )
      });
  }

  // sendHeader(): void {
  //   // Send message to subscribers via observable subject
  //   if (this.subsidiary !== null) {
  //     this
  //       .appService
  //       .sendHeader(this.subsidiary.name, 'security patrol management', 'manage security patrol', 'add check list');
  //   }
  // }
  sendHeaderWithLogo(): void {
    // Send message to subscribers via observable subject
    if (this.subsidiary !== null) {
      this
        .appService
        .sendHeaderWithLogo(this.subsidiary.name, 'security patrol management', 'manage security patrol', '','../../../../../assets/images/dashboard/SMART-SECURITY-SYSTEM.png');
    }
  }
  updateBreadCrums() {
    this.appService.updateBreadCrums('SSMS-VIEW');
  }

  

}

