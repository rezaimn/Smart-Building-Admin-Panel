import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material';
import {SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {LayoutComponent} from '../../../../common';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import {InstallationPointListItem} from '../status.interface';
import {AppService} from '../../../../app.service';
import {StatusService} from '../status.service';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../../../../../environments/environment';

/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;


@Component({
    selector: 'app-manage-status',
    templateUrl: './manage-status.component.html',
    styleUrls: ['./manage-status.component.scss']
})
export class ManageStatusComponent implements OnInit {
    public flag=false;
    public selectedArea: any;
    public installationPoints: Array<InstallationPointListItem> = [];
    public campusDropdownList: Array<any> = [];
    public buildingDropdownList: Array<any> = [];
    public floorDropdownList: Array<any> = [];
    public areaDropdownList: Array<any> = [];
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
    public deviceList: any = [];
    public svgActivated: boolean = false;
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
    public sfmsDeviceList = [];
    public hvacDeviceList = [];
    public plugDeviceList = [];
    public lightnigDeviceList = [];
    public skDeviceList = [];
    public cameraDeviceList = [];
    @SessionStorage('subsidiary')
    public subsidiary;

    constructor(public dialog: MatDialog,
                public appService: AppService,
                public masterDataService: MasterDataService,
                public eavWrapperService: EavWrapperService,
                public layoutComponent: LayoutComponent,
                public statusService: StatusService,
                private sanitizer: DomSanitizer,
                public svgService: SvgService,
                public sessionStorageService: SessionStorageService,
                public translate: TranslateService
    ) {
    }

    ngOnInit() {
        this.flag=false;
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        // this.getAlldev();
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );

    }

    ngAfterViewInit() {
        this.getAllCampus();
    }

    // sendHeader(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.subsidiary !== null) {
    //     this
    //       .appService
    //       .sendHeader(this.subsidiary.name, 'element management', 'real time status', '');
    //   }
    // }
    /**
     @Desc get all device
     @Param
     @return
     */
    getAlldev(queryType): Promise<{ deviceList: any[] }> {
        return new Promise((resolve, reject) => {
                this
                    .masterDataService
                    .getDevicesList('/rsb-vera/ems/vera/device/getAllVeraOzwDevice?campusId=' + this.selectedCampusId + '&buildingId=' + this.selectedBuildingId + '&floorId=' + this.selectedFloorId + '&workingState=-1&type=-1&queryType=' + queryType + `&size=` + 10000 + `&page=` + 0)
                    .subscribe(res => {
                            let list = JSON.parse(res._body).content;

                            resolve({deviceList: list});
                        },
                        (error => {
                                resolve({deviceList: []});
                            }
                        )
                    )
            }
        )
    }

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
            let subsidiaryName = '';
            if (this.appService.currentLang == 'en') {
                subsidiaryName = this.subsidiary.name.map.en;
            }
            if (this.appService.currentLang == 'fa') {
                subsidiaryName = this.subsidiary.name.map.fa;
            }
            this.translate.get('sub-header.status-view', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.real-time-status', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;

                            this
                                .appService
                                .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, '', '../../../../../assets/images/dashboard/INDOOR-SURVEILLANCE-SYSTEM.png');

                        }
                    )
                }
            )

        }
    }

    /**
     @Desc set sub header links
     @Param
     @return
     */
    updateBreadCrums() {
        this.appService.updateBreadCrums('EMS-STATUS-VIEW');
    }

    /**
     @Desc get all campus list for drop down
     @Param
     @return
     */
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
                // this
                //   .snackBar
                //   .open('Error occured while retriving area list', 'Ok', {
                //     duration: 5000,
                //     extraClasses: ['error-snackbar']
                //   });
            });
    }

    /**
     @Desc get all building list for drop down
     @Param
     @return
     */
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
                // this
                //   .snackBar
                //   .open('Error occured while retriving area list', 'Ok', {
                //     duration: 5000,
                //     extraClasses: ['error-snackbar']
                //   });
            });
    }

    /**
     @Desc get all floor list for drop down
     @Param
     @return
     */
    getAllFloors(event) {
        //alert("hi");
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
                // this
                //   .snackBar
                //   .open('Error occured while retriving area list', 'Ok', {
                //     duration: 5000,
                //     extraClasses: ['error-snackbar']
                //   });
            });
    }

    /**
     @Desc get all area by floor id
     @Param
     @return
     */
    getAreaByFloor(event) {
        if (this.selectedFloorId === 0) {
            return;
        } else {
            this.getAllAreas(true);
        }
    }

    /**
     @Desc check if area is present or not
     @Param
     @return
     */
    isAreaPresent(areaJson: any) {
        let isPresent = false;
        this.areaDropdownList.forEach(singleArea => {
            if (singleArea.id == areaJson.id && !isPresent) {
                isPresent = true;
            }
        });
        return isPresent;
    }

    /**
     @Desc get all areas for drop down
     @Param
     @return
     */
    getAllAreas(fromDropDown: boolean) {
        if (this.selectedFloorId === 0) {
            return;
        }
        if (this.areaDropdownList.length > 0 && !fromDropDown) {
            this.drawAreasOnMap(this.areaDropdownList);
            return;
        }

        this
            .masterDataService
            .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedFloorId + `&Accept-Language=` + this.appService.currentLang)
            .subscribe(res => {
                this.areaDropdownList.splice(0, this.areaDropdownList.length);
                const allAreaList = JSON.parse(res._body);
                allAreaList.forEach(area => {
                    const areaJson = this.eavWrapperService.eavToJson(area, 'AREA');
                    if (areaJson !== null && !this.isAreaPresent(areaJson)) {
                        this.areaDropdownList.push(areaJson);
                    }
                });
                if (this.areaDropdownList.length > 0 && !fromDropDown) {
                    this.drawAreasOnMap(this.areaDropdownList);
                }
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured while retriving area list', 'Ok', {
                //     duration: 5000,
                //     // extraClasses: ['error-snackbar']
                //   });
            });
    }

    /**
     @Desc render SVG map by floor details
     @Param
     @return
     */
    renderFloorDetails() {
        this.getAlldev('sfms').then(
            (sfms: any) => {
                this.sfmsDeviceList = sfms.deviceList;
                this.getAlldev('HVAC').then(
                    (hvac: any) => {
                        this.hvacDeviceList = hvac.deviceList;
                        this.getAlldev('LIGHT').then(
                            (light: any) => {
                                this.lightnigDeviceList = light.deviceList;
                                this.getAlldev('PLUG').then(
                                    (plug: any) => {
                                        this.plugDeviceList = plug.deviceList;
                                        this.getAlldev('SK').then(
                                            (sk: any) => {
                                                this.skDeviceList = sk.deviceList;
                                                this.getAlldev('CAMERA').then(
                                                    (camera: any) => {
                                                        this.cameraDeviceList = camera.deviceList;
                                                        this.selectedFloor = this.getSelectedObject(this.floorDropdownList, this.selectedFloorId);
                                                        if (this.selectedFloor !== null) {
                                                            this.reRenderMap(this.selectedFloor);
                                                        }
                                                    }
                                                )
                                            }
                                        )
                                    }
                                )
                            }
                        )
                    }
                )
            }
        )
    }

    /**
     @Desc render map using selected floor is
     @Param selected floor
     @return
     */
    reRenderMap(selectedFloor) {
        this.mapPresent = true;
        this.statusService.getFileDetail(`/rsb-oms/oms/getFile/` + selectedFloor.levelMap).subscribe(res => {
            const contentTypeSVG = 'image/svg+xml';
            const b64Svg = JSON.parse(res._body).data;
            const blob = this.svgService.b64toBlob(b64Svg, contentTypeSVG, 512);
            this.svgSourceUrl = null;
            this.svgSourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
            if(!this.flag){
                this.flag=true;
                this.activateListeners();
            }

        }, (error: any) => {
            // this.snackBar.open('Error occured while getting Map', 'Ok', {
            //   duration: 5000,
            //   extraClasses: ['error-snackbar']
            // });
        });
    }

    /**
     @Desc active mouse wheel listeners for zoom SVG
     @Param
     @return
     */
    activateListeners() {
        let self = this;
        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        console.log('mmmmmmmmmmmmmmmmmmmmmmmmm', svg_floor_map);

        svg_floor_map.addEventListener('load', function (event) {

            //if (!this.svgActivated) {
            //Enable the Zoom after the complete loading of the Map
            self.enableZoom();
            //Call API to get the area list and render in the UI
            self.svgActivated = true;
            //}
            self.getAllAreas(false);

        });
    }

    /**
     @Desc enable zooming for SVG map
     @Param
     @return
     */
    enableZoom() {
        const self = this;
        setTimeout(function () {
            try {
                self.panZoom = svgPanZoom('#svg_floor_map', {
                    zoomEnabled: true
                    , controlIconsEnabled: false
                    , fit: true
                    , center: 1
                    , initialZoom: 4
                });
            } catch (e) {
                console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', e);
            }
        }, 500);
    }

    /**
     @Desc zoom in using mouse wheel
     @Param
     @return
     */
    zoomInSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this.panZoom.zoomIn();
        }
    }

    /**
     @Desc zoom out using mouse wheel
     @Param
     @return
     */
    zoomOutSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this.panZoom.zoomOut();
        }
    }

    /**
     @Desc get back to normal size
     @Param
     @return
     */
    resetZoomSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this.panZoom.resetZoom();
        }
    }

    /**
     @Desc draw areas on SVG map
     @Param area object
     @return
     */
    drawAreasOnMap(areas: any) {
        let svg_floor_map: any = document.querySelector('#svg_floor_map');

        let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
        if (svgAreaMap != null) {
            let pathCoordinates: string;

            areas.forEach(area => {
                const manageAreaListLength = area.points.length;
                let firstPointX: any = 0;
                let firstPointY: any = 0;
                area.points.forEach((point, index) => {
                    firstPointX = firstPointX + point.x;
                    firstPointY = firstPointY + point.y;
                    let pathCoordinate = point.x + ' ' + point.y;
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
                newpath.setAttributeNS(null, 'fill', area.color ? area.color : 'lightgreen');
                newpath.setAttributeNS(null, 'stroke-width', '2');
                newpath.setAttributeNS(null, 'opacity', '.2');

                let svgTemp = this.getMyGNode(svgAreaMap);

                if (svgTemp !== null) {
                    svgTemp.appendChild(newpath);
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', firstPointX);
                    text.setAttribute('y', firstPointY);
                    text.setAttribute('fill', area.color ? area.color : '#000');
                    text.setAttribute('font-size', '7px');
                    text.setAttribute('font-family', 'Verdana');
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('alignment-baseline', 'middle');
                    if (this.appService.currentLang == 'en') {
                        text.textContent = area.name.map.en;
                    }
                    if (this.appService.currentLang == 'fa') {
                        text.textContent = area.name.map.fa;
                    }

                    svgTemp.append(text);
                }
                if (this.selectedAreaId !== 0) {
                    this.selectedArea = this.getSelectedObject(this.areaDropdownList, this.selectedAreaId);
                    if (this.selectedArea !== null) {
                        this.zoomInToParticularArea(this.selectedArea.points);
                    }
                }
            });
        }

        this.getInstallationPoints(areas);
    }

    /**
     @Desc draw device installation points on SVG map
     @Param area object
     @return
     */
    getInstallationPoints(areas: any) {
        this.installationPoints = [];
        let areaLength = areas.length;
        let responseCount = 0;
        let ipp = [];
        areas.forEach(area => {
            //Get the Device points by Area Id

            this
                .statusService
                .getInstallationPoints(area.id)
                .subscribe(res => {
                    if (res._body !== '') {
                        const ipList = JSON.parse(res._body);

                        ipList.forEach(ip => {
                            //console.log(ip);
                            ipp = ip.devices;
                            let ipItem = new InstallationPointListItem(ip);
                            if (ipItem !== null) {
                                ipItem.deviceColor = this.masterDataService.getDevicePointColor(ipItem.deviceType);
                                ipItem.deviceCode = this.masterDataService.getDevicePointCode(ipItem.deviceType);
                                ipItem.iconUrl = this.masterDataService.getDevicePointIconUrl(ipItem.deviceType);
                                if (ipp && ipp[0]) {
                                    ipItem.installationLabel = ipp[0].installationLabel;
                                    ipItem.deviceId = ipp[0].deviceId;
                                }

                                this.installationPoints.push(ipItem);
                            }
                        });
                    }
                    responseCount++;
                    if (areaLength === responseCount && this.installationPoints.length > 0) {
                        this.renderInstallationPoints(this.installationPoints, ipp);
                    }
                }, (error: any) => {
                    // this
                    //   .snackBar
                    //   .open('Error occured while retriving Access list', 'Ok', {
                    //     duration: 5000,
                    //     extraClasses: ['error-snackbar']
                    //   });
                });
        });
    }

    /**
     @Desc select color for installed device status
     @Param
     @return
     */
    getColor(listName, ip: any) {
        let list=[];
        switch (listName){
            case 'sfms':{
                list=this.sfmsDeviceList;
                break;
            }
            case 'camera':{
                list=this.cameraDeviceList;
                break;
            }
            case 'plug':{
                list=this.plugDeviceList;
                break;
            }
            case 'light':{
                list=this.lightnigDeviceList;
                break;
            }
            case 'hvac':{
                list=this.hvacDeviceList;
                break;
            }
            case 'sk':{
                list=this.skDeviceList;
                break;
            }
        }

        let color: string = 'green';
        let deviceNotFound = true;
        for(let dev of list){
            if (dev.deviceid == ip.deviceId) {
                deviceNotFound = false;
                try {
                    if (dev.deviceworkingstate != 0 && listName!='hvac') {
                        color = 'red';
                    }

                    if (dev.devicestatus != 1) {
                        color = 'gray';
                    }


                } catch (e) {

                }
            }

        }
        if (deviceNotFound) {
            color = 'grey';
        }

        return color;
    }

    /**
     @Desc render installation points on map
     @Param installation points list
     @return
     */
    renderInstallationPoints(installationPoints, ipp) {
        //Aneesh
        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        while (svg_floor_map.firstChild) {
            svg_floor_map.removeChild(svg_floor_map.firstChild);
        }
        let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
        if (svgAreaMap != null) {
            let svgTemp: any = this.getMyGNode(svgAreaMap);

            let count = 1;
            installationPoints.forEach(ip => {
                // console.log(ip);
                let color = 'green';
                if (ip.deviceType == 'Access Control' || ip.deviceType == 'Water Leakage' || ip.deviceType == 'Smart Switch'
                    || ip.deviceType == 'Smoke Detector' || ip.deviceType == 'Window Contact' || ip.deviceType == 'Siren' || ip.deviceType == 'PARKING SENSOR') {
                    color = this.getColor('sfms', ip);
                }
                if (ip.deviceType == 'Camera') {
                    color = this.getColor('camera', ip);
                }
                if (ip.deviceType == 'Smart Plug') {
                    color = this.getColor('plug', ip);
                }
                if (ip.deviceType == 'Thermostat') {
                    color = this.getColor('hvac', ip);
                }
                if (ip.deviceType == 'LIGHTING') {
                    color = this.getColor('light', ip);
                }
                if (ip.deviceType == 'Display' || ip.deviceType == 'Kiosk') {
                    color = this.getColor('sk', ip);
                }
                let circleOne = this.makeSVGElement(ip, 'circle', {
                    cx: ip.coordinate.x,
                    cy: ip.coordinate.y,
                    r: '0.5%',
                    stroke: '#ccc',
                    'stroke-width': 0.5,
                    'class': 'ip_circle_class',
                    fill: "transparent",
                    'id': 'circle_' + ip.id
                });


                var SVG_NS = 'http://www.w3.org/2000/svg';
                var XLink_NS = 'http://www.w3.org/1999/xlink';
                let imageX= (parseFloat(ip.coordinate.x)-3.5).toString();
                let imageY= (parseFloat(ip.coordinate.y)-3.5).toString();
                var image = document.createElementNS(SVG_NS, 'image');
                image.setAttribute('height', '7px');
                image.setAttribute('width', '7px');
                image.setAttribute('x',imageX);
                image.setAttribute('y',imageY);
                image.setAttribute('id','image_'+ip.id);
                image.setAttributeNS(XLink_NS, 'xlink:href', environment.deviceIconUrl+'/assets/images/device-icon/'+ip.iconUrl);
                // let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                // text.setAttribute('x', ip.coordinate.x);
                // text.setAttribute('y', ip.coordinate.y);
                // text.setAttribute('class', 'ip_text_class');
                // text.setAttribute('fill', '#000');
                // text.setAttribute('font-size', '3px');
                // text.setAttribute('font-family', 'tw-regular');
                // text.setAttribute('text-anchor', 'middle');
                // text.textContent = ip.deviceCode;
                // if (svgTemp.nodeName == '#text') {
                //     svgTemp = svgTemp.parentNode;
                // }
                if (svgTemp !== null) {
                    svgTemp.append(image);
                    svgTemp.append(circleOne);


                }
                let circleTwo = this.makeSVGElement(ip, 'circle', {
                    cx: ip.coordinate.x,
                    cy: ip.coordinate.y,
                    r: '0.5%',
                    stroke: color,
                    'stroke-width': 0.3,
                    'class': 'ip_circle_class innerCircle',
                    fill: color,
                    'opacity': '.5'
                });

                let animationTwo = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animationTwo.setAttribute('attributeName', 'r');
                animationTwo.setAttribute('begin', '0s');
                animationTwo.setAttribute('dur', '1s');
                animationTwo.setAttribute('repeatCount', 'indefinite');
                animationTwo.setAttribute('from', '0.5%');
                animationTwo.setAttribute('to', '0.8%');

                circleTwo.appendChild(animationTwo);

                let circleThree = this.makeSVGElement(ip, 'circle', {
                    cx: ip.coordinate.x,
                    cy: ip.coordinate.y,
                    r: '0.5%',
                    stroke: color,
                    'stroke-width': 0.3,
                    'class': 'ip_circle_class innerCircle',
                    fill: color,
                    'opacity': '.3'
                });

                let animationThree = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animationThree.setAttribute('attributeName', 'r');
                animationThree.setAttribute('begin', '0s');
                animationThree.setAttribute('dur', '1s');
                animationThree.setAttribute('repeatCount', 'indefinite');
                animationThree.setAttribute('from', '0.5%');
                animationThree.setAttribute('to', '1.1%');
                circleThree.appendChild(animationThree);


                let circleFour = this.makeSVGElement(ip, 'circle', {
                    cx: ip.coordinate.x,
                    cy: ip.coordinate.y,
                    r: '0.5%',
                    stroke: color,
                    'stroke-width': 0.3,
                    'class': 'ip_circle_class innerCircle',
                    fill: color,
                    'opacity': '.1'
                });

                let animationFour = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                animationFour.setAttribute('attributeName', 'r');
                animationFour.setAttribute('begin', '0s');
                animationFour.setAttribute('dur', '1s');
                animationFour.setAttribute('repeatCount', 'indefinite');
                animationFour.setAttribute('from', '0.5%');
                animationFour.setAttribute('to', '1.5%');
                circleFour.appendChild(animationFour);

                if (svgTemp !== null) {
                    svgTemp.append(circleFour);
                    svgTemp.append(circleThree);
                    svgTemp.append(circleTwo);
                    svgTemp.append(circleOne);
                }

                count++;
            });
        }
    }

    /**
     @Desc create new SVG element to show map
     @Param  tag:circle , attrs: config
     @return
     */
    makeSVGElement(ip, tag, attrs) {
        let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (let k in attrs) {
            el.setAttribute(k, attrs[k]);
        }
        let clickPos;
        let self = this;
        el.addEventListener('click', function (e) {
            // clickPos = e;
            //   console.log(ip);
        });
        return el;
    }

    updateActiveAlarmClass() {
        //ems-device-aa-status
        //invert-brd
    }

    /**
     @Desc get selected device
     @Param floor list , floor id
     @return
     */
    getSelectedObject(list: any, id: any) {
        let selectedObject: any = null;
        list.forEach(item => {
            if (item.id == id) {
                selectedObject = item;
            }
        });
        return selectedObject;
    }

    /**
     @Desc zoom in to show selected area from drop down search
     @Param area points list
     @return
     */
    zoomInToParticularArea(areaPoints) {
        let self = this;
        setTimeout(function () {
            if (self.panZoom) {
                self.panZoom.resetZoom();
                let centroid = self.svgService.calculateCentroid(areaPoints);
                const sizes = self.panZoom.getSizes();
                let newValues = self.svgService.convertSVGPointToZoomPoint(centroid, self.panZoom.getPan(), sizes.realZoom);
                self.panZoom.zoomAtPointBy(1, {x: newValues.x, y: newValues.y});
                self.panZoom.zoomAtPointBy(2, {x: newValues.x, y: newValues.y});
                self.panZoom.zoomAtPointBy(2, {x: newValues.x, y: newValues.y});
            }
        }, 1000);
    }

    /**
     @Desc get my g nodes
     @Param
     @return
     */
    getMyGNode(svgAreaMap: XMLDocument) {
        let gNode: any = null;
        let i;
        const childNodesLength = svgAreaMap.childNodes.length;
        for (i = 0; i < childNodesLength; i++) {
            if (svgAreaMap.childNodes[i].nodeName === 'svg') {
                if (svgAreaMap.childNodes[i].firstChild.nodeName !== 'g') {
                    gNode = svgAreaMap.childNodes[i].firstChild.parentNode;
                } else if (svgAreaMap.childNodes[i].firstChild.nodeName === 'g') {
                    gNode = svgAreaMap.childNodes[i].firstChild;
                }
            }
        }
        return gNode;
    }

}
