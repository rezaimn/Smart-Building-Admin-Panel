import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {LayoutComponent} from '../../../../common';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import {InstallationPointListItem, ManageArea, PointDetail} from '../parking';
import {AppService} from '../../../../app.service';
import {ParkingService} from '../parking.service';
import {Http} from '@angular/http';
import {ReserveParkingComponent} from '../reserve-parking/reserve-parking.component';
import {Router} from '@angular/router';

import {TranslateService} from '@ngx-translate/core';

declare var svgPanZoom: any;
declare var $: any;
declare var Hammer: any;

@Component({
    selector: 'app-manage-parking',
    templateUrl: './manage-parking.component.html',
    styleUrls: ['./manage-parking.component.scss']
})
export class ManageParkingComponent implements OnInit {

    public tipActive: boolean = false;
    public configList: Array<any> = [];
    public tipX: number;
    public tipY: number;
    public fileExist: boolean = false;
    public areaExist: boolean = false;
    public repeatCheck: boolean = false;
    public selectedArea: any;
    public selectedPoint: any;
    public point: PointDetail = new PointDetail({});
    public manageDeviceList: Array<any> = [];
    public campusDropdownList: Array<ManageArea> = [];
    public buildingDropdownList: Array<ManageArea> = [];
    public floorDropdownList: Array<ManageArea> = [];
    public areaDropdownList: Array<any> = [];
    public selectedCampusId: any = 0;
    public selectedBuildingId: any = 0;
    public selectedFloorId: any = 0;
    public floorId: number;
    public areaId: number;
    public svgSourceUrl: any;
    public deviceId: number;
    public svgSource = 'data:image/svg+xml;base64,';
    public panZoom: any;
    public addDeviceDetail: boolean = false;
    public deviceData: any;
    public pointIndex: number;
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

    @SessionStorage('subdiaryId')
    public subdiaryId;

    @SessionStorage('editReservedParkingOpenCount')
    public editReservedParkingOpenCount;


    //created by farshid boroomand start

    //todo => this solution is ugly so, that must be changed in future
    public floorInfo: any = []; // created to bind all data from the function

    public reservedParking: any = {};

    public p1: any = null;

    public p2: any = {};

    public p3: any = {};

    public p4: any = {};

    public p5: any = {};

    public p6: any = {};

    public p7: any = {};

    public p8: any = {};

    public p9: any = {};

    public p10: any = {};

    public p11: any = {};

    public p12: any = {};

    public p13: any = {};

    public p14: any = {};

    public p15: any = {};

    public p16: any = {};

    //created by farshid boroomand End

    constructor(
        public dialog: MatDialog,
        public appService: AppService,
        public masterDataService: MasterDataService,
        public eavWrapperService: EavWrapperService,
        public layoutComponent: LayoutComponent,
        public parkingService: ParkingService,
        private sanitizer: DomSanitizer,
        public svgService: SvgService,
        public localStorageService: LocalStorageService,
        public activatedRoute: Router,
        public sessionStorageService: SessionStorageService,
        public translate: TranslateService,
        private http: Http) {


    }

