import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { LayoutComponent, ConfirmModalComponent } from '../../../../common';
import { DevicePointComponent } from '../../../../utils';
import { ManageArea, InstallationPoint, InstallationPointDevice, InstallationPointListItem } from '../../status/status.interface';
import { MasterDataService, EavWrapperService, SvgService } from '../../../../utils';
import { AppService } from '../../../../app.service';
import { StatusService } from '../../status/status.service';
import { ViewEmergencyComponent } from 'app/rsb-modules/sfms/emergency/view-emergency/view-emergency.component';
import {TranslateService} from '@ngx-translate/core';

/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
  selector: 'app-manage-status',
  templateUrl: './manage-emergency.component.html',
  styleUrls: ['./manage-emergency.component.scss']
})
export class ManageEmergencyComponent implements OnInit {

  public selectedArea: any;
  public installationPoints: Array<InstallationPointListItem> = [];
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

  public panZoom: any;

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
    public translate:TranslateService

  ) { }

  ngOnInit() {
    this.sendHeaderWithLogo();
    this.updateBreadCrums();

      this.appService.currentLangEmit.subscribe(
          (res: any) => {
              this.sendHeaderWithLogo();
          }
      )
  }

  ngAfterViewInit() {
    this.getAllCampus();
  }

  // sendHeader(): void {
  //   // Send message to subscribers via observable subject
  //   if (this.subsidiary !== null) {
  //     this
  //       .appService
  //       .sendHeader(this.subsidiary.name, 'emergency', 'manage emergency', '');
  //   }
  // }

  // sendHeaderWithLogo(): void {
  //   // Send message to subscribers via observable subject
  //   if (this.subsidiary !== null) {
  //     this
  //       .appService
  //       .sendHeaderWithLogo(this.subsidiary.name, 'emergency', 'Manage Emergency Device', '','../../../../../assets/images/dashboard/EMS.png');
  //   }
  // }


    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        let subHeader = '';
        let pageDetails = '';
        let subsidiaryName: '';
        // let routeName='';
        this.translate.get('sub-header.manage-emergency-device', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.emergency-device-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;
                        this.translate.get('subsidiary.' + this.subsidiary.name, this.appService.currentLang).subscribe(
                            (subsidiaryNameT) => {
                                subsidiaryName = subsidiaryNameT;

                                this
                                    .appService
                                    .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails,'', '../../../../../assets/images/dashboard/EMS.png');
                            }
                        )
                    }
                );

            }
        );

    }

  updateBreadCrums() {
    this.appService.updateBreadCrums('SFMS-VIEW');
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
          this.appService.showFail('NO CAMPUS AVAILABLE.');
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
          this.appService.showFail('NO BUILDING AVAILABLE.');
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
          this.appService.showFail('NO FLOOR AVAILABLE.');
      });
  }

  getAreaByFloor(event) {
    if (this.selectedFloorId === 0) {
      return;
    } else {
      this.getAllAreas(true);
    }
  }

  isAreaPresent(areaJson: any) {
    let isPresent = false;
    this.areaDropdownList.forEach(singleArea => {
      if (singleArea.id == areaJson.id && !isPresent) {
        isPresent = true;
      }
    });
    return isPresent;
  }

  getAllAreas(fromDropDown: boolean) {
    if (this.selectedFloorId === 0) {
      return;
    }
    if (this.areaDropdownList.length > 0 && !fromDropDown) {
      this.drawAreasOnMap(this.areaDropdownList);
      return;
    }

    this.areaDropdownList = [];
    this
      .masterDataService
      .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedFloorId)
      .subscribe(res => {
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
          this.appService.showFail('NO AREA AVAILABLE.');
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
      .open(ViewEmergencyComponent, {
        width: '640px',
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



 
  renderFloorDetails() {
    this.selectedFloor = this.getSelectedObject(this.floorDropdownList, this.selectedFloorId);
    if (this.selectedFloor !== null) {
      this.reRenderMap(this.selectedFloor);
    }
  }

  reRenderMap(selectedFloor) {
    this.mapPresent = true;
    this.statusService.getFileDetail(`/rsb-oms/oms/getFile/` + selectedFloor.levelMap).subscribe(res => {
      const contentTypeSVG = 'image/svg+xml';
      const b64Svg = JSON.parse(res._body).data;
      const blob = this.svgService.b64toBlob(b64Svg, contentTypeSVG, 512);
      this.svgSourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
      this.activateListeners();
    }, (error: any) => {
        this.appService.showFail('MAP FAILED TO RENDER.');
    });
  }

  activateListeners() {
    let self = this;
    let svg_floor_map: any = document.querySelector('#svg_floor_map');

    svg_floor_map.addEventListener("load", function (event) {

      //if (!this.svgActivated) {
      //Enable the Zoom after the complete loading of the Map 
      self.enableZoom();
      //Call API to get the area list and render in the UI
      self.svgActivated = true;
      //}
      self.getAllAreas(false);

    });
  }

  enableZoom() {
    const self = this;
    setTimeout(function () {
      self.panZoom = svgPanZoom('#svg_floor_map', {
        zoomEnabled: true
        , controlIconsEnabled: false
        , fit: true
        , center: 1
        , initialZoom: 4
      });
    }, 500);
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

  drawAreasOnMap(areas: any) {
    let svg_floor_map: any = document.querySelector('#svg_floor_map');
    let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
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
      let newpath = document.createElementNS('http://www.w3.org/2000/svg', "path");
      newpath.setAttributeNS(null, 'd', pathCoordinates);
      newpath.setAttributeNS(null, 'class', 'draggable');
      newpath.setAttributeNS(null, 'id', 'a_' + area.id);
      newpath.setAttributeNS(null, 'fill', area.color ? area.color : 'lightgreen');
      newpath.setAttributeNS(null, 'stroke-width', '2');
      newpath.setAttributeNS(null, 'opacity', '.2');

      let svgTemp = this.getMyGNode(svgAreaMap);

      if (svgTemp !== null) {
        svgTemp.appendChild(newpath);
        // const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        // text.setAttribute('x', firstPointX);
        // text.setAttribute('y', firstPointY);
        // text.setAttribute('fill', area.color ? area.color : '#000');
        // text.setAttribute('font-size', '7px');
        // text.setAttribute('font-family', 'Verdana');
        // text.setAttribute('text-anchor', 'middle');
        // text.setAttribute('alignment-baseline', 'middle');
        // text.textContent = area.name;
        // svgTemp.append(text);
      }
      if (this.selectedAreaId !== 0) {
        this.selectedArea = this.getSelectedObject(this.areaDropdownList, this.selectedAreaId);
        if (this.selectedArea !== null) {
          this.zoomInToParticularArea(this.selectedArea.points);
        }
      }
    });

    this.getInstallationPoints(areas);
  }

  getInstallationPoints(areas: any) {
    this.installationPoints = [];
    let areaLength = areas.length;
    let responseCount = 0;
    areas.forEach(area => {
      //Get the Device points by Area Id
      this
        .statusService
        .getInstallationPoints(area.id)
        .subscribe(res => {
          if (res._body !== "") {
            const ipList = JSON.parse(res._body);
            ipList.forEach(ip => {
              let ipItem = new InstallationPointListItem(ip);
              if (ipItem !== null) {
                ipItem.deviceColor = this.masterDataService.getDevicePointColor(ipItem.deviceType);
                ipItem.deviceCode = this.masterDataService.getDevicePointCode(ipItem.deviceType);
                this.installationPoints.push(ipItem);
              }
            });
          }
          responseCount++;
          if (areaLength === responseCount && this.installationPoints.length > 0) {
            this.renderInstallationPoints(this.installationPoints);
          }
        }, (error: any) => {
            this.appService.showFail('FAILED TO GET INSTALLATION POINTS.');
        });
    });
  }

  getColor(count: number) {
    let color: string;
    if (count % 2 == 0) {
      color = 'red';
    } else {
      color = 'green';
    }
    return color;
  }

  renderInstallationPoints(installationPoints) {
    //Aneesh
    let svg_floor_map: any = document.querySelector('#svg_floor_map');
    let svgAreaMap: XMLDocument = svg_floor_map.getSVGDocument();
    let svgTemp: any = this.getMyGNode(svgAreaMap);

    let count = 1;
    installationPoints.forEach(ip => {

      let color = this.getColor(count);
      const circleOne = this.makeSVGElement(ip, 'circle', {
        cx: ip.coordinate.x,
        cy: ip.coordinate.y,
        r: '0.5%',
        stroke: '#ccc',
        'stroke-width': 0.5,
        'class': 'ip_circle_class',
        fill: ip.deviceColor,
        'id': 'circle_' + ip.id
      });

      const circleTwo = this.makeSVGElement(ip, 'circle', {
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
      animationTwo.setAttribute('to', '1%');

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
      animationThree.setAttribute('to', '1.5%');
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
      animationFour.setAttribute('to', '2%');
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

  makeSVGElement(ip, tag, attrs) {
    let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (let k in attrs) {
      el.setAttribute(k, attrs[k]);
    }
    let clickPos;
    let self = this;
    el.addEventListener('click', function (e) {
      // clickPos = e;
      console.log(ip);
    });
    return el;
  }

  updateActiveAlarmClass() {
    //ems-device-aa-status
    //invert-brd
  }

  getSelectedObject(list: any, id: any) {
    let selectedObject: any = null;
    list.forEach(item => {
      if (item.id == id) {
        selectedObject = item;
      }
    });
    return selectedObject;
  }

  zoomInToParticularArea(areaPoints) {
    let self = this;
    setTimeout(function () {
      if (self.panZoom) {
        self.panZoom.resetZoom();
        let centroid = self.svgService.calculateCentroid(areaPoints);
        const sizes = self.panZoom.getSizes();
        let newValues = self.svgService.convertSVGPointToZoomPoint(centroid, self.panZoom.getPan(), sizes.realZoom);
        self.panZoom.zoomAtPointBy(1, { x: newValues.x, y: newValues.y });
        self.panZoom.zoomAtPointBy(2, { x: newValues.x, y: newValues.y });
        self.panZoom.zoomAtPointBy(2, { x: newValues.x, y: newValues.y });
      }
    }, 1000);
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

}
