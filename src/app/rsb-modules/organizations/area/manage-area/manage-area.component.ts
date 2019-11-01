import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {ConfirmModalComponent, LayoutComponent} from '../../../../common';
/*Import the Interface for the area*/
import {InstallationPoint, InstallationPointListItem, ManageArea, MapPoint, PrepareAccess, PrepareArea} from '../area';
/*Import the Service file required for area management */
import {AreaService} from '../area.service';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils/services';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';

/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
    selector: 'app-manage-area',
    templateUrl: './manage-area.component.html',
    styleUrls: ['./manage-area.component.scss'],
    // animations: [routerTransition()],
    // host: { '[@routerTransition]': '' }
})
export class ManageAreaComponent implements OnInit, AfterViewInit {
    public pointName;
    string;
    public pointDesc: string;
    public devicePointId: string;
    public tipActive: boolean = false;
    public tipX: number;
    public tipY: number;
    public parentId: number;
    public addClicked = false; // Flag for add/edit to manage navigation for area creation
    public addAccess = false; // Flag for add device points
    public deleteState = false; // Flag for the Delete State
    public isCloseClicked = false;
    public svgSourceUrl: any;
    public panZoom: any;
    public selectedPoints: MapPoint[] = [];
    public manageAreaList: Array<any> = [];
    public manageDeviceList: Array<InstallationPointListItem> = [];
    public prepareArea: any = new PrepareArea({});
    public prepareAccess: any = new PrepareAccess();
    public selectedArea: any;
    public areaToDelete: any;
    public installationPointCode: string = '';
    public mouse = {x: 0, y: 0, down: false}
    public moveX;
    public moveY;
    public lastMoveX: number = 0;
    public lastMoveY: number = 0;
    public isDragClicked = false;
    public deviceList: Array<any> = [];
    public editClicked: boolean = false;
    public editedAreaPoints: any;
    public observeValue: any;
    @SessionStorage('level')
    public level;

    public scrollbarOptions = {
        axis: 'y', theme: 'minimal-dark', mouseWheel: {
            enable: true,
        }, contentTouchScroll: 1000, scrollInertia: 0, mouseWheelPixels: 1000
    };
    private enableThePointer: Boolean = false;
    private pathindex = 1;

    constructor(
        public appService: AppService,
        private storage: LocalStorageService,
        private areaService: AreaService,
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute,
        private router: Router,
        public eavWrapperService: EavWrapperService,
        public masterDataService: MasterDataService,
        private layoutComponent: LayoutComponent,
        public dialog: MatDialog,
        public svgService: SvgService,
        public translate: TranslateService
    ) {
        this.route.params.subscribe(params => {
            this.parentId = this.level.id;
        });
    }

    // sendHeader(): void {
    //   // send message to subscribers via observable subject
    //   if (this.level !== null) {
    //     this.appService.sendHeader(this.level.levelName, 'area', 'Manage Area / Node', 'Add / Edit area');
    //   }
    // }
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject

