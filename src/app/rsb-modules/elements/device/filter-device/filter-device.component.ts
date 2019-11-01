import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionStorage, LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { LayoutComponent, ConfirmModalComponent } from '../../../../common';
import { PrepareDeviceComponent } from '../prepare-device/prepare-device.component'
import { DeleteDeviceComponent } from '../delete-device/delete-device.component'
import { AppService } from '../../../../app.service';
import { DeviceService } from '../device.service';
import { MasterDataService } from '../../../../utils';
import { FilterComponent } from '../device';
import { log } from 'util';
import {TranslateService} from '@ngx-translate/core';
import {ErrorTableComponent} from '../error-table/error-table.component';

@Component({ selector: 'app-filter-device', templateUrl: './filter-device.component.html', styleUrls: ['./filter-device.component.scss'] })
export class FilterDeviceComponent implements OnInit {
  public addClicked = false; // Flag for add/edit to manage navigation
  tooltipPosition = 'above';
  public subDeviceList: Array<any> = [];
  public brandList: Array<any> = [];
  public modelList: Array<any> = [];
  public deviceList: Array<any> = [];
  public manageDevice = new FilterComponent({});
  public notInUse: boolean = true;
  public inUse: boolean = true;
  public good: boolean = true;
  public faulty: boolean = true;
  public deviceSearchList: Array<any> = [];
  public deleteDeviceList = { "ids": [] };
  public executeClicked: boolean = false;
  public noDelete: boolean = false;
  public totalpage:number;
  @SessionStorage('subsidiary')
  public subsidiary;
  @SessionStorage('filterData')
  public filter;
  @SessionStorage('subdiaryId')
  public subdiaryId;
  @SessionStorage('filterdata')
  public filterData;
  @SessionStorage('DeviceLength')
  public deviceLength;

  @SessionStorage('prepareDeviceOpenCount')
  public prepareDeviceOpenCount;

  constructor(
    public dialog: MatDialog,
    public appService: AppService,
    public masterDataService: MasterDataService,
    public layoutComponent: LayoutComponent,
    private storage: LocalStorageService,
    public activatedRoute: Router,
    public deviceService: DeviceService,
    public translate:TranslateService
  ) { 
    // this.manageDevice = new FilterComponent({});
    // this.manageDevice.deviceTypeId = 0;
    // this.manageDevice.subDeviceTypeId = 0;
    // this.manageDevice.modelId = 0;
    // this.manageDevice.brandId = 0;
  }

  // sendHeader(): void {
  //   // Send message to subscribers via observable subject
  //   if (this.subsidiary !== null) {
  //     this
  //       .appService
  //       .sendHeader(this.subsidiary.name, 'element management', 'manage device', 'add device');
  //   }
  // }

