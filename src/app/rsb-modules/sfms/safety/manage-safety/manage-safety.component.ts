import {Headers, Http} from '@angular/http';
import {SafetyService} from './../safety.service';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material';
import {SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {AuthenticationService, LayoutComponent} from '../../../../common';
import {EavWrapperService, HttpService, MasterDataService, SvgService} from '../../../../utils';
import { ManageArea} from '../../status/status.interface';
import {AppService} from '../../../../app.service';
import {ViewSafetyComponent} from 'app/rsb-modules/sfms/safety/view-safety/view-safety.component';
import {Card} from '../safety-interface';
import {environment} from '../../../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {PaginationService} from '../../../../pagination-service';
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
@Component({
    selector: 'app-manage-status',
    templateUrl: './manage-safety.component.html',
    styleUrls: ['./manage-safety.component.scss']
})
export class ManageSafetyComponent implements OnInit {
    private stompClient;
    private serverUrl = environment.wsUrl;
    panicButtonClicked=false;
    public page: number = 0;
    public limit: number = 10;
    public size: number = 5;
    public totalPages: number;
    public last: boolean;
    public first: boolean;
    public totalElements: number;
    public selectedArea: any;
    public campusDropdownList: Array<ManageArea> = [];
    public buildingDropdownList: Array<ManageArea> = [];
    public floorDropdownList: Array<ManageArea> = [];
    public areaDropdownList: Array<ManageArea> = [];
    public selectedCampusId: any = 0;
    public selectedBuildingId: any = 0;
    public selectedFloorId: any = 0;
    public selectedAreaId: any = 0;
    public selectedCampus: any = null;
    public selectedBuilding: any = null;
    public selectedFloor: any = null;
    public svgSourceUrl: any;
    public mapPresent: boolean = false;
    public firstpage: number = 1;
    public panZoom: any;
    public selectedType: any = 'ALL';
    public showList: any = [];
    public trySelection: boolean = true;
    public showToggleSiren: any = 'false';
    public build: any;
    public floor: any;
    public cards: Card[];
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
    public hvasList: any [];
    constructor(public dialog: MatDialog,
                public appService: AppService,
                public masterDataService: MasterDataService,
                public eavWrapperService: EavWrapperService,
                public layoutComponent: LayoutComponent,
                private sanitizer: DomSanitizer,
                public svgService: SvgService,
                public sessionStorageService: SessionStorageService,
                private authenticationService: AuthenticationService,
                public paginationService: PaginationService,
                public safetyService: SafetyService,
                public httpService: HttpService,
                public translate: TranslateService
    ) {
        authenticationService.getSensors().subscribe(data => {
            this.cards = data;
        })
    }

    ngOnInit() {
        this.initializeWebSocketConnection();
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.toggleSirenButton();

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
                if (message.body) {
                    let messageData = JSON.parse(message.body);
                    if(that.panicButtonClicked&&messageData.type=="SRN"){
                        if(messageData.state==1){
                            that.showToggleSiren='true';
                        }else{
                            that.showToggleSiren='false';
                        }
                    }else{
                        for(let hvac of that.showList){
                            if(hvac.deviceid==messageData.endPointUniqueId){
                                hvac.isProcessing=false;
                                hvac.deviceworkingstate=messageData.state.toString();
                            }

                        }
                    }
                    console.log(message.body,"boddddddddddddddddddddddddddddd");


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
        let subHeader = '';
        let pageDetails = '';
        let subsidiaryName: '';
        if (this.appService.currentLang == 'en') {
            subsidiaryName = this.subsidiary.name.map.en;
        }
        if (this.appService.currentLang == 'fa') {
            subsidiaryName = this.subsidiary.name.map.fa;
        }
        this.translate.get('sub-header.manage-safety', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.safety-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;
                        this
                            .appService
                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, '', '../../../../../assets/images/dashboard/EMS.png');
                    }
                )
            }
        );

    }
    excute() {
        console.log('excute is fired');
    }

    updateBreadCrums() {
        this.appService.updateBreadCrums('SFMS-VIEW');
    }

    getAllCampus() {
        this.campusDropdownList = [];
        this
            .masterDataService
            .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.subsidiary.id + `&Accept-Language=` + this.appService.currentLang)
            .subscribe(res => {
                const allCampusList = JSON.parse(res._body);
                allCampusList.forEach(campus => {
                    const campusJson = this.eavWrapperService.eavToJson(campus, 'CAMPUS');
                    if (campusJson !== null) {
                        this.campusDropdownList.push(campusJson);
                    }
                });
            }, (error: any) => {
                this.translate.get('error-messages.no-campus-available', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                )
            });
    }
    getAllBuildings(event) {
        if (this.selectedCampusId === 0) {
            return;
        }
        this.buildingDropdownList = [];
        this
            .masterDataService
            .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedCampusId + `&Accept-Language=` + this.appService.currentLang)
            .subscribe(res => {
                const allBuildingList = JSON.parse(res._body);
                allBuildingList.forEach(building => {
                    const buildingJson = this.eavWrapperService.eavToJson(building, 'STRUCTURE');
                    if (buildingJson !== null) {
                        this.buildingDropdownList.push(buildingJson);
                    }
                });
            }, (error: any) => {
                this.translate.get('error-messages.no-building-available', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                )
            });
    }
    getAllFloors(event) {
        if (this.selectedBuildingId === 0) {
            return;
        }
        this.floorDropdownList = [];
        this
            .masterDataService
            .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedBuildingId + `&Accept-Language=` + this.appService.currentLang)
            .subscribe(res => {
                const allFloorList = JSON.parse(res._body);
                allFloorList.forEach(floor => {
                    const floorJson = this.eavWrapperService.eavToJson(floor, 'LEVEL');
                    if (floorJson !== null) {
                        this.floorDropdownList.push(floorJson);
                    }
                });
            }, (error: any) => {
                this.translate.get('error-messages.no-floor-available', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                )
            });
    }
    viewStaff(staff) {
        this.sessionStorageService.store('staff', staff);
        let viewStaffData = {
            'staff': staff
        };

        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(ViewSafetyComponent, {
                width: '768px',
                height: 'auto',
                data: viewStaffData,
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


    changeSelectType(type: any) {

        this.selectedType = type;
        console.log(type);
        this.showList = [];
        this.hvasList.forEach(hvas => {
            if (hvas.devicetype === type) {
                this.showList.push(hvas);
            } else if (type == 'ALL') {
                this.showList.push(hvas);
            }
        });


    }

    toggleSirenButton() {
        this.httpService
            .getPe('/SFMS/GetAllSirensState')
            .subscribe(data => {
                this.showToggleSiren = (<any>data)._body;
            });
    }

    toggleButton(index: any) {
        this.showList[index].isProcessing=true;
        let valueInt = 0;
        if (this.showList[index].deviceworkingstate == '0') {
            valueInt = 1;
        } else {
            valueInt = 0;
        }
        let data = {
            operationType: 3,
            endPointUniqueId:this.showList[index].deviceid,
            state:valueInt
        };
        this.httpService
            .post('/rsb-iot/device/command', data)
            .subscribe(data => {
                },
                (error)=>{
                    this.showList[index].isProcessing=false;
                }
            );

    }
    getHvacList(page) {
        this.toggleSirenButton();
        this.showList = [];

        this
            .safetyService
            .getDevicesList('/rsb-vera/ems/vera/device/getAllVeraOzwDevice?campusId=' + this.selectedCampusId + '&buildingId=' + this.selectedBuildingId + '&floorId=' + this.selectedFloorId + '&workingState=-1&type=-1&queryType=sfms' + `&size=` + this.size + `&page=` + page)
            .subscribe(res => {
                const allFloorList = JSON.parse(res._body);
                this.hvasList = allFloorList.content;
                this.first = allFloorList.first;
                this.last = allFloorList.last;
                this.totalPages = allFloorList.totalPages;
                this.totalElements = allFloorList.totalElements;
                this.trySelection = true;
                if (this.selectedType != null && this.selectedType !== '') {
                    allFloorList.content.forEach(hvas => {
                        if (hvas.devicetype === this.selectedType) {
                            this.showList.push(hvas);
                        }
                    });
                } else {
                    this.showList = this.hvasList;

                }
                this.changeSelectType(this.selectedType);
            }, (error: any) => {
                this.translate.get('error-messages.no-hvac-available', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                )
            });


    }

// siren functions on and off
    putSiren() {
        this.panicButtonClicked=true;
        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(ViewSafetyComponent, {
                width: '640px',
                height: 'auto',
                data: 1,
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

    putSirenOff() {
        this.panicButtonClicked=false;
        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(ViewSafetyComponent, {
                width: '640px',
                height: 'auto',
                data: 0,
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

    setPage(status: string) {
        this.page = this.paginationService.setPageStart0(this.page, status, this.totalPages);
        this.getHvacList(this.page)
    }

}