    // sendHeader(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.subsidiary !== null) {
    //     this
    //       .appService
    //       .sendHeader(this.subsidiary.name, 'Parking Management', 'Manage Parking System', '');
    //   }
    // }
    // sendHeaderWithLogo(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.subsidiary !== null) {
    //     this
    //       .appService
    //       .sendHeaderWithLogo(this.subsidiary.name, 'SPMS', 'Manage Parking System', '','../../../../../assets/images/dashboard/SMART-PARKING-SYSTEM.png');
    //   }
    // }

    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        let subHeader = '';
        let pageDetails = '';
        let subsidiaryName: '';
        if (this.appService.currentLang == 'en') {
            subsidiaryName = this.subsidiary.name.map.en;
        }
        if (this.appService.currentLang == 'fa') {
            subsidiaryName = this.subsidiary.name.map.fa;
        }
        // let routeName='';
        this.translate.get('sub-header.manage-parking-system', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.parking-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;


                                this
                                    .appService
                                    .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, '', '../../../../../assets/images/dashboard/SMART-PARKING-SYSTEM.png');
                            }
                        )


            }
        );

    }

    enableZoom() {
        const self = this;
        setTimeout(function () {
            self.panZoom = svgPanZoom('#svg_floor_map', {
                zoomEnabled: true,
                // controlIconsEnabled: true,
                fit: true,
                center: true,
                minZoom: 1,
                maxZoom: 10,
                afterZoom: function () {
                    self.tipActive = false;
                },
                beforeZoom: function () {
                    self.tipActive = false;
                }
            });
        }, 1000);
    }

    ngAfterViewInit() {
        this.getAllCampus();
    }

    openModalNew(point) {
        console.log('openModalNew:    ', point);
        this.parkingService.parkingFloor.emit(this.floorInfo);
        this.selectedPoint = point;
        let reserveParkingData = {
            'message': 'Assign',
            'index': '',
            'FloorId': this.selectedFloorId.id,
            'areaId': this.areaId,
            'selectedPoint': this.selectedPoint

        }
        $('.page-wrapper').addClass('blur-bg');
        let dialogRef = this
            .dialog
            .open(ReserveParkingComponent, {
                width: '768px',
                height: 'auto',
                data: reserveParkingData
            });
        dialogRef
            .afterClosed()
            .subscribe(result => {
                $('.page-wrapper').removeClass('blur-bg');
            });
    }

    // openModal(areaId) {
    //     this.areaId = areaId;
    //       this
    //           .localStorageService
    //           .store("addClicked", true);
    // }

    openModalE(point: any) {
        console.log('openModalE:    ', point);
        this.parkingService.parkingFloor.emit(this.floorInfo);
        this.selectedPoint = point;

        this
            .layoutComponent
            .addClass();
        let reserveParkingData = {
            'message': 'Update',
            'index': '',
            'FloorId': this.selectedFloorId.id,
            'areaId': this.areaId,
            'selectedPoint': this.selectedPoint

        }
        $('.page-wrapper').addClass('blur-bg');
        let dialogRef = this
            .dialog
            .open(ReserveParkingComponent, {
                width: '768px',
                height: 'auto',
                data: reserveParkingData
            });
        dialogRef
            .afterClosed()
            .subscribe(result => {
                $('.page-wrapper').removeClass('blur-bg');
                this
                    .layoutComponent
                    .removeClass();

            });
    }


    ngOnInit() {
        let self = this;
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.observeSliderClick();
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.editReservedParkingOpenCount = 0;


        $('.svg-area-map-container').on('click', function (e) {
            self.tipActive = false;
        });

        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )

    }

    editConfig() {
        this.getClickedPointDetail(this.deviceId);
        this
            .sessionStorageService
            .store('deviceSliderclicked', true);
    }

    observeSliderClick() {
        this
            .sessionStorageService
            .observe('deviceSliderclicked')
            .subscribe((clickedRes) => {
                this.getClickedPointDetail(this.deviceId);
                this.addDeviceDetail = clickedRes;
                if (this.addDeviceDetail) {
                    this.deviceData = {
                        'deviceId': this.deviceId,
                        'point': this.point,
                        'index': this.pointIndex
                    };
                }
            });
    }