    /**
     @Desc set header logo
     @Param
     @return
     */
  sendHeaderWithLogo(): void {
    // Send message to subscribers via observable subject
    if (this.subsidiary !== null) {
        let subHeader = '';
        let pageDetails = '';
        let subsidiaryName: '';
        if (this.appService.currentLang == 'en') {
            subsidiaryName = this.subsidiary.name.map.en;
        }
        if (this.appService.currentLang == 'fa') {
            subsidiaryName = this.subsidiary.name.map.fa;
        }
        let routeName='';
        this.translate.get('sub-header.element-management', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.manage-device', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;

                                this.translate.get('route-name.add-device', this.appService.currentLang).subscribe(
                                    (routeNameT) => {
                                        routeName=routeNameT;
                                        this
                                            .appService
                                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/INDOOR-SURVEILLANCE-SYSTEM.png');
                                    }
                                )

                    }
                );
            }
        );
    }
  }
  renderFilter() {
    if (this.filterData) {
      this.manageDevice = this.filterData;
      if (this.filterData.deviceTypeId != null) {
        this.getSubDevice(this.filterData.deviceTypeId);
        this.getBrand(this.filterData.subDeviceTypeId);
        this.getModel(this.filterData.subDeviceTypeId);
      }
    }
  }
  ngOnInit() {


      this.appService.currentLangEmit.subscribe(
          (res: any) => {
              this.sendHeaderWithLogo();
          }
      );
     console.log(this.manageDevice);
    this.getDeviceType();
    // this.getDeviceList();
    this.updateBreadCrums();
    this.prepareDeviceOpenCount = 0;
    this.sendHeaderWithLogo();
  //  this.renderFilter();
    this
      .storage
      .observe('addClicked')
      .subscribe((clickedRes) => {
        if (clickedRes && (this.prepareDeviceOpenCount === 0 || this.prepareDeviceOpenCount === null) && this.activatedRoute.url === '/rsb-modules/elements/device/ems-devices/filter') {
          if (this.prepareDeviceOpenCount === null) {
            this.prepareDeviceOpenCount = 0;
          } else {
            this.prepareDeviceOpenCount++;
          }
          let prepareDeviceData = {
            'message': 'new',
            'index': 1
          };

          $('.page-wrapper').addClass('blur-bg');
          let dialogRef = this
            .dialog
            .open(PrepareDeviceComponent, {
              width: '768px',
              height: 'auto',
              data: prepareDeviceData
            });
          dialogRef
            .afterClosed()
            .subscribe(errorData => {
              $('.page-wrapper').removeClass('blur-bg');

                  if (errorData!=null) {
                      console.log(errorData);
                      let errorTableComponent = {
                          'data': errorData
                      };
                      $('.page-wrapper').addClass('blur-bg');
                      let dialogRef = this.dialog
                          .open(ErrorTableComponent, {
                              width: '768px',
                              height: 'auto',
                              data: errorTableComponent
                          });
                      dialogRef
                          .afterClosed()
                          .subscribe(result => {
                              $('.page-wrapper').removeClass('blur-bg');
                              if (result) {

                              }
                          });
                  }

            });
        }
      })
  }
    /**
     @Desc not used
     @Param
     @return
     */
  deleteDevice(deleteDeviceList) {
    let deleteDevice = {
      id: deleteDeviceList,
      count: this.deviceSearchList.length
    }
    $('.page-wrapper').addClass('blur-bg');
    let dialogRef = this
      .dialog
      .open(DeleteDeviceComponent, {
        width: '820px',
        height: 'auto',
        data: deleteDevice
      });
    dialogRef
      .afterClosed()
      .subscribe(result => {
        $('.page-wrapper').removeClass('blur-bg');
        if (result) { }
      });
  }
    /**
     @Desc get all device types
     @Param
     @return
     */
  getDeviceType() {
    this
      .masterDataService
      .getDeviceType(`/rsb-oms/oms/getAllDeviceType`)
      .subscribe((data) => {
        this.deviceList = JSON.parse(data._body);
      }, (error) => {
        console.log(error);
      });
  }
    /**
     @Desc get all sub devices
     @Param
     @return
     */
  getSubDevice(data) {

    if (data != 0) {
      this
        .masterDataService
        .getDeviceList(`/rsb-oms/oms/getSubDevicesByDeviceTypeId?id=`, data)
        .subscribe((data) => {
          this.subDeviceList = JSON.parse(data._body);
        }, (error) => {
          console.log(error);
        });
    } else if (data == 0) {
      this.subDeviceList = [];
      this.brandList = [];
      this.modelList = [];
      this.manageDevice.subDeviceTypeId = 0;
      this.manageDevice.brandId = 0;
      this.manageDevice.modelId = 0;
    }
  }
    /**
     @Desc get all brands
     @Param
     @return
     */
  getBrand(data) {
    if (data != 0) {
      this
        .masterDataService
        .getDeviceList(`/rsb-oms/oms/getDeviceBrandsByDeviceSubTypeId?id=`, data)
        .subscribe((data) => {
          this.brandList = JSON.parse(data._body);
        }, (error) => {
          console.log(error);
        });
    } else if (data == 0) {
      this.brandList = [];
      this.modelList = [];
    }
  }
    /**
     @Desc get device model
     @Param
     @return
     */
  getModel(data) {
    if (data != 0) {
      this
        .masterDataService
        .getDeviceList(`/rsb-oms/oms/getDeviceModelByDeviceBrandId?id=`, data)
        .subscribe((data) => {
          this.modelList = JSON.parse(data._body);
        }, (error) => {
          console.log(error);
        });
    } else if (data == 0) {
      this.modelList = [];
    }
  }
    /**
     @Desc check filters to search
     @Param
     @return
     */
  checkFilter() {
    this.manageDevice.workingStatus=[];
    if (this.manageDevice.notInUse && this.manageDevice.inUse) {
      this.manageDevice.installStatus = 3;
    } else if (this.manageDevice.notInUse) {
      this.manageDevice.installStatus = 2;
    } else if (this.manageDevice.inUse) {
      this.manageDevice.installStatus = 1;
    }
    else {
      this.manageDevice.installStatus = 0;
    }

    // if (this.manageDevice.inService && this.manageDevice.faulty) {
    //   this.manageDevice.workingStatus = 4;
    // } else if (this.manageDevice.faulty) {
    //   this.manageDevice.workingStatus = 2;
    // } else if (this.manageDevice.inService) {
    //   this.manageDevice.workingStatus = 1;
    // }
    // else {
    //   this.manageDevice.workingStatus = 0;
    // }
    if (this.manageDevice.inService) {
      this.manageDevice.workingStatus.push(1);
    }
    if (this.manageDevice.faulty) {
      this.manageDevice.workingStatus.push(2);
    }
    if (this.manageDevice.outOfService) {
      this.manageDevice.workingStatus.push(3);
    }
  }
    /**
     @Desc get device list using search filters
     @Param
     @return
     */
  getDeviceList() {
    this.executeClicked = true;
    this.manageDevice.startLimit = -1;
    this.checkFilter();
    let filterData = Object.assign({}, this.manageDevice);
    // let json = {"deviceTypeId":this.manageDevice.deviceTypeId}
    delete filterData.inUse;
    delete filterData.faulty;
    delete filterData.inService;
    delete filterData.notInUse;
    delete filterData.outOfService;
    filterData.endLimit = 5;
    filterData.startLimit = -1;


    console.log(filterData);
    this.deviceService.saveDevice(`/rsb-oms/oms/getDevicesBySearch`, filterData).subscribe((data) => {
      this.deviceSearchList = JSON.parse(data._body);
      this.manageDevice.startLimit = 0;
      this.filter = this.manageDevice;
      this.deviceLength = this.deviceSearchList.length;
      this.deviceLength=parseInt(this.deviceLength);
     
      this.deviceSearchList.forEach(ele => {
        if (ele.pointId !== null) {
          this.noDelete = true;
        }
        this.deleteDeviceList.ids.push(parseInt(ele.device_id));
      })
    }, (error) => {
      console.log(error);
    });
  }
    /**
     @Desc navigate to show device list
     @Param
     @return
     */
  viewDeviceList() {
    if (this.deviceSearchList.length > 0 && this.executeClicked) {
      
    
      this.activatedRoute.navigate(['/rsb-modules/elements/device/ems-devices/manage']);
    }
    else if (!this.executeClicked) {
      // this
      //   .snackBar
      //   .open('Please click on execute to get the device list', 'Ok', {
      //     duration: 5000,
      //     extraClasses: ['error-snackbar']
      //   });
    }
    
    else if (this.deviceSearchList.length <= 0) {
      // this
      //   .snackBar
      //   .open('No devices found for current filters', 'Ok', {
      //     duration: 5000,
      //     extraClasses: ['error-snackbar']
      //   });
    }
    
    

  }
    /**
     @Desc not used
     @Param
     @return
     */
  editDevice(index, mode, data) {
    let prepareDeviceData = {
      'message': mode,
      'index': index
    };

    $('.page-wrapper').addClass('blur-bg');
    let dialogRef = this
      .dialog
      .open(PrepareDeviceComponent, {
        width: '768px',
        height: 'auto',
        data: prepareDeviceData,
      });
    // dialogRef.disableClose=true
    dialogRef
      .afterClosed()
      .subscribe(result => {
        $('.page-wrapper').removeClass('blur-bg');
        if (result) { }
      });
  }
    /**
     @Desc set sub header links
     @Param
     @return
     */
  updateBreadCrums() {
    this
      .appService
      .updateBreadCrums('EMS-SUBSIDIARY-IP');
  }
}