        if (this.level !== null) {
            let subHeader = '';
            let pageDetails = '';
            let routeName = '';
            let levelName='';
            if (this.appService.currentLang == 'en') {
                levelName =  this.level.levelName.map.en;
            }
            if (this.appService.currentLang == 'fa') {
                levelName =  this.level.levelName.map.fa;
            }

            this.translate.get('sub-header.area', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.manage-area-node', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;

                            this.translate.get('route-name.add-edit-area', this.appService.currentLang).subscribe(
                                (routeNameT) => {
                                    if(this.appService.spaceIsAvailable('AREA')){
                                        routeName = routeNameT;
                                    }

                                    this
                                        .appService
                                        .sendHeaderWithLogo(levelName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/OMS.png');
                                }
                            )

                        }
                    );
                }
            );
        }

    }

    setDropdown() {
        if (this.selectedPoints.length > 2) {
            this.isCloseClicked = true;
        } else {
            // this.snackBar.open("Please select points and click next", 'Okay', { duration: 3000 });
            this.enableThePointer = true;
        }
    }

    setAccessPointDropdown() {
        if (this.selectedPoints.length === 1) {
            this.isCloseClicked = true;
            this.getDeviceType();
        } else {
            // this.snackBar.open("Please select one points and click next", 'Okay', { duration: 3000 });
            this.enableThePointer = true;
        }
    }

    startCreatingThePoints() {
        // this.snackBar.open("Click to add points on map", 'Okay', { duration: 3000 });
        this.enableThePointer = true;
    }

    cancelCreateArea() {
        this.loadMapByLevel();
        $('.add-edit-area-container').css('display', 'none');
        this.selectedPoints = [];
        this.isCloseClicked = false;
        this.addClicked = false;
        // this.storage.store('addClicked', 'false');
        this.addAccess = false;
        this.enableThePointer = false;
        this.deleteState = false;
        this.editClicked = false;
        this.storage.store('addClicked', false);
    }

    makeSVGElement(tag, attrs) {
        let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (let k in attrs) {
            el.setAttribute(k, attrs[k]);
        }
        let clickPos;
        let self = this;

        //drag drop Gaurav GRIPM
        el.addEventListener('click', function (e) {
            self.devicePointId = $(this).attr('id');
            // self.devicePointId = e.currentTarget.id;
            self.getPointsDetail(self.devicePointId);
            self.tipX = e.clientX + 38;
            self.tipY = e.clientY - 50;
            // self.panZoom.disableZoom();
            // self.panZoom.disablePan();
            // clickPos = e;
        });
        // el.addEventListener('mousedown', function (e) {
        //   self.mouseMove(e, clickPos);
        // });
        // el.addEventListener('mouseup', function (e) {
        //   self.mouseEnd();
        // });

        return el;
    }

    getDeviceType() {
        this.masterDataService.getDeviceType(`/rsb-oms/oms/getAllDeviceType`).subscribe((data) => {
            this.deviceList = JSON.parse(data._body);
        }, (error) => {
            console.log(error);
        });
    }

    mouseEnd() {
        this.lastMoveX = this.moveX;
        this.lastMoveY = this.moveY;
    }

    mouseMove(evt, clickPos) {
        evt.preventDefault();

        if (this.lastMoveX == undefined) {
            this.lastMoveX = 0;
        }
        if (this.lastMoveY == undefined) {
            this.lastMoveY = 0;
        }
        let clickX = clickPos.clientX;
        let clickY = clickPos.clientY;
        this.moveX = this.lastMoveX + (evt.clientX - clickX);
        this.moveY = this.lastMoveY + (evt.clientY - clickY);

        evt.target.setAttribute('transform', 'translate(' + this.moveX + ',' + this.moveY + ')');
        this.lastMoveX = this.moveX;
        this.lastMoveY = this.moveY;
    }

    //End of drag drop Gaurav GRIPM
    startGettingTheCoOrdiantes(event) {
        this.editClicked = true;
    }

    cursorPoint(event) {
        let pt = event.target.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        return pt.matrixTransform(event.target.getScreenCTM().inverse());
    }

    // On click of the or parent wrapper get the x- and y co-ordiantes
    getTheCordinates(event) {

        if (this.enableThePointer && this.addAccess && this.selectedPoints.length === 1 && !this.addClicked) {
            // this.snackBar.open("Please click next", 'Okay', { duration: 3000 });
            this.enableThePointer = false;
        } else if (this.enableThePointer) {

            const pan = this.panZoom.getPan();
            const sizes = this.panZoom.getSizes();
            const zoom = sizes.realZoom;

            let xa, ya, pta;
            pta = this.cursorPoint(event);

            xa = pta.x;
            ya = pta.y;

            xa = (xa - pan.x) / zoom;
            ya = (ya - pan.y) / zoom;

            let svg_floor_map: any = document.querySelector('#svg_floor_map');
            let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
            let svgTemp: any = this.getMyGNode(svgAreaMap);

            let radius = 2;
            let strokewidth = 1;
            if (this.addAccess) {
                radius = 2;
                strokewidth = 1;
            }
            const circle = this.makeSVGElement('circle', {
                cx: xa,
                cy: ya,
                r: radius,
                stroke: 'grey',
                'stroke-width': strokewidth,
                fill: 'red',
                class: 'temp_points'
            });

            if (svgTemp !== null) {
                svgTemp.appendChild(circle);
            }

            const data = {
                x: xa,
                y: ya
            };

            this.selectedPoints.push(new MapPoint(data));

        } else if ($(event.target).hasClass('draggable')) {
            // Triggering the path
            // this
            //   .snackBar
            //   .open('Area ' + event.target.id + ' clicked', 'Okay', { duration: 3000 });
        }
    }

    createNewInstallationPoint() {
        this.addAccess = true;
        this.removeArea(this.selectedArea);
        this.drawSingleArea(this.selectedArea, 'STROKE');
    }

    // function to draw path
    drawArea(data, mode) {
        this.prepareArea.color = $('input[name=\'areaColor\']:checked').val();
        this.enableThePointer = false;
        let pathCoordinates: string = '';
        this.prepareArea.points = this.selectedPoints;
        let selectedPointsLength = this.selectedPoints.length;
        this.selectedPoints.forEach((point, index) => {
            let pathCoordinate = point.x + ' ' + point.y;
            if (index === 0) {
                pathCoordinates = 'M' + pathCoordinate;
            } else {
                pathCoordinates += ' L' + pathCoordinate;
            }
        });

        pathCoordinates += ' Z';
        let newpath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        newpath.setAttributeNS(null, 'd', pathCoordinates);
        newpath.setAttributeNS(null, 'class', 'draggable');
        newpath.setAttributeNS(null, 'id', this.prepareArea.name);
        newpath.setAttributeNS(null, 'fill', this.prepareArea.color ? this.prepareArea.color : 'lightgreen');
        newpath.setAttributeNS(null, 'stroke-width', '2');
        newpath.setAttributeNS(null, 'opacity', '.4');
        newpath.setAttributeNS(null, 'id', 'temp_area');

        //Aneesh
        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
        let svgTemp: any = this.getMyGNode(svgAreaMap);

        if (svgTemp !== null) {
            svgTemp.appendChild(newpath);
        }

        this.removeSelectedPoints(); //TODO : Check the logic
        this.removeSelectedPoints();
        this.removeSelectedPoints();

        $('.add-edit-area-container').css('display', 'none');
        this.pathindex += 1;
        this.selectedPoints = [];
        this.isCloseClicked = false;

        // Make API call to create an Area
        this.createUpdateArea(this.prepareArea, mode);
    }

    drawDevicePoint() {
        this.enableThePointer = false;
        this.prepareAccess.points = this.selectedPoints;

        this.prepareAccess.accessColor = this.masterDataService.getDevicePointColor(this.prepareAccess.deviceType);
        this.prepareAccess.deviceCode = this.masterDataService.getDevicePointCode(this.prepareAccess.deviceType);

        const circle = this.makeSVGElement('circle', {
            cx: this.selectedPoints[0].x,
            cy: this.selectedPoints[0].y,
            r: 2,
            stroke: 'grey',
            'stroke-width': 1,
            fill: this.prepareAccess.accessColor
        });

        //Aneesh
        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
        let svgTemp: any = this.getMyGNode(svgAreaMap);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', this.selectedPoints[0].x);
        text.setAttribute('y', this.selectedPoints[0].y + 0.5);
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-size', '3px');
        text.setAttribute('font-family', 'tw-regular');
        text.setAttribute('text-anchor', 'middle');
        text.textContent = this.prepareAccess.deviceCode;

        if (svgTemp !== null) {
            svgTemp.append(circle);
            svgTemp.append(text);
        }

        $('.add-edit-area-container').css('display', 'none');
        this.pathindex += 1;
        this.selectedPoints = [];
        this.isCloseClicked = false;
        this.addAccess = false;
        this.createUpdateDevicePoint(this.prepareAccess, 'Add');
    }

    showArea(area, event) {
        $('.' + event.currentTarget.className).removeClass('active');
        $('#' + event.currentTarget.id).addClass('active');
        this.selectedArea = area;
        this.addClicked = false;
        this.storage.store('addClicked', false);
        this.addAccess = false;
        this.enableThePointer = false;
        this.deleteState = false;
        this.storage.store('addClicked', false);

        this.removeArea(this.selectedArea);
        this.drawSingleArea(this.selectedArea, 'FILL');

        //Call the API to get the Device points based on the area clicked.
        this.getInstallationPoints(area);

        // Focus on the area clicked
        if (area.points.length > 0) {
            this.zoomInToParticularArea(area.points);
        }
    }

    zoomInSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this.panZoom.zoomIn();
        }
    }

    zoomOutSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this.panZoom.zoomOut();
        }
    }

    resetZoomSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this.panZoom.resetZoom();
        }
    }

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

    // API Call to create the area
    createUpdateArea(areaData, mode) {
        let url;
        if (!mode) {
            url = '/rsb-oms/oms/createArea';
            delete areaData.id;
        } else {
            console.log(areaData);
            url = '/rsb-oms/oms/updateEntity';
            areaData.name = areaData.name.name;
            areaData.points = this.editedAreaPoints;
        }
        const levelObject = this.eavWrapperService.jsonToEav(areaData, 'AREA', this.parentId);
        this.areaService.createUpdateArea(url, levelObject).subscribe(res => {
            this.prepareArea = {};
            // this.snackBar.open('Successfully updated the Area list', 'Ok', {
            //   duration: 5000,
            //   extraClasses: ['success-snackbar']
            // });
            $('.add-edit-area-container').css('display', 'none');
            this.addClicked = false;
            this.evictcache();
            this.storage.store('addClicked', false);
        }, (error: any) => {
            // this.snackBar.open('Error updating the Area list', 'Ok', {
            //   duration: 5000,
            //   extraClasses: ['error-snackbar']
            // });
            this.storage.store('addClicked', false);
        });
    }

    // API Call to create the acess
    createUpdateDevicePoint(accessData, type) {
        if (type == 'Add') {
            delete accessData.id;
        }
        let installationPoint = new InstallationPoint(accessData, this.selectedArea);
        this.areaService.createUpdateArea('/rsb-oms/oms/savePoint', installationPoint).subscribe(res => {
            this.prepareArea = {};
            // this.snackBar.open('Successfully create the Installation Point', 'Ok', {
            //   duration: 5000,
            //   extraClasses: ['success-snackbar']
            // });
            this.prepareAccess = new PrepareAccess();
            $('.add-edit-area-container').css('display', 'none');
            this.addClicked = false;
            // this.storage.store('addClicked', 'false');
            this.getInstallationPoints(this.selectedArea);
            this.evictcache();
        }, (error: any) => {
            // this.snackBar.open('Error while create the installation Point', 'Ok', {
            //   duration: 5000,
            //   extraClasses: ['error-snackbar']
            // });
        });
    }

    renderInstallationPoints() {
        //Aneesh
        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
        if (svgAreaMap != null) {
            let svgTemp: any = this.getMyGNode(svgAreaMap);

            this.manageDeviceList.forEach((ip, index) => {
                const circle = this.makeSVGElement('circle', {
                    cx: ip.coordinate.x,
                    cy: ip.coordinate.y,
                    r: 3,
                    stroke: '#ccc',
                    'stroke-width': 0.5,
                    'class': 'ip_circle_class',
                    fill: ip.deviceColor,
                    'id': ip.id
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

                if (svgTemp !== null) {
                    svgTemp.append(circle);
                    svgTemp.append(text);
                }
            });
        }
    }

    getInstallationPoints(area) {
        this.manageDeviceList = [];

        //Get the Device points by Area Id
        this
            .areaService
            .getAreaList(`/rsb-oms/oms/getPointsByAreaId?id=` + area.id)
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
                        this.renderInstallationPoints();
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

    isAreaPresent(areaJson: any) {
        let isPresent = false;
        this.manageAreaList.forEach(singleArea => {
            if (singleArea.id == areaJson.id && !isPresent) {
                isPresent = true;
            }
        });
        return isPresent;
    }

    changeAreaData(area) {
        // this.prepareArea = area;
        this.prepareArea.name = area;
        this.prepareArea.id = this.prepareArea.name.id;
        this.prepareArea.description = area.description;
        this.prepareArea.type = area.type;
        this.editedAreaPoints = area.points;
        console.log(this.prepareArea);
    }

    getAreaList() {

        this
            .areaService
            .getAreaList(`/rsb-oms/oms/getChildEntities?parentId=` + this.parentId)
            .subscribe(res => {
                this.manageAreaList.splice(0,this.manageAreaList.length);
                const allAreaList = JSON.parse(res._body);
                allAreaList.forEach(area => {
                    const areaJson = this.eavWrapperService.eavToJson(area, 'AREA');
                    if (areaJson !== null && !this.isAreaPresent(areaJson)) {
                        this.manageAreaList.push(areaJson);
                    }
                });
                console.log("jjjjjjjjjjjjjjjjjjj",this.manageAreaList);
                if (this.manageAreaList.length > 0) {
                    this.drawAreasOnMap();
                    this.selectedArea = this.manageAreaList[0];
                    this.getInstallationPoints(this.manageAreaList[0]);// Aneesh : TODO : Get the device points for a single area.
                }
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured while retriving area list', 'Ok', {
                //     duration: 5000,
                //     extraClasses: ['error-snackbar']
                //   });
            });
    }

    removeArea(area) {
        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
        let svgTemp: any = this.getMyGNode(svgAreaMap);

        if (svgTemp !== null) {
            let j;
            const svgTempchildNodesLength = svgTemp.childNodes.length;
            for (j = 0; j < svgTempchildNodesLength; j++) {
                if (svgTemp.childNodes[j] !== undefined && svgTemp.childNodes[j].id === ('a_' + area.id)) {
                    svgTemp.removeChild(svgTemp.childNodes[j]);
                } else if (svgTemp.childNodes[j] !== undefined && svgTemp.childNodes[j].id === ('temp_area')) {
                    svgTemp.removeChild(svgTemp.childNodes[j]);
                }
            }
        }
    }

    drawSingleArea(area: any, type: string) {
        let pathCoordinates: string;
        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
        let svgTemp: any = this.getMyGNode(svgAreaMap);

        area.points.forEach((point, index) => {
            let pathCoordinate = point.x + ' ' + point.y;

            if (index === 0) {
                pathCoordinates = 'M' + pathCoordinate;
            } else {
                pathCoordinates += ' L' + pathCoordinate;
            }

            // Create Circle for the points
            if (type === 'STROKE') {
                const circle = this.makeSVGElement('circle', {
                    cx: point.x,
                    cy: point.y,
                    r: 1,
                    stroke: '#eee',
                    'stroke-width': 0.5,
                    fill: 'red'
                });
                svgTemp.appendChild(circle);
            }

        });

        pathCoordinates += ' Z';
        let newpath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        newpath.setAttributeNS(null, 'd', pathCoordinates);
        newpath.setAttributeNS(null, 'class', 'draggable');
        newpath.setAttributeNS(null, 'id', 'a_' + area.id);
        if (type === 'FILL') {
            newpath.setAttributeNS(null, 'fill', area.color ? area.color : 'lightgreen');
            newpath.setAttributeNS(null, 'opacity', '.4');
        } else {
            newpath.setAttributeNS(null, 'stroke', '#323232');//area.color ? area.color : 'lightgreen');
            newpath.setAttributeNS(null, 'fill', 'none');
            newpath.setAttributeNS(null, 'stroke-width', '1.0');
            newpath.setAttributeNS(null, 'opacity', '.7');
        }

        if (svgTemp !== null) {
            svgTemp.appendChild(newpath);
        }
    }

    removeSelectedPoints() {
        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
        let svgTemp: any = this.getMyGNode(svgAreaMap);

        if (svgTemp !== null) {
            let j;
            const svgTempchildNodesLength = svgTemp.childNodes.length;
            for (j = 0; j < svgTempchildNodesLength; j++) {
                if (svgTemp.childNodes[j] !== undefined && svgTemp.childNodes[j].tagName === 'circle' && svgTemp.childNodes[j].classList !== undefined && svgTemp.childNodes[j].classList[0] === 'temp_points') {
                    svgTemp.removeChild(svgTemp.childNodes[j]);
                }
            }
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

    drawAreasOnMap() {

        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
        if (svgAreaMap != null) {
            let pathCoordinates: string;
            console.log("33333333333333333333333333333333", svgAreaMap);
            this.manageAreaList.forEach(area => {

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
                newpath.setAttributeNS(null, 'opacity', '.4');

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

            });
        }
    }

    activateListeners() {
        let self = this;

        let svg_floor_map: any = document.querySelector('#svg_floor_map');
        console.log("mmmmmmmmmmmmmmmmmmmmmmmmm",svg_floor_map);
        svg_floor_map.addEventListener('load', function (event) {
            if(svg_floor_map.getSVGDocument()!=null) {
                //Enable the Zoom after the complete loading of the Map
                self.enableZoom();

                //Call API to get the area list and render in the UI
                self.getAreaList();

                let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
                svgAreaMap.addEventListener('click', function (event) {
                    self.getTheCordinates(event);
                });
            }
        });
    }

    //GRIPM Changed intial load zoom valueto set as default
    enableZoom() {
        const self = this;
        setTimeout(function () {
            try{
            self.panZoom = svgPanZoom('#svg_floor_map', {
                zoomEnabled: true
                , controlIconsEnabled: false
                , fit: true
                , center: 1
                , initialZoom: 4
            });
            }catch (e) {
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",e);
            }
        }, 500);
    }

    loadMapByLevel() {
        this.areaService.getFileDetail(`/rsb-oms/oms/getFile/` + this.level.levelMap).subscribe(res => {
                const contentTypeSVG = 'image/svg+xml';
                const b64Svg = JSON.parse(res._body).data;
                const blob = this.svgService.b64toBlob(b64Svg, contentTypeSVG, 512);
                this.svgSourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
                this.activateListeners();
            }, (error: any) => {
                // this.snackBar.open('Error occured while getting Map', 'Ok', {
                //   duration: 5000,
                //   extraClasses: ['error-snackbar']
                // });
            }
        );
    }

    ngOnInit() {
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );
        let self = this;
        // Update Header details
        this.sendHeaderWithLogo();

        // Update Bread Crums
        this.updateBreadCrums();

        // To change the view from svg to Add/edit screen
        this.observeValue = this.storage.observe('addClicked').subscribe((clickedRes) => {
            if (clickedRes) {
                $('.area-list-conatiner.active').removeClass('active');
            }
            $('.add-edit-area-container').css('display', 'block');
            this.addClicked = clickedRes;
        });
        $('body,.svg-area-map-container').on('click', function (e) {
            // e.preventDefault();
            self.tipActive = false;
        });
    }

    updateBreadCrums() {
        this.appService.updateBreadCrums('AREA');
    }

    showAreasToDelete() {
        this.deleteState = true;
    }

    previewDeleteArea(newValue) {
        if (newValue.points !== undefined) {
            this.zoomInToParticularArea(newValue.points);
        }
    }

    deleteArea() {
        let deleteUrl = '/rsb-oms/oms/deleteEntity?id=' + this.areaToDelete.id;
        this.layoutComponent.addClass();
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '640px',
            height: 'auto',
            data: deleteUrl
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.layoutComponent.removeClass();
                this.removeArea(this.selectedArea);
                this.cancelDelete();
                this.loadMapByLevel();
                this.evictcache();
            }
        });
        $('.add-edit-area-container').css('display', 'none');
        this.addClicked = false;
        this.storage.store('addClicked', false);
    }

    evictcache() {

        this.areaService.evictcache(`/rsb-oms/oms/cacheEvict`)
            .subscribe(res => {
                this.getAreaList();
            }, (error: any) => {

            });

    }

    cancelDelete() {
        this.deleteState = false;
        $('.add-edit-area-container').css('display', 'none');
        this.addClicked = false;
        this.storage.store('addClicked', false);
    }

    updateInstallationDeviceCode(newValue) {
        this.installationPointCode = this.masterDataService.getDevicePointCode(newValue);
    }

    ngAfterViewInit() {
        // Get Area details and render Area on map and Device points
        this.loadMapByLevel();
    }

    // delete device point
    deleteDevicePoint(id) {
        id = parseInt(id);
        let deleteURL = '/rsb-oms/oms/deletePoint?id=' + id;
        this.layoutComponent.addClass();
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '640px',
            height: 'auto',
            data: deleteURL
        });
        dialogRef.afterClosed().subscribe(result => {
            this.layoutComponent.removeClass();
            if (result) this.evictcache();

        });
    }

    getPointsDetail(id) {
        id = parseInt(id);
        // /oms/getPointById
        this.areaService.getAreaList('/rsb-oms/oms/getPointById?id=' + id).subscribe((data) => {
            let jsonData = JSON.parse(data._body)
            this.pointName = jsonData.deviceType;
            this.pointDesc = jsonData.pointDesc === null ? '----' : jsonData.pointDesc;
            this.tipActive = true;
        }, (error) => {
            // this.snackBar.open("error occured", '', { duration: 2000, extraClasses: ['error-snackbar'] });
        });
    }

    ngOnDestroy() {
        this.observeValue.unsubscribe();
    }
}
