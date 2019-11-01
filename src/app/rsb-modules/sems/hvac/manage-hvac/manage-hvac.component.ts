import {HvacService} from './../hvac.service';
import {Http} from '@angular/http';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material';
import {SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {LayoutComponent} from '../../../../common';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import { ManageArea} from '../../status/status.interface';
import {AppService} from '../../../../app.service';
import {StatusService} from '../../status/status.service';
import {ViewHvacComponent} from 'app/rsb-modules/sems/hvac/view-hvac/view-hvac.component';
import {TranslateService} from '@ngx-translate/core';
import {PaginationService} from '../../../../pagination-service';
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
import {environment} from '../../../../../environments/environment';



@Component({
    selector: 'app-manage-status',
    templateUrl: './manage-hvac.component.html',
    styleUrls: ['./manage-hvac.component.scss']
})
export class ManageHvacComponent implements OnInit {
    private stompClient;
    private serverUrl = environment.wsUrl;
    public selectedArea: any;
    public campusDropdownList: Array<ManageArea> = [];
    public buildingDropdownList: Array<ManageArea> = [];
    public floorDropdownList: Array<ManageArea> = [];
    public areaDropdownList: Array<ManageArea> = [];

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
    public staff: any;

    public fileExist: boolean = false;
    public hvacList: any = [];
    public showList: any = [];

    public firstpage: number = 1;
    public panZoom: any;
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

    constructor(
        public dialog: MatDialog,
        public translate: TranslateService,
        public appService: AppService,
        public masterDataService: MasterDataService,
        public eavWrapperService: EavWrapperService,
        public layoutComponent: LayoutComponent,
        public svgService: SvgService,
        public sessionStorageService: SessionStorageService,
        private http: Http,
        public hvacService: HvacService,
        public paginationService: PaginationService
    ) {
    }

    ngOnInit() {
        this.initializeWebSocketConnection();
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )
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
                            hvac.devicevalue=messageData.value;

                        }

                    }

                }
            });
        });
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
            let routeName = '';
            this.translate.get('sub-header.hvac-management', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.manage-hvac', this.appService.currentLang).subscribe(
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

// get all building
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

// get all floor
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

    editHvac(hvac,index) {
        this.sessionStorageService.store('hvac', hvac);
        let viewHvacData = {
            'hvac': hvac
        };

        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(ViewHvacComponent, {
                width: '768px',
                height: 'auto',
                data: viewHvacData,
                hasBackdrop: true
            });

        dialogRef
            .afterClosed()
            .subscribe(result => {
                if(result){
                    this.hvacList[index].isProcessing=true;
                }
                this
                    .layoutComponent
                    .removeClass();
            });
    }

// http://appdev.mitoconnect.com/api/rsb-vera/ems/vera/device/getAllVeraOzwDevice?campusId=-1&buildingId=5&floorId=-1&workingState=-1&type=-1
    getHvacList() {

        console.log("mmmmmmmmmmmmmmmmmmmmmange-hvac");
        this.hvacList = [];
        this
            .hvacService
            .getDevicesList('/rsb-vera/ems/vera/device/getAllVeraOzwDevice?campusId=' + this.selectedCampusId + '&buildingId=' + this.selectedBuildingId + '&floorId=' + this.selectedFloorId + '&workingState=-1&type=-1&queryType=HVAC' + `&size=` + this.size + `&page=` + this.page)
            .subscribe(res => {
                const allFloorList = JSON.parse(res._body);
                // this.hvasList = allFloorList;
                // this.showList= allFloorList;

                this.hvacList = allFloorList.content;
                this.first = allFloorList.first;
                this.last = allFloorList.last;
                this.totalPages = allFloorList.totalPages;
                this.totalElements = allFloorList.totalElements;

                if (this.selectedAreaId === 1) {
                    allFloorList.content.forEach(hvac => {
                        if (hvac.deviceworkingstate == 'In Service') {
                            this.hvacList.push(hvac);
                        }
                    });
                } else if (this.selectedAreaId === 2) {
                    allFloorList.content.forEach(hvac => {
                        if (hvac.deviceworkingstate == 'Out Of Service') {
                            allFloorList.push(hvac);
                        }
                    });

                } else {
                    this.hvacList = allFloorList.content;
                }
                if (this.hvacList.length > 5) {
                    this.showList = [];
                    var i = 0;
                    this.hvacList.forEach(hvac => {
                        if (i < 5) {
                            this.showList.push(hvac);
                            hvac.isProcessing=false;
                        }
                        i++;
                    });
                } else {
                    this.showList = [];
                    this.showList = this.hvacList;
                }

                //  console.log(this.shpwList);
            }, (error: any) => {

            });
    }

    setPage(status: string) {
        this.page = this.paginationService.setPageStart0(this.page, status, this.totalPages);
        this.getHvacList()
    }

}
