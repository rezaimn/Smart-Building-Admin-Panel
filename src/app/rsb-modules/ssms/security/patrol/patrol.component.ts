//import { LayoutComponent } from './../../../../common/layout/layout.component';
import { SecurityService } from './../security.service';
import { Security } from 'app/rsb-modules/ssms/security/security';



import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionStorage, SessionStorageService, LocalStorageService } from 'ngx-webstorage';
import { ConfirmModalComponent } from '../../../../common';
import {LayoutComponent} from '../../../../common';
import { DevicePointComponent } from '../../../../utils';
import { MasterDataService, EavWrapperService, SvgService } from '../../../../utils';
import { AppService } from '../../../../app.service';
import { CheckComponent } from 'app/rsb-modules/ssms/security/check/check.component';
import {PaginationService} from '../../../../pagination-service';
import {TranslateService} from '@ngx-translate/core';





@Component({
  selector: 'app-patrol',
  templateUrl: './patrol.component.html',
  styleUrls: ['./patrol.component.scss']
})
export class PatrolComponent implements OnInit {

  public checkLists: any[];
  public checks: any = [];
  public campusDropdownList: any[];
  public buildingDropdownList: any[];
  public floorDropdownList: any[];
  public selectedCampusId: any = 0;
  public selectedBuildingId: any = 0;
  public selectedFloorId: any = 0;
  public fileExist: boolean = false;

  public firstpage : any = 1;

  public filess : boolean = false;


    public page : number = 1;
    public perPage: number=5;
    public totalRecordsCount:number=0;
    public totalPages:number=0;


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


  constructor(public dialog: MatDialog,
    public appService: AppService,
    public masterDataService: MasterDataService,
    public eavWrapperService: EavWrapperService,
    public layoutComponent: LayoutComponent,
    private sanitizer: DomSanitizer,
    private storage: LocalStorageService,
    public svgService: SvgService,
    public activatedRoute: Router,
    public securityService: SecurityService,
    public sessionStorageService: SessionStorageService,
    public paginationService:PaginationService,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.getAllCampus();
    this.sendHeaderWithLogo();
    this.addCheckCount = 0;
    this.updateBreadCrums();
    this.storage.observe('addClicked').subscribe((clickedRes) => {
      if (clickedRes && (this.addCheckCount === 0 || this.addCheckCount === null) && this.activatedRoute.url === '/rsb-modules/ssms/security/security-list/view-all') {
        if (this.addCheckCount === null) {
          this.addCheckCount = 0;
        } else {
          this.addCheckCount++;
        }
        let prepareDeviceData = {
          'message': 'new',
          'index': 1
        };

        $('.page-wrapper').addClass('blur-bg');
        let dialogRef = this
          .dialog
          .open(CheckComponent, {
            width: '768px',
            height: 'auto',
           
          });
        dialogRef
          .afterClosed()
          .subscribe(result => {

            $('.page-wrapper').removeClass('blur-bg');
            this
              .storage
              .store('addClicked', false);
            if (result) {
              console.log("+++++++++++++++++++++++++++=");
              this.addCheckCount = 0;
            } else {
                console.log("___________________________");
              this.addCheckCount = 0;
            }
          });
      }
    });
      this.appService.currentLangEmit.subscribe(
          (res: any) => {
              this.sendHeaderWithLogo();
          }
      )
  }

  ngAfterViewInit() {
  
  }
  deleteVisitorAccess(staff) {
    let deleteUrl = '/SSMS/DeleteCheckList?id='+staff.id;

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
        //this.page = 0;
        this.getCheckLists();
       // this.localStorageService.store('addClicked', false);
      });
  }

  editCheck(prepareDeviceData){
   

    $('.page-wrapper').addClass('blur-bg');
    let dialogRef = this
      .dialog
      .open(CheckComponent, {
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

 
  
  
  getAllCampus() {
    this.campusDropdownList = [];
    this
      .masterDataService
      .getCampusDropdownListPe(`/Common/GetCampuses?subsidiaryid=` + this.subsidiary.id+`&Accept_Language=` + this.appService.currentLang)
      .subscribe(res => {
        if (res.status === 200) {
          
          this.campusDropdownList = JSON.parse(res._body);
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

    if (this.selectedCampusId === 0) {
      return;
    }
    this.buildingDropdownList = [];
    this
      .masterDataService
      .getCampusDropdownListPe(`/Common/GetBuildings?campusid=` + this.selectedCampusId+`&Accept_Language=` + this.appService.currentLang)
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

  getAllFloors() {

    if (this.selectedBuildingId === 0) {
      return;
    }
    this.floorDropdownList = [];
    this
      .masterDataService
      .getCampusDropdownListPe(`/Common/GetFloors?buildingid=`+ this.selectedBuildingId +`&Accept_Language=` + this.appService.currentLang)
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


  getCheckLists() {
    this.filess = true;
    this.checkLists = [];
    let obj = {
      "floorid": this.selectedFloorId
    } 
  
  this.securityService.getCheckList('/SSMS/GetCheckListByFloor', obj,this.page)
  .subscribe(res => {
    if (res.status === 200) {

        let items = JSON.parse(res._body);
        this.checks=items.records;
        this.totalRecordsCount = items.totalrecords;

        var x = this.totalRecordsCount % this.perPage;
        var y = this.totalRecordsCount - x;
        if(x == 0){
            this.totalPages = y / this.perPage ;
        } else {
            this.totalPages = y / this.perPage + 1;
        }

    
     }
   }, (error: any) => {
      this.translate.get('error-messages.check-list-update-success',this.appService.currentLang).subscribe(
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
  // sendHeaderWithLogo(): void {
  //   // Send message to subscribers via observable subject
  //   if (this.subsidiary !== null) {
  //     this
  //       .appService
  //       .sendHeaderWithLogo(this.subsidiary.name, 'security patrol management', 'manage security patrol', 'add check list','../../../../../assets/images/dashboard/SMART-SECURITY-SYSTEM.png');
  //   }
  // }

    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        let subHeader = '';
        let pageDetails = '';
        let subsidiaryName: '';
        let routeName='';
        if (this.appService.currentLang == 'en') {
            subsidiaryName = this.subsidiary.name.map.en;
        }
        if (this.appService.currentLang == 'fa') {
            subsidiaryName = this.subsidiary.name.map.fa;
        }
        this.translate.get('sub-header.manage-security-patrol', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.security-patrol-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;
                                this.translate.get('route-name.add-check-list', this.appService.currentLang).subscribe(
                                    (routeNameT) => {
                                        routeName=routeNameT;
                                        this
                                            .appService
                                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/SMART-SECURITY-SYSTEM.png');
                                    }
                                )
                    }
                );
            }
        );
    }


  updateBreadCrums() {
    this.appService.updateBreadCrums('SSMS-VIEW');
  }


    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.getCheckLists();
    }

}