// status of parking points
    getClickedPointDetail(id) {
        this
            .manageDeviceList
            .forEach((element, index) => {
                if (element.id == id) {
                    this.point = element;
                    this.pointIndex = index;
                }
            });
    }

    getAllCampus() {
        this.campusDropdownList = [];
        this
            .masterDataService
            .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.subdiaryId + `&Accept-Language=` + this.appService.currentLang)
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
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured while retriving area list', 'Ok', {
                //     duration: 5000,
                //     extraClasses: ['error-snackbar']
                //   });
            });
    }

    zoomInSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this
                .panZoom
                .zoomIn();
        }
    }

    zoomOutSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this
                .panZoom
                .zoomOut();
        }
    }

    resetZoomSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this
                .panZoom
                .resetZoom();
        }
    }

    // On change campus trigger building
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
                    const buildingJson = this
                        .eavWrapperService
                        .eavToJson(building, 'STRUCTURE');
                    if (buildingJson !== null) {
                        this
                            .buildingDropdownList
                            .push(buildingJson);
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

    getAllFloors() {

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
                    const floorJson = this
                        .eavWrapperService
                        .eavToJson(floor, 'LEVEL');
                    if (floorJson !== null) {
                        this
                            .floorDropdownList
                            .push(floorJson);
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

    getAllAreas(event) {
        if (this.selectedFloorId === 0) {
            return;
        }
        this.areaDropdownList = [];
        this
            .masterDataService
            .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedFloorId.id )
            .subscribe(res => {
                this.areaExist = true;
                const allAreaList = JSON.parse(res._body);
                allAreaList.forEach(area => {
                    const areaJson = this
                        .eavWrapperService
                        .eavToJson(area, 'AREA');
                    if (areaJson !== null) {
                        this
                            .areaDropdownList
                            .push(areaJson);
                    }
                    if (this.areaDropdownList.length > 0) {
                        this.drawAreasOnMap();
                        this.selectedArea = this.areaDropdownList[0];

                    }
                });
                // Aneesh : TODO : Get the device points for a single area.
                this.getInstallationPoints(this.areaDropdownList[0]);
            }, (error: any) => {
                // this   .snackBar   .open('Error occured while retriving area list', 'Ok', {
                //   duration: 5000,     extraClasses: ['error-snackbar']   });
            });
    }

    getInstallationPoints(area) {

        this.manageDeviceList = [];

        // Get the Device points by Area Id
        this
            .parkingService
            .getDeviceList(`/rsb-oms/oms/getPointsByAreaId?id=` + area.id)
            .subscribe(res => {
                if (res._body !== '') {
                    const ipList = JSON.parse(res._body);
                    ipList.forEach(ip => {
                        let ipItem = new InstallationPointListItem(ip);
                        if (ipItem !== null) {
                            ipItem.deviceColor = this.masterDataService.getDevicePointColor(ipItem.deviceType);
                            ipItem.deviceCode = this.masterDataService.getDevicePointCode(ipItem.deviceType);
                            this.manageDeviceList.push(ipItem);
                        }
                    });
                    if (this.manageDeviceList.length > 0) {
                        const self = this;
                        setTimeout(function () {
                            self.renderInstallationPoints();
                        }, 500);
                    }
                }
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured while retriving Access list', 'Ok', {
                //     duration: 5000,
                //     extraClasses: ['error-snackbar']
                //   });
            });
    }

    getConfigList(event) {
        this.configList = [];
        this.deviceId = $(event.target).attr('id');
        this
            .masterDataService
            .getCampusDropdownList(`/rsb-oms/oms/getDevicesByPointId?pointId=` + this.deviceId)
            .subscribe(res => {
                this.configList = JSON.parse(res._body);
                if (this.configList.length > 0) {
                    this.getClickedPointDetail(this.deviceId);
                    this.tipActive = true;
                    this.deviceData = {
                        'deviceId': this.deviceId,
                        'point': this.point,
                        'index': this.pointIndex
                    };
                    this.tipX = event.clientX + 34;
                    this.tipY = event.clientY - 103;
                } else {
                    this
                        .sessionStorageService
                        .store('deviceSliderclicked', true);
                }

            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured while retriving config list', 'Ok', {
                //     duration: 5000,
                //     extraClasses: ['error-snackbar']
                //   });
            });
    }

    makeSVGElement(tag, attrs) {
        const self = this;
        let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (let k in attrs) {
            el.setAttribute(k, attrs[k]);
        }
        el
            .addEventListener('click', function (event) {
                self.tipActive = false;
                self.getConfigList(event);
            });
        return el;
    }

    renderInstallationPoints() {
        //Aneesh
        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();

        let svgTemp: any = null; //svgAreaMap.childNodes[0].firstChild;//document.querySelector('#svg_floor_map > g');

        let i;
        const childNodesLength = svgAreaMap.childNodes.length;

        for (i = 0; i < childNodesLength; i++) {
            if (svgAreaMap.childNodes[i].nodeName === 'svg') {
                svgTemp = svgAreaMap.childNodes[i].firstChild;
            }
        }
        if (svgTemp.nodeName == '#text') {
            svgTemp = svgTemp.parentNode;
        }
        if (svgTemp !== null) {
            const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
            styleElement.textContent = ' .ip_circle_class { cursor: pointer; } ';
            svgTemp.appendChild(styleElement);
        }

        this
            .manageDeviceList
            .forEach((ip, index) => {
                const circle = this.makeSVGElement('circle', {
                    cx: ip.coordinate.x,
                    cy: ip.coordinate.y,
                    r: 3,
                    stroke: '#ccc',
                    'stroke-width': 0.5,
                    'class': 'ip_circle_class',
                    'id': ip.id,
                    fill: ip.deviceColor
                });
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', ip.coordinate.x);
                text.setAttribute('y', ip.coordinate.y);
                text.setAttribute('class', 'ip_text_class');
                text.setAttribute('fill', '#fff');
                text.setAttribute('font-size', '3px');
                text.setAttribute('font-family', 'tw-regular');
                text.setAttribute('text-anchor', 'middle');
                text.textContent = ip.deviceCode + (index + 1);
                if (svgTemp.nodeName == '#text') {
                    svgTemp = svgTemp.parentNode;
                }
                if (svgTemp !== null) {
                    svgTemp.append(circle);
                    svgTemp.append(text);
                }
            });
    }

    drawAreasOnMap() {
        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
        let pathCoordinates: string;
        let zoomInCoordinate: any = null;
        console.log("555555555555555555",this.areaDropdownList);
        this
            .areaDropdownList
            .forEach(area => {
                const manageAreaListLength = area.points.length;
                let firstPointX: any = 0;
                let firstPointY: any = 0;
                area
                    .points
                    .forEach((point, index) => {
                        firstPointX = firstPointX + point.x;
                        firstPointY = firstPointY + point.y;
                        let pathCoordinate = point.x + ' ' + point.y;
                        if (zoomInCoordinate == null) {
                            zoomInCoordinate = point;
                        }
                        if (index === 0) {
                            pathCoordinates = 'M' + pathCoordinate;
                        } else {
                            pathCoordinates += ' L' + pathCoordinate;
                        }
                    });
                firstPointX = firstPointX / manageAreaListLength;
                firstPointY = firstPointY / manageAreaListLength;
                pathCoordinates += ' Z';
                let newpath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                newpath.setAttributeNS(null, 'd', pathCoordinates);
                newpath.setAttributeNS(null, 'class', 'draggable');
                newpath.setAttributeNS(null, 'id', 'a_' + area.id);
                newpath.setAttributeNS(null, 'fill', area.color
                    ? area.color
                    : 'lightgreen');
                newpath.setAttributeNS(null, 'stroke-width', '2');
                newpath.setAttributeNS(null, 'opacity', '.7');
                let svgTemp: any = null; //svgAreaMap.childNodes[0].firstChild;//document.querySelector('#svg_floor_map > g');
                let i;
                const childNodesLength = svgAreaMap.childNodes.length;
                for (i = 0; i < childNodesLength; i++) {
                    if (svgAreaMap.childNodes[i].nodeName === 'svg') {
                        svgTemp = svgAreaMap.childNodes[i].firstChild;
                    }
                }
                if (svgTemp.nodeName == '#text') {
                    svgTemp = svgTemp.parentNode;
                }
                if (svgTemp !== null) {
                    svgTemp.appendChild(newpath);
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', firstPointX);
                    text.setAttribute('y', firstPointY);
                    text.setAttribute('fill', '#000');
                    text.setAttribute('font-size', '4px');
                    text.setAttribute('font-family', 'Verdana');
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('alignment-baseline', 'middle');
                    if(this.appService.currentLang == 'en'){
                        text.textContent = area.name.map.en;
                    }if(this.appService.currentLang == 'fa'){
                        text.textContent = area.name.map.fa;
                    }
                    svgTemp.append(text);
                }
            });
    }

    updateBreadCrums() {
        this
            .appService
            .updateBreadCrums('SPMS-MANAGEMENT');
    }

    getFileDetail(data) {
        if (data == 0 || data.id == undefined) {
            return;
        }
        this.fileExist = true;
        this
            .parkingService
            .getFileDetail(`/rsb-oms/oms/getFile/` + data.levelMap)
            .subscribe(res => {
                const contentTypeSVG = 'image/svg+xml';
                const b64Svg = JSON
                    .parse(res._body)
                    .data;
                const blob = this.b64toBlob(b64Svg, contentTypeSVG, 512);
                this.svgSourceUrl = this
                    .sanitizer
                    .bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
                this.enableZoom();
                const self = this;
                this.activateListeners();
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured while getting Map', 'Ok', {
                //     duration: 5000,
                //     extraClasses: ['error-snackbar']
                //   });
            });
    }

    activateListeners() {
        let self = this;

        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        svg_floor_map.addEventListener('load', function (event) {

            //Enable the Zoom after the complete loading of the Map
            self.enableZoom();

            //Call API to get the area list and render in the UI
            self.getAllAreas(event);

            let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
            svgAreaMap.addEventListener('click', function (event) {
                self.tipActive = false;
            });

        });

    }

    zoomInToParticularArea(areaPoints) {
        let self = this;
        setTimeout(function () {
            if (self.panZoom) {
                self.panZoom.resetZoom();
                let centroid = self.svgService.calculateCentroid(areaPoints);
                const sizes = self
                    .panZoom
                    .getSizes();
                let newValues = self
                    .svgService
                    .convertSVGPointToZoomPoint(centroid, self.panZoom.getPan(), sizes.realZoom);
                self
                    .panZoom
                    .zoomAtPointBy(1, {
                        x: newValues.x,
                        y: newValues.y
                    });
                self
                    .panZoom
                    .zoomAtPointBy(2, {
                        x: newValues.x,
                        y: newValues.y
                    });
                self
                    .panZoom
                    .zoomAtPointBy(2, {
                        x: newValues.x,
                        y: newValues.y
                    });
            }
        }, 1000);
    }

    b64toBlob(b64Data: any, contentType: string, sliceSize: number) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    showArea(area, event) {
        // $('.' + event.currentTarget.className).removeClass('active'); $('#' +
        // event.currentTarget.id).addClass('active');
        this.selectedArea = area;

        //Call the API to get the Device points based on the area clicked.
        this.getInstallationPoints(area);

        // Focus on the area clicked
        if (area.points.length > 0) {
            this.zoomInToParticularArea(area.points);
            // this.zoomInToParticularArea(area.points);
        }
    }

    // created by Farshid boroomand

    getFloorInfo() {
        this.fileExist = true;
        this.repeatCheck = true;
        this.parkingService
            .getAllForFloor(`/rsb-parking/parking/getAllForFloor?floorId=` + this.selectedFloorId.id)
            .subscribe(res => {
                if (res.status === 200) {
                    this.fileExist = true;
                    this.floorInfo = JSON.parse(res._body);

                    console.log(this.floorInfo);
                    // this.p1 = this.floorInfo[0];
                    // this.p2 = this.floorInfo[1];
                    // this.p3 = this.floorInfo[2];
                    // this.p4 = this.floorInfo[3];
                    // this.p5 = this.floorInfo[4];
                    // this.p6 = this.floorInfo[5];
                    // this.p7 = this.floorInfo[6];
                    // this.p8 = this.floorInfo[7];
                    // this.p9 = this.floorInfo[8];
                    // this.p10 = this.floorInfo[9];
                    // this.p11 = this.floorInfo[10];
                    // this.p12 = this.floorInfo[11];
                    // this.p13 = this.floorInfo[12];
                    // this.p14 = this.floorInfo[13];
                    // this.p15 = this.floorInfo[14];
                    // this.p16 = this.floorInfo[15];


                    this.floorInfo.forEach(floorin => {
                        if (floorin.areaName === 'PA5' || floorin.areaName === 'pa5' || floorin.areaName === 'PA 5' || floorin.areaName === 'pa 5') {
                            this.p1 = floorin;
                        }
                        if (floorin.areaName === 'PA4' || floorin.areaName === 'pa4' || floorin.areaName === 'PA 4' || floorin.areaName === 'pa 4') {
                            this.p2 = floorin;
                        }
                        if (floorin.areaName === 'PA3' || floorin.areaName === 'pa3' || floorin.areaName === 'PA 3' || floorin.areaName === 'pa 3') {
                            this.p3 = floorin;
                        }
                        if (floorin.areaName === 'PA2' || floorin.areaName === 'pa2' || floorin.areaName === 'PA 2' || floorin.areaName === 'pa 2') {
                            this.p4 = floorin;
                        }
                        if (floorin.areaName === 'PA1' || floorin.areaName === 'pa1' || floorin.areaName === 'PA 1' || floorin.areaName === 'pa 1') {
                            this.p5 = floorin;
                        }
                        if (floorin.areaName === 'PA11' || floorin.areaName === 'pa11' || floorin.areaName === 'PA 11' || floorin.areaName === 'pa 11') {
                            this.p6 = floorin;
                        }
                        if (floorin.areaName === 'PA12' || floorin.areaName === 'pa12' || floorin.areaName === 'PA 12' || floorin.areaName === 'pa 12') {
                            this.p7 = floorin;
                        }
                        if (floorin.areaName === 'PA13' || floorin.areaName === 'pa13' || floorin.areaName === 'PA 13' || floorin.areaName === 'pa 13') {
                            this.p8 = floorin;
                        }
                        if (floorin.areaName === 'PA14' || floorin.areaName === 'pa14' || floorin.areaName === 'PA 14' || floorin.areaName === 'pa 14') {
                            this.p9 = floorin;
                        }
                        if (floorin.areaName === 'PA7' || floorin.areaName === 'pa7' || floorin.areaName === 'PA 7' || floorin.areaName === 'pa 7') {
                            this.p10 = floorin;
                        }
                        if (floorin.areaName === 'PA8' || floorin.areaName === 'pa8' || floorin.areaName === 'PA 8' || floorin.areaName === 'pa 8') {
                            this.p11 = floorin;
                        }
                        if (floorin.areaName === 'PA9' || floorin.areaName === 'pa9' || floorin.areaName === 'PA 9' || floorin.areaName === 'pa 9') {
                            this.p12 = floorin;
                        }
                        if (floorin.areaName === 'PA10' || floorin.areaName === 'pa10' || floorin.areaName === 'PA 10' || floorin.areaName === 'pa 10') {
                            this.p13 = floorin;
                        }
                        if (floorin.areaName === 'PA16' || floorin.areaName === 'pa16' || floorin.areaName === 'PA 16' || floorin.areaName === 'pa 16') {
                            this.p14 = floorin;
                        }
                        if (floorin.areaName === 'PA515' || floorin.areaName === 'pa15' || floorin.areaName === 'PA 15' || floorin.areaName === 'pa 15') {
                            this.p15 = floorin;
                        }
                        if (floorin.areaName === 'PA6' || floorin.areaName === 'pa6' || floorin.areaName === 'PA 6' || floorin.areaName === 'pa 6') {
                            this.p16 = floorin;
                        }

                    });
                }
            }, (error: any) => {
                // this
                //     .snackBar
                //     .open('Error occured', 'Ok', {
                //         duration: 5000,
                //     });
            });

        setInterval(() => {
            this.getFloorInfo();
        }, 2 * (1000 * 60));

        //load from json file
        // this.http.get('assets/data/sample.json')
        //       .map((res) => res.json())
        //     .subscribe(data => {
        //         this.fileExist = true;
        //         this.floorInfo = data;
        //         this.p1 = this.floorInfo[0];
        //         this.p2 = this.floorInfo[1];
        //         this.p3 = this.floorInfo[2];
        //         this.p4 = this.floorInfo[3];
        //         this.p5 = this.floorInfo[4];
        //         this.p6 = this.floorInfo[5];
        //         this.p7 = this.floorInfo[6];
        //         this.p8 = this.floorInfo[7];
        //         this.p9 = this.floorInfo[8];
        //         this.p10 = this.floorInfo[9];
        //         this.p11 = this.floorInfo[10];
        //         this.p12 = this.floorInfo[11];
        //         this.p13 = this.floorInfo[12];
        //         this.p14 = this.floorInfo[13];
        //         this.p15 = this.floorInfo[14];
        //         this.p16 = this.floorInfo[15];
        //     }, (rej) => {console.error('Could not load local data',rej)});
    }
}
