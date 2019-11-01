import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { LayoutComponent, ConfirmModalComponent } from '../../../../common';
import { DevicePointComponent } from '../../../../utils';
import { MasterDataService, EavWrapperService, SvgService } from '../../../../utils';
import { AppService } from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';


/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
  selector: 'app-holiday-table',
  templateUrl: './holiday-table.component.html',
  styleUrls: ['./holiday-table.component.scss']
})
export class HolidayTableComponent implements OnInit {

    public page : number = 1;
    public perPage: number = 5;
    public totalRecordsCount:number=0;
    public totalPages:number=0;

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
    
  }

  // sendHeader(): void {
  //   // Send message to subscribers via observable subject
  //   if (this.subsidiary !== null) {
  //     this
  //       .appService
  //       .sendHeader(this.subsidiary.name, 'holiday management', 'manage holiday', '');
  //   }
  // }
  // sendHeaderWithLogo(): void {
  //   // Send message to subscribers via observable subject
  //   if (this.subsidiary !== null) {
  //     this
  //       .appService
  //       .sendHeaderWithLogo(this.subsidiary.name, 'holiday management', 'manage holiday', '','../../../../../assets/images/dashboard/AMS.png');
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
        this.translate.get('sub-header.manage-holiday', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.holiday-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;


                                this
                                    .appService
                                    .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails,'', '../../../../../assets/images/dashboard/AMS.png');

                    }
                );

            }
        );

    }
  updateBreadCrums() {
    this.appService.updateBreadCrums('AMS-VIEW');
  }

  

  




}

