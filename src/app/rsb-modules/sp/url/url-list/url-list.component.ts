import { Url } from './../shared/url';
import { PersonalInfo, EmployementDetails } from './../../../alms/alert-dashboard/alert-dashboard';
import { DatePipe } from '@angular/common';

import { UrlService } from 'app/rsb-modules/sp/url/url.service';
import { AddUrlComponent } from './../add-url/add-url.component';

import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter } from '@angular/material';
import { SessionStorage, SessionStorageService, LocalStorageService } from 'ngx-webstorage';
import { LayoutComponent, ConfirmModalComponent } from '../../../../common';
import { DevicePointComponent } from '../../../../utils';
import { MasterDataService, EavWrapperService, SvgService } from '../../../../utils';
import { AppService } from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {PaginationService} from '../../../../pagination-service';




/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
  selector: 'app-url-list',
  templateUrl: './url-list.component.html',
  styleUrls: ['./url-list.component.scss'],
  providers: [DatePipe]

})
export class UrlListComponent implements OnInit {

  @SessionStorage('organization')
  public organization;  

  @SessionStorage('subsidiary')
  public subsidiary;

  public urls: any[];
    public url: any[];


  public models:Url[]=[];
    public page: number = 1;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;


  @SessionStorage('addUrlCount')
  public addUrlCount;


  constructor(public dialog: MatDialog,public translate:TranslateService,
    public appService: AppService,
    public masterDataService: MasterDataService,
    public eavWrapperService: EavWrapperService,
    public layoutComponent: LayoutComponent,
    private sanitizer: DomSanitizer,
    private storage: LocalStorageService,
    public svgService: SvgService,
    public activatedRoute: Router,
    private urlService: UrlService,
    public sessionStorageService: SessionStorageService,
    public dateAdapter: DateAdapter<Date>,
    private datePipe: DatePipe,
    public UrlService: UrlService,
              public paginationService:PaginationService
  ) { 
    this.dateAdapter.setLocale('en-In'); }


  ngOnInit() {
      this.appService.currentLangEmit.subscribe(
          (res: any) => {
              this.sendHeaderWithLogo();
          }
      );
    this.urlService.urlCancelButtonClicked.subscribe(
        (res:any)=>{
          if(res){
              this.getUrls();
          }
        }
    )
    this.sendHeaderWithLogo();
    this.getUrls();
    this.addUrlCount = 0;
    this.updateBreadCrums();
    ///open modal to add new URL
    this.storage.observe('addClicked').subscribe((clickedRes) => {
      if (clickedRes && (this.addUrlCount === 0 || this.addUrlCount === null) && this.activatedRoute.url === '/rsb-modules/url/url-list/view-all') {
        if (this.addUrlCount === null) {
          this.addUrlCount = 0;
        } else {
          this.addUrlCount++;
        }
        let prepareDeviceData = {
          'message': 'new',
          'index': 1
        };

        $('.page-wrapper').addClass('blur-bg');
        let dialogRef = this
          .dialog
          .open(AddUrlComponent, {
            width: '768px',
            height: 'auto',
            data: prepareDeviceData
          });
        dialogRef
          .afterClosed()
          .subscribe(result => {

            $('.page-wrapper').removeClass('blur-bg');
            this
              .storage
              .store('addClicked', false);
            if (result) {
              
              this.addUrlCount = 0;
            } else {
              this.addUrlCount = 0;
            }
          });
      }
    });


  }

 

  ngAfterViewInit() {
  
  }

    /**
      @Desc set header logo
      @Param
      @return
  */
  sendHeaderWithLogo(): void {
    // Send message to subscribers via observable subject
        if (this.organization !== null) {
            let subHeader = '';
            let pageDetails = '';
            let subsidiaryName: '';
            let routeName = '';
            this.translate.get('sub-header.resource-configuration', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.manage-url', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;

                                    this
                                        .appService
                                        .sendHeaderWithLogo("", subHeader, pageDetails, '', '../../../../../assets/images/dashboard/SETTING-PANEL.png');


                        }
                    );
                }
            );
        }
  }

    /**
      @Desc set sub header links
      @Param
      @return
  */
  updateBreadCrums() {
    this.appService.updateBreadCrums('SP-VIEW');
  }

    /**
      @Desc get all URLs to show in a list
      @Param
      @return
  */v
  getUrls(){
    this
      .urlService
      .getUrls("/SP/GetURLSettings?page=" + this.page + "&records=" + this.perPage)
      .subscribe(res => {
        if (res.status === 200) {
          let items = JSON.parse(res._body);
          this.models=items.records;
        }
      }, (error: any) => {
          this.translate.get('error-messages.url-no-data', this.appService.currentLang).subscribe(
              (subHeaderT) => {
                  this.appService.showFail(subHeaderT);
              }
          );

      });
  }



    /**
      @Desc edit selected URL config data
      @Param
      @return
  */
  editUrl(url){
    this.sessionStorageService.store('url', url);
    let urlData = {
      'url': url
    };

    this
      .layoutComponent
      .addClass();

    const dialogRef = this
      .dialog
      .open(AddUrlComponent, {
        width: '768px',
        height: 'auto',
        data: urlData,
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
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.getUrls();
    }


}

