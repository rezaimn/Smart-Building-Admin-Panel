import {Device} from './../shared/device';
import {DatePipe} from '@angular/common';

import {AddDeviceComponent} from './../add-device/add-device.component';

import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DateAdapter, MatDialog} from '@angular/material';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {LayoutComponent} from '../../../../common';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import {AppService} from '../../../../app.service';
import {PaginationService} from '../../../../pagination-service';
import {TranslateService} from '@ngx-translate/core';
import {DeviceConService} from '../device.service';


/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
    selector: 'app-device-list',
    templateUrl: './device-list.component.html',
    styleUrls: ['./device-list.component.scss'],
    providers: [DatePipe]

})
export class DeviceListComponent implements OnInit {

    @SessionStorage('organization')
    public organization;

    @SessionStorage('subsidiary')
    public subsidiary;

    devicetypes:any[]=[];
    public devices: any[];
    public device: any[];
    public models: Device[] = [];



    @SessionStorage('addDeviceCount')
    public addDeviceCount;


    constructor(public dialog: MatDialog,public translate:TranslateService,
                public appService: AppService,
                public masterDataService: MasterDataService,
                public eavWrapperService: EavWrapperService,
                public layoutComponent: LayoutComponent,
                private sanitizer: DomSanitizer,
                private storage: LocalStorageService,
                public svgService: SvgService,
                public activatedRoute: Router,
                private deviceService: DeviceConService,
                public sessionStorageService: SessionStorageService,
                public dateAdapter: DateAdapter<Date>,
                private datePipe: DatePipe,
                public paginationService: PaginationService
    ) {
        this.dateAdapter.setLocale('en-In');
    }
    ngOnInit() {
        this.getDeviceTypes();
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );
        this.sendHeaderWithLogo();
        this.addDeviceCount = 0;
        this.updateBreadCrums();

    }


    ngAfterViewInit() {
    }

    // sendHeader(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.organization !== null) {
    //     this
    //       .appService
    //       .sendHeader(this.organization.name, 'device configuration', 'manage device', 'add configuration');
    //   }
    // }

    getDeviceTypes() {
        this
            .deviceService
            .getDevicetypes('/SP/GetSettingsDeviceTypes')
            .subscribe(res => {
                if (res.status === 200) {
                    let items = JSON.parse(res._body);
                    this
                        .deviceService
                        //.getDevices("/SP/GetDeviceSettings")
                        .getDevices('/rsb-iot/device/schedule/all?orgId='+this.organization.id)

                        .subscribe(res => {
                            console.log(res);
                            if (res.status === 200) {
                                this.models = JSON.parse(res._body);

                                for (let device of items) {
                                    if (device.code == 'SPD' || device.code == 'LTN' || device.code == 'TRM') {
                                        this.devicetypes.push(device);
                                        let flag=false;
                                        for(let deviceScheduled of this.models){
                                            if(device.id==deviceScheduled.deviceType.id){
                                                flag=true;
                                                break;
                                            }
                                        }
                                        if(!flag){
                                            let deviceScheduleTemp:Device=new Device({});
                                            deviceScheduleTemp.deviceType.id=device.id;
                                            deviceScheduleTemp.edgeId=1;
                                            deviceScheduleTemp.deviceType.enName=device.name;
                                            this.models.push(deviceScheduleTemp);
                                        }
                                    }
                                }


                            }
                        }, (error: any) => {
                            this.translate.get('error-messages.device-no-data', this.appService.currentLang).subscribe(
                                (subHeaderT) => {
                                    this.appService.showFail(subHeaderT);
                                }
                            );

                        });

                }
            }, (error: any) => {
                this.translate.get('error-messages.device-type-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            });
    }
    /**
        @Desc set header logo
        @Param
        @return
    */
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        if (this.organization !== null) {
            let subHeader = '';
            let pageDetails = '';
            let subsidiaryName: '';
            let routeName = '';
            this.translate.get('sub-header.device-configuration', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.manage-device', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;

                                    this
                                        .appService
                                        .sendHeaderWithLogo("", subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/SETTING-PANEL.png');

                        }
                    );
                }
            );
        }


    }
    /**
        @Desc set sub header links
        @Param
        @return
    */
    updateBreadCrums() {
        this.appService.updateBreadCrums('ALMS-VIEW');
    }
    /**
        @Desc get device settings data paginated
        @Param
        @return
    */


    /**
        @Desc edit device settings .open the modal to edit
        @Param device object
        @return
    */
    editDevice(device) {
        this.sessionStorageService.store('device', device);
        let deviceData = {
            'device': device
        };

        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(AddDeviceComponent, {
                width: '768px',
                height: 'auto',
                data: deviceData,
                hasBackdrop: true
            });

        dialogRef
            .afterClosed()
            .subscribe(result => {
                this
                    .layoutComponent
                    .removeClass();
            });
    }


}

