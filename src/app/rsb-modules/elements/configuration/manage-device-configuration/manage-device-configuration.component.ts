import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material';
import {SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {ConfirmModalComponent, LayoutComponent} from '../../../../common';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import {InstallationPointListItem, ManageArea, PointDetail} from '../configuration';
import {AppService} from '../../../../app.service';
import {ConfigurationService} from '../configuration.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';

declare var svgPanZoom: any;
declare var $: any;
declare var Hammer: any;

@Component({
    selector: 'app-manage-device-configuration',
    templateUrl: './manage-device-configuration.component.html',
    styleUrls: ['./manage-device-configuration.component.scss']
})
export class ManageDeviceConfigurationComponent implements OnInit {
    public flag=false;
    public tipActive: boolean = false;
    public configList: Array<any> = [];
    public tipX: number;
    public tipY: number;
    public fileExist: boolean = false;
    public fileExist1: boolean = false;
    public areaExist: boolean = false;

    public selectedArea: any;
    public point: PointDetail = new PointDetail({});
    public manageDeviceList: Array<any> = [];
    public campusDropdownList: Array<ManageArea> = [];
    public buildingDropdownList: Array<ManageArea> = [];
    public floorDropdownList: Array<ManageArea> = [];
    public areaDropdownList: Array<any> = [];
    public selectedCampusId: any = 0;
    public selectedBuildingId: any = 0;
    public selectedFloorId: any = 0;
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
    private device_id: any;

    // sendHeader(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.subsidiary !== null) {
    //     this
    //       .appService
    //       .sendHeader(this.subsidiary.name, 'element management', 'Map device to node', '');
    //   }

    constructor(
        public dialog: MatDialog,
        public appService: AppService,
        public masterDataService: MasterDataService,
        public eavWrapperService: EavWrapperService,
        public layoutComponent: LayoutComponent,
        public configurationService: ConfigurationService,
        private sanitizer: DomSanitizer,
        public svgService: SvgService,
        public sessionStorageService: SessionStorageService,
        public translate: TranslateService,
        private router:Router) {
        // router.events.subscribe(
        //     (val) =>{
        //         console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu",val);
        //     })
    }

    // }
    /**
     @Desc Send message to subscribers via observable subject
     @Param
     @return
     */
    sendHeaderWithLogo(): void {

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
            this.translate.get('sub-header.configuration', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.map-device-to-node', this.appService.currentLang).subscribe(
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
     @Desc enabling zoom for SVG pic
     @Param
     @return
     */

    ngAfterViewInit() {

        this.getAllCampus();
    }

    ngOnInit() {
        this.flag=false;
        this.appService.deviceData.subscribe(
            (device: any) => {
                this.configList[0].installation_label = device.installationLabel;
                this.configList[0].ip_address = device.ipAddress;
                // this.configList[0].type_name
                // this.configList[0].sub_type_name
                // this.configList[0].brand_name
                // this.configList[0].model_name
                // this.configList[0].serial_no
            }
        )
        let self = this;
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.observeSliderClick();
        $('.svg-area-map-container').on('click', function (e) {
            self.tipActive = false;
        });
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )

    }

    /**
     @Desc trigger an event to show selected point details
     @Param
     @return
     */
    editConfig() {

        this.getClickedPointDetail(this.deviceId);
        this
            .sessionStorageService
            .store('deviceSliderclicked', true);
        this.tipActive = false;

    }

    /**
     @Desc open delete dialog box for deleting config
     @Param
     @return
     */
    deleteConfig() {

        let deleteUrl = '/rsb-oms/oms/uninstallDevice?deviceId=' + this.device_id;

        this.layoutComponent.addClass();

        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '640px',
            height: 'auto',
            data: deleteUrl
        });

        dialogRef.afterClosed().subscribe(result => {
            this.layoutComponent.removeClass();
            this.getFileDetail();
            this.tipActive=false;
        });


        //  // this.getClickedPointDetail(this.deviceId);
        //  let deviceReq ="{\"id\": "+this.device_id+" , \"points\" :{ \"id\" : \"1\"} }";

        //   this
        //     .masterDataService
        //     .saveData(`/rsb-oms/oms/uninstallDevice`,deviceReq)
        //     .subscribe(res => {
        //      alert ("success");

        //     }, (error: any) => {
        //       this
        //         .snackBar
        //         .open('Error occured while removing  device', 'Ok', {
        //           duration: 5000,
        //           extraClasses: ['error-snackbar']
        //         });
        //     });

    }

    /**
     @Desc showing device details
     @Param
     @return
     */

    observeSliderClick() {

        this
            .sessionStorageService
            .observe('deviceSliderclicked')
            .subscribe((clickedRes) => {
                this.getClickedPointDetail(this.deviceId);
                this.addDeviceDetail = clickedRes;
                if (this.addDeviceDetail) {
                    if(this.configList.length>0){
                        this.deviceData = {
                            'applianceId':this.configList[0].appliance_type_id,
                            'deviceId': this.deviceId,
                            'point': this.point,
                            'index': this.pointIndex
                        };
                    }else{
                        this.deviceData = {
                            'applianceId':0,
                            'deviceId': this.deviceId,
                            'point': this.point,
                            'index': this.pointIndex
                        };
                    }

                    console.log("11111111111111111111",this.deviceData);
                }else {
                    this.getFileDetail();
                }

            });

    }

    /**
     @Desc getting selected point details
     @Param
     @return
     */
    getClickedPointDetail(id) {
        this
            .manageDeviceList
            .forEach((element, index) => {
                if (element.id == id) {
                    ///console.log("qqqqqqqqqqqqqqqqqqqqq",element);
                    this.point = element;
                    this.pointIndex = index;
                }
            });
    }

    /**
     @Desc get all campus list to fill filter drop down
     @Param
     @return
     */
    getAllCampus() {
        this.campusDropdownList.splice(0, this.campusDropdownList.length);
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
     @Desc zoom in SVG pic using mouse wheel
     @Param mouse event
     @return
     */
    zoomInSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this
                .panZoom
                .zoomIn();
        }
    }

    /**
     @Desc zoom out SVG pic using mouse wheel
     @Param mouse event
     @return
     */
    zoomOutSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this
                .panZoom
                .zoomOut();
        }
    }

    /**
     @Desc show te standard size of SVG pic
     @Param click event
     @return
     */
    resetZoomSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this
                .panZoom
                .resetZoom();
        }
    }

    /**
     @Desc get all building list to fill drop down
     @Param
     @return
     */
    getAllBuildings(event) {

        if (this.selectedCampusId === 0) {
            return;
        }
        this.buildingDropdownList.splice(0, this.buildingDropdownList.length);
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
     @Desc get all floors list to fill drop down
     @Param
     @return
     */
    getAllFloors() {

        if (this.selectedBuildingId === 0) {
            return;
        }
        this.floorDropdownList.splice(0, this.floorDropdownList.length);
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
     @Desc get all areas list to fill drop down
     @Param
     @return
     */
    getAllAreas(event) {
        ///console.log("777777777777777777777777");
        if (this.selectedFloorId === 0) {
            return;
        }

        this
            .masterDataService
            .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedFloorId.id)
            .subscribe(res => {
                this.areaDropdownList.splice(0, this.areaDropdownList.length);
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

    /**
     @Desc get all device installation point list to fill drop down
     @Param
     @return
     */
    getInstallationPoints(area) {
       /// console.log("ppppppppppppppppppppppppppppppp");
        this.manageDeviceList.splice(0, this.manageDeviceList.length);

        // Get the Device points by Area Id
        this
            .configurationService
            .getDeviceList(`/rsb-oms/oms/getPointsByAreaId?id=` + area.id)
            .subscribe(res => {
                if (res._body !== '') {
                    const ipList = JSON.parse(res._body);
                    ipList.forEach(ip => {
                        let ipItem = new InstallationPointListItem(ip);
                        if (ipItem !== null) {
                            ipItem.deviceColor = this.masterDataService.getDevicePointColor(ipItem.deviceType);
                            ipItem.deviceCode = this.masterDataService.getDevicePointCode(ipItem.deviceType);
                            ipItem.iconUrl = this.masterDataService.getDevicePointIconUrl(ipItem.deviceType);
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

    /**
     @Desc get all config list to fill drop down
     @Param
     @return
     */
    getConfigList(event) {


        this.configList.splice(0, this.configList.length);
        this.deviceId = $(event.target).attr('id');
        this
            .masterDataService
            .getCampusDropdownList(`/rsb-oms/oms/getDevicesByPointId?pointId=` + this.deviceId)
            .subscribe(res => {
                this.configList = JSON.parse(res._body);
                console.log("222222222222222222222222222",this.configList);
                if (this.configList[0])
                    this.device_id = this.configList[0].device_id;
                if (this.configList.length > 0) {
                    this.getClickedPointDetail(this.deviceId);
                    this.tipActive = true;
                    this.deviceData = {
                        'applianceId':this.configList[0].appliance_type_id,
                        'deviceId': this.deviceId,
                        'point': this.point,
                        'index': this.pointIndex
                    };
                    this.tipX = event.clientX + 34;
                    this.tipY = event.clientY - 103;
                } else {
                    this.getClickedPointDetail(this.deviceId);
                    this.tipActive=false;
                    this.deviceData = {
                        'applianceId':0,
                        'deviceId': this.deviceId,
                        'point': this.point,
                        'index': this.pointIndex
                    };
                    this.tipX = event.clientX + 34;
                    this.tipY = event.clientY - 103;
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

    /**
     @Desc create svg element
     @Param tag:circle , attrs = attributes
     @return
     */
    makeSVGElement(tag, attrs) {
      //  console.log('S-makeSVGElement');
        const self = this;
        let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (let k in attrs) {
            el.setAttribute(k, attrs[k]);
        }
        el.addEventListener('click', function (event) {
                self.tipActive = false;
                self.getConfigList(event);
            });
      //  console.log('S-makeSVGElement-el', el);
        return el;
    }

    /**
     @Desc make all installation points appear on SVG pic
     @Param
     @return
     */
    renderInstallationPoints() {
       // console.log('S-renderInstallationPoints');
        //Aneesh
        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();

         if (svgAreaMap != null) {
             let svgTemp: any = this.getMyGNode(svgAreaMap);
            this
                .manageDeviceList
                .forEach((ip, index) => {
                    var SVG_NS = 'http://www.w3.org/2000/svg';
                    var XLink_NS = 'http://www.w3.org/1999/xlink';
                    let imageX= (parseFloat(ip.coordinate.x)-2.8).toString();
                    let imageY= (parseFloat(ip.coordinate.y)-2.8).toString();
                    var image = document.createElementNS(SVG_NS, 'image');
                    image.setAttribute('height', '5.6px');
                    image.setAttribute('width', '5.6px');
                    image.setAttribute('x',imageX);
                    image.setAttribute('y',imageY);
                    image.setAttribute('id','image_'+ip.id);
                    image.setAttributeNS(XLink_NS, 'xlink:href', environment.deviceIconUrl+'/assets/images/device-icon/'+ip.iconUrl);
                    const circle = this.makeSVGElement('circle', {
                        cx: ip.coordinate.x,
                        cy: ip.coordinate.y,
                        r: 3,
                        stroke: '#ccc',
                        'stroke-width': 0.5,
                        'class': 'ip_circle_class',
                        'id': ip.id,
                        'fill':'transparent'
                    });
                    // const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    // text.setAttribute('x', ip.coordinate.x);
                    // text.setAttribute('y', (parseFloat(ip.coordinate.y)-2).toString());
                    // text.setAttribute('class', 'ip_text_class');
                    // text.setAttribute('fill', '#01011a');
                    // text.setAttribute('font-size', '2.4px');
                    // text.setAttribute('font-family', 'tw-regular');
                    // text.setAttribute('text-anchor', 'middle');
                    // text.textContent = ip.deviceName;
                    // if (svgTemp.nodeName == '#text') {
                    //     svgTemp = svgTemp.parentNode;
                    // }

                    if (svgTemp !== null) {
                        svgTemp.append(image);
                        svgTemp.append(circle);

                        //svgTemp.append(text);

                    }
                });
         }
    }
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
    /**
     @Desc draw all areas on SVG map
     @Param
     @return
     */
    drawAreasOnMap() {
        // debugger;
        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
       // console.log('11111111111111111111111111111111',svgAreaMap);
         if (svgAreaMap != null) {
            let pathCoordinates: string;
            let zoomInCoordinate: any = null;
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
                  //  console.log('arrrrrrrrrrrrrrrrr', area);
                    let newpath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    newpath.setAttributeNS(null, 'd', pathCoordinates);
                    newpath.setAttributeNS(null, 'class', 'draggable');
                    newpath.setAttributeNS(null, 'id', 'a_' + area.id);
                    newpath.setAttributeNS(null, 'fill', area.color ? area.color : 'lightgreen');
                    newpath.setAttributeNS(null, 'stroke-width', '2');
                    newpath.setAttributeNS(null, 'opacity', '.7');
                    let svgTemp = this.getMyGNode(svgAreaMap);

                   // console.log('vvvvvvvvvvvvvvvvvvvvvvv', svgAreaMap);

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


                });
         }
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

    /**
     @Desc get config file details
     @Param data: selected floor Id
     @return
     */
    getFileDetail() {
        this.fileExist1 = false;
        this.fileExist = false;
       // console.log('S-getFileDetail',this.selectedFloorId);
        if (this.selectedFloorId == 0 || this.selectedFloorId.id == undefined) {
            return;
        }
        this.fileExist1 = true;
        this
            .configurationService
            .getFileDetail(`/rsb-oms/oms/getFile/` + this.selectedFloorId.levelMap)
            .subscribe(res => {
                //debugger;
               // console.log('....................................', res);
                const contentTypeSVG = 'image/svg+xml';
                const b64Svg = JSON
                    .parse(res._body)
                    .data;
              //  console.log('///////////////////////////////', b64Svg);
                const blob = this.b64toBlob(b64Svg, contentTypeSVG, 512);
                this.svgSourceUrl = this
                    .sanitizer
                    .bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));

                let svg_floor_map: any = document.querySelector('#svg_floor_map');
               // console.log('||||||||||||||||||||||||', svg_floor_map);
                //this.enableZoom();
                const self = this;
                this.fileExist = true;
                if(!this.flag) {
                    this.flag=true;
                    this.activateListeners();
                }
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured while getting Map', 'Ok', {
                //     duration: 5000,
                //     extraClasses: ['error-snackbar']
                //   });
            });
        //console.log('F-getFileDetail');
    }

    /**
     @Desc activate mouse wheel listeners for zoom
     @Param
     @return
     */
    activateListeners() {
        //debugger;
        //console.log('S-activateListeners');
        let self = this;

        let svg_floor_map: any = document.querySelector('#svg_floor_map');
       // console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', svg_floor_map);


                 svg_floor_map.addEventListener('load', function (event) {
                     //debugger;
                     if(svg_floor_map.getSVGDocument()!=null){
                         let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();

                         //this.flag=true;
                         //Enable the Zoom after the complete loading of the Map
                         self.enableZoom();

                         //Call API to get the area list and render in the UI
                         self.getAllAreas(event);


                         console.log('000000000000000000000000000000000', svgAreaMap);

                         svgAreaMap.addEventListener('click', function (event) {
                             self.tipActive = false;
                         });
                     }


                 });




      //  console.log('F-activateListeners');
    }
    enableZoom() {
        //debugger;
        let svg_floor_map: any = document.querySelector('#svg_floor_map');
       // console.log('S-activateListeners2', svg_floor_map);

        const self = this;
    //    console.log("[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]",svgPanZoom);
        setTimeout(function () {
            //debugger;
            try{
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
            }catch (e) {
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",e);
            }
        }, 1000);

    }
    /**
     @Desc zoom to selected area from drop down list
     @Param
     @return
     */
    zoomInToParticularArea(areaPoints) {
      //  console.log('S-zoomInToParticularArea');
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
       // console.log('F-zoomInToParticularArea');

    }

    /**
     @Desc convert base 64 to blob data
     @Param based 64 , convert type:image/svg+xml , sliceSize: 512
     @return
     */
    b64toBlob(b64Data: any, contentType: string, sliceSize: number) {
       // console.log('S-b64toBlob');
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
       // console.log('F-b64toBlob');
        return blob;
    }

    /**
     @Desc showing area on map
     @Param area obj
     @return
     */
    showArea(area, event) {
       // console.log('S-showArea');
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
      //  console.log('F-showArea');
    }

}
