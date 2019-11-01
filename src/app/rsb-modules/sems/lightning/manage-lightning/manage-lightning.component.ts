import {environment} from './../../../../../environments/environment';
import { Http} from '@angular/http';
import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {LayoutComponent} from '../../../../common';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import { ManageArea} from '../../status/status.interface';
import {AppService} from '../../../../app.service';
import {ViewLightningComponent} from 'app/rsb-modules/sems/lightning/view-lightning/view-lightning.component';
import {TranslateService} from '@ngx-translate/core';
import {PaginationService} from '../../../../pagination-service';
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import {LightningService} from '../lightning.service';
@Component({
    selector: 'app-manage-status',
    templateUrl: './manage-lightning.component.html',
    styleUrls: ['./manage-lightning.component.scss']
})
export class ManageLightningComponent implements OnInit {
    private stompClient;
    private serverUrl = environment.wsUrl;
    public selectedArea: any;
    public campusDropdownList: Array<ManageArea> = [];
    public buildingDropdownList: Array<ManageArea> = [];
    public floorDropdownList: Array<ManageArea> = [];
    public areaDropdownList: Array<ManageArea> = [];
    public staff: any;
    public page: number = 0;
    public limit: number = 10;
    public size: number = 5;
    public totalPages: number;
    public last: boolean;
    public first: boolean;
    public totalElements: number;
    public selectedCampusId: any = 0;
    public selectedBuildingId: any = 0;
    public selectedFloorId: any = 0;
    public selectedAreaId: any = 0;
    public selectedCampus: any = null;
    public selectedBuilding: any = null;
    public selectedFloor: any = null;
    public svgSourceUrl: any;
    public mapPresent: boolean = false;
    public panZoom: any;
    public fileExist: boolean = false;
    public hvacList: any = [];
    public showList: any = [];
    public firstpage: number = 1;
    public lastpage: any = 1;
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

    constructor(public dialog: MatDialog,
                public appService: AppService,
                public masterDataService: MasterDataService,
                public eavWrapperService: EavWrapperService,
                public layoutComponent: LayoutComponent,
                public svgService: SvgService,
                public sessionStorageService: SessionStorageService,
                public http: Http,
                public lightningService: LightningService,
                public translate: TranslateService,
                public paginationService: PaginationService
    ) {
    }


    ngOnInit() {
        this.initializeWebSocketConnection();
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
    }
    async initializeWebSocketConnection() {
        let ws = new WebSocket(this.serverUrl);

        this.stompClient = Stomp.over(ws);
        let that = this;
        this.stompClient.connect({}, function (frame) {
            that.stompClient.subscribe('/topic/device-operation', (message) => {
                console.log(message.body,"boddddddddddddddddddddddddddddd");
                if (message.body) {
                    let messageData = JSON.parse(message.body);
                    console.log(message.body,"boddddddddddddddddddddddddddddd");
                    for(let hvac of that.showList){
                        if(hvac.deviceid==messageData.endPointUniqueId){
                            hvac.isProcessing=false;
                            hvac.deviceworkingstate=messageData.state;
                        }

                    }

                }
            });
        });
    }
    ngOnDestroy() {
        try {
            this.stompClient.disconnect();
        } catch (e) {
        }
    }
    ngAfterViewInit() {
        this.getAllCampus();
    }

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
            this.translate.get('sub-header.lightning-management', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.manage-lightning', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;
                            this
                                .appService
                                .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, '', '../../../../../assets/images/dashboard/SMART-ENERGY-SAVING-SYSTEM.png');
                        }
                    );
                }
            );

        }

    }

    updateBreadCrums() {
        this.appService.updateBreadCrums('SEMS-VIEW');
    }

    getAllCampus() {
        this.campusDropdownList = [];
        this
            .masterDataService
            .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.subsidiary.id)
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

    getAllBuildings(event) {
        if (this.selectedCampusId === 0) {
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

    getAllFloors(event) {
        if (this.selectedBuildingId === 0) {
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


    toggleButton(index: any) {
        this.hvacList[index].isProcessing=true;
        let valueInt = 0;
        if (this.hvacList[index].deviceworkingstate != '1') {
            valueInt = 1;
        } else {
            valueInt = 0;
        }
        let data = {
            operationType: 3,
            endPointUniqueId:this.hvacList[index].deviceid,
            state:valueInt
        };
        this.lightningService
            .toggleLighting('device/command', data)
            .subscribe(data => {
                },
                (error)=>{
                    this.hvacList[index].isProcessing=false;
                }
            );


    }

    getHvacList() {
        console.log('mmmmmmmmmmmmmmmmmmmmmange-ligthing');
        this.hvacList = [];
        this.showList = [];
        this
            .lightningService
            .getDevicesList('/rsb-vera/ems/vera/device/getAllVeraOzwDevice?campusId=' + this.selectedCampusId + '&buildingId=' + this.selectedBuildingId + '&floorId=' + this.selectedFloorId + '&workingState=-1&type=-1&queryType=LIGHT' + `&size=` + this.size + `&page=` + this.page)
            .subscribe(res => {
                const allFloorList = JSON.parse(res._body);
                // this.hvasList = allFloorList;
                //this.showList= allFloorList;

                this.hvacList = allFloorList.content;
                this.first = allFloorList.first;
                this.last = allFloorList.last;
                this.totalPages = allFloorList.totalPages;
                this.totalElements = allFloorList.totalElements;

                if (this.selectedAreaId === 1) {
                    allFloorList.content.forEach(hvas => {
                        if (hvas.devicestatus == 'In Service') {
                            allFloorList.content.push(hvas);
                        }
                    });
                } else if (this.selectedAreaId === 2) {
                    allFloorList.content.forEach(hvas => {
                        if (hvas.devicestatus == 'Out Of Service') {
                            allFloorList.content.push(hvas);
                        }
                    });

                } else {
                    this.hvacList = allFloorList.content;
                }
                console.log(this.hvacList.length);
                console.log(this.hvacList.length / 5);
                this.lastpage = this.hvacList.length / 5;
                this.lastpage = parseInt(this.lastpage) + 1;

                if (this.hvacList.length > 0) {
                    this.showList = [];
                    var i = 0;
                    this.hvacList.forEach(hvac => {
                        if (i < 5) {
                            this.showList.push(hvac);
                            hvac.isProcessing=false;
                        }
                        i++;
                    });
                }
                console.log(this.hvacList);
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured while retriving area list', 'Ok', {
                //     duration: 5000,
                //     extraClasses: ['error-snackbar']
                //   });
            });
    }

    setPage(status: string) {
        this.page = this.paginationService.setPageStart0(this.page, status, this.totalPages);
        this.getHvacList()
    }


}
