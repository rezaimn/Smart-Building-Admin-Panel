import { Component, OnInit, AfterViewInit, OnChanges,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { LocalStorageService, SessionStorage } from 'ngx-webstorage';
import { CampusService } from '../campus.service';
import { SvgService } from '../../../../utils/services/svg.service';
import { AppService } from '../../../../app.service';
import { ManageCampus } from '../campus';
import { EavWrapperService } from '../../../../utils/services';
import { routerTransition } from '../../../../utils/animations/router.animation';
import { ConfirmModalComponent } from '../../../../common';
import { LayoutComponent } from '../../../../common';
import { runInNewContext } from 'vm';
import {TranslateService} from '@ngx-translate/core';
declare var svgPanZoom: any;
declare let $: any;

@Component({
  selector: 'app-manage-campus', templateUrl: './manage-campus.component.html', styleUrls: ['./manage-campus.component.scss'],
  // animations: [routerTransition()], host: { '[@routerTransition]': '' }
})
// AfterViewInit,OnChanges
export class ManageCampusComponent implements OnInit,
  AfterViewInit, OnDestroy{

  @SessionStorage('subsidiary')
  public subsidiary;

  @SessionStorage('campus')
  public campus;

  public parentId: number;
  public addClicked = false; // Flag for add/edit to manage navigation
  public manageCampus: ManageCampus = new ManageCampus();
  public svgSourceUrl: any; // Url for svg element
  public fileExist: boolean = false;

  public panZoom: any;
  public prepareComponent: any;
  public activeClass: string;
  public fileData: string;
  public observeValue;
  public manageCampusList: Array<any> = [];
  scrollbarOptions = {
    axis: 'y',
    theme: 'minimal-dark',
    mouseWheel: {
      enable: true
    },
    contentTouchScroll: 200,
    scrollInertia: 0,
    mouseWheelPixels: 100
  };
  constructor(
    public appService: AppService,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer,
    private campusService: CampusService,
    private route: ActivatedRoute,
    private router: Router,
    private eavWrapperService: EavWrapperService,
    private layoutComponent: LayoutComponent,
    public dialog: MatDialog,
    private svgService: SvgService,
    public translate:TranslateService) {
    this.parentId = parseInt(this.subsidiary.id);
  }

  /**
   * @function sendHeader, for sending the header to Sub-header component component for showing the
   * header dynamically has the route changes
   * @returns empty
   * @param Three params to be sent. 1: Main Header name,2: Sub-Header name and 3: Add/edit button name
  **/
  // sendHeader(): void {
  //   // send message to subscribers via observable subject
  //   if (this.subsidiary !== null) {
  //     this
  //       .appService
  //       .sendHeader(this.subsidiary.name, 'campus', 'manage campus', 'Add Campus');
  //   }
  // }
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
          this.translate.get('sub-header.campus', this.appService.currentLang).subscribe(
              (subHeaderT) => {
                  subHeader = subHeaderT;
                  this.translate.get('page-details.manage-campus', this.appService.currentLang).subscribe(
                      (pageDetailsT) => {
                          pageDetails = pageDetailsT;

                                  this.translate.get('route-name.add-campus', this.appService.currentLang).subscribe(
                                      (routeNameT) => {
                                          if(this.appService.spaceIsAvailable('CAMPUS')){
                                              routeName = routeNameT;
                                          }
                                          this
                                              .appService
                                              .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/OMS.png');
                                      }
                                  )
                      }
                  );
              }
          );
      }
  }

  /**
   * @function getCampusList, a function to be called to get the all the Campus list of particular
   *  Subsidiary using unique id of the subsidiary. Function @returns the list of Campuses under that subsidairy
   * for lisitng iff it exists or throws a null value if empty
   * @var "manageCampus": A variable used to store the list of data obtained from API call which contains
   * list of campus under that particular subsidiary
   **/

   private running : boolean= false;
  getCampusList() {
    if (this.running)
        return;
     this.running = true;   
    this.manageCampusList = [];
    this
      .campusService
      .getCampusList(`/rsb-oms/oms/getChildEntities?parentId=` + this.parentId + `&Accept-Language=` + this.appService.currentLang)
      .subscribe(res => {
        if (res.status === 200) {
          let allCampus = JSON.parse(res._body);
          console.log(allCampus);
          allCampus.forEach(campus => {
            
            let campusJson = this
              .eavWrapperService
              .eavToJson(campus, 'CAMPUS');
            if (campusJson !== null) {
              this
                .manageCampusList
                .push(campusJson);
            }
          });
          this.running = false;
        }
        //console.log("tttttttttttttttttt",this.manageCampusList);
        if (this.manageCampusList.length > 0) {
          this.getFileDetail(this.manageCampusList[0], '', '');
          this
            .appService
            .reinitializeGlobalSearch('CAMPUS', this.manageCampusList);
        }
      }, (error: any) => {
        // this
        //   .snackBar
        //   .open('Error occured while getting Campus list', 'Ok', {
        //     duration: 5000,
        //     extraClasses: ['error-snackbar']
        //   });
      });
  }

  getFileDetail(data, ele, event) {

    if (event !== '') {
      $('.' + event.currentTarget.className).removeClass('active');
      $('#' + event.currentTarget.id).addClass('active');
    }

    this.campusService.getFileDetail(`/rsb-oms/oms/getFile/` + data.campusMap)
      .subscribe(res => {
        this.fileExist = true;
        const contentTypeSVG = 'image/svg+xml';
        const b64Svg = JSON.parse(res._body).data;
        const blob = this.svgService.b64toBlob(b64Svg, contentTypeSVG, 512);
        this.svgSourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        this.enableZoom();
        this.fileData = JSON.parse(res._body).filename;
      }, (error: any) => {
        // this.snackBar.open('Error occured while getting Map', 'Ok', {
        //   duration: 5000,
        //   extraClasses: ['error-snackbar']
        // });
      });
  }

  deleteCampus(id) {
    let deleteUrl = "/rsb-oms/oms/deleteEntity?id=" + id;
    this
      .layoutComponent
      .addClass();
    const dialogRef = this
      .dialog
      .open(ConfirmModalComponent, {
        width: '640px',
        height: 'auto',
        data: deleteUrl
      });
    dialogRef
      .afterClosed()
      .subscribe(result => {
        this
          .layoutComponent
          .removeClass();
        //this.getCampusList();
        this.evictcache();
      });
  }

  evictcache(){

    this.campusService.evictcache(`/rsb-oms/oms/cacheEvict`)
      .subscribe(res => {
        this.getCampusList();
      }, (error: any) => {
       
      });

  }

  // edit campus function
  editCampus(campusObj, idx) {
      console.log("_________________________",campusObj);
      campusObj.nameMultiLingual=campusObj.name;
      campusObj.campusAddressMultiLingual=campusObj.campusAddress;
    this.addClicked = true;
    this.prepareComponent = {
      type: 'edit',
      index: idx,
      id: campusObj.id,
      parentId: this.parentId,
      object: campusObj
    };
    this.getCampusList();
  }

  zoomInSVG(ev) {
    ev.preventDefault();
    this
      .panZoom
      .zoomIn();
  }

  zoomOutSVG(ev) {
    ev.preventDefault();
    this
      .panZoom
      .zoomOut();
  }

  resetZoomSVG(ev) {
    ev.preventDefault();
    this
      .panZoom
      .resetZoom();
  }

  enableZoom() {
    const self = this;
    setTimeout(function() {
      self.panZoom = svgPanZoom('#svg_floor_map', {
        zoomEnabled: true,
        // controlIconsEnabled: true,
        fit: true,
        center: true
      });
    }, 1000);
  }

  ngOnInit() {
    // Set the header for Campus and pass it to sub header component
      this.appService.currentLangEmit.subscribe(
          (res: any) => {
              this.sendHeaderWithLogo();
          }
      );
    this.sendHeaderWithLogo();
    this.updateBreadCrums();
    // To change the view from svg to Add/edit screen
    this.observeValue = this
      .localStorageService
      .observe('addClicked')
      .subscribe((clickedRes) => {
        this.addClicked = clickedRes;

        if (this.addClicked && this.router.url === '/rsb-modules/organization/space/campus/manage') {
          $('.single-campus.active').removeClass('active');
          this.prepareComponent = {
            type: 'add',
            index: (this.manageCampus)
              ? this.manageCampusList.length + 1
              : 1,
            id: 0,
            parentId: this.parentId,
            object: new ManageCampus({})
          };
          this.getCampusList();
        }
      });
    this.activeClass = 'active';
    this.getCampusList();
  }

  ngAfterViewInit() {
    if (this.router.url === '/rsb-modules/organization/space/campus/manage') {
      this.getCampusList();
    }
  }

  // ngOnChanges() {
  //   if (!this.addClicked) {
  //     this.getCampusList();
  //   }
  // }

  storeCampus(campus) {
    this.campus = campus;
  }

  updateBreadCrums() {
    this
      .appService
      .updateBreadCrums('CAMPUS');
  }
  ngOnDestroy() {
    this.observeValue.unsubscribe();
  }
}
