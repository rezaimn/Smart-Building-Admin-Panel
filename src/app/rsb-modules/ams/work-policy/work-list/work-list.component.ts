import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {AuthenticationService, LayoutComponent} from '../../../../common';
import {ConfirmComponent} from '../confirm/confirm.component';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import {AppService} from '../../../../app.service';
import {WorkPolicyService} from '../work-policy.service';

import {AddWorkComponent} from 'app/rsb-modules/ams/work-policy/add-work/add-work.component';
import {PaginationService} from '../../../../pagination-service';
import {TranslateService} from '@ngx-translate/core';


/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
    selector: 'app-work-list',
    templateUrl: './work-list.component.html',
    styleUrls: ['./work-list.component.scss']
})
export class WorkPolicyListComponent implements OnInit {

    public page: number = 1;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;
    public paginationArray = [];
    public startpage = 0;
    public endPage = 5;

    public policyList: any;

    public policyID: number = 2;

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

    @SessionStorage('addWorkCount')
    public addWorkCount;

    constructor(public dialog: MatDialog,
                public appService: AppService,
                public masterDataService: MasterDataService,
                public eavWrapperService: EavWrapperService,
                public layoutComponent: LayoutComponent,
                public activatedRoute: Router,
                private storage: LocalStorageService,
                private sanitizer: DomSanitizer,
                public svgService: SvgService,
                public sessionStorageService: SessionStorageService,
                private authenticationService: AuthenticationService,
                private workPolicyService: WorkPolicyService,
                public paginationService: PaginationService,
                public translate:TranslateService

    ) {
    }

    ngOnInit() {

        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )
        this.getPolicyList();
        this.sendHeaderWithLogo();
        this.addWorkCount = 0;
        this.updateBreadCrums();
        this.storage.observe('addClicked').subscribe((clickedRes) => {
            if (clickedRes && (this.addWorkCount === 0 || this.addWorkCount === null) && this.activatedRoute.url === '/rsb-modules/ams/work-policy/work-list/view-all') {
                if (this.addWorkCount === null) {
                    this.addWorkCount = 0;
                } else {
                    this.addWorkCount++;
                }
                let prepareDeviceData = {
                    'message': 'new',
                    'index': 1
                };

                $('.page-wrapper').addClass('blur-bg');
                let dialogRef = this
                    .dialog
                    .open(AddWorkComponent, {
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

                            this.addWorkCount = 0;
                        } else {
                            this.addWorkCount = 0
                        }
                        this.getPolicyList();
                    });
            }
        });
    }

    ngAfterViewInit() {

    }

    // sendHeader(): void {
    //   if (this.subsidiary !== null) {
    //     this
    //       .appService
    //       .sendHeader(this.subsidiary.name, 'work policy management', 'manage work policy', 'add work policy');
    //   }
    // }
    //
    // sendHeaderWithLogo(): void {
    //     // Send message to subscribers via observable subject
    //     if (this.subsidiary !== null) {
    //         this
    //             .appService
    //             .sendHeaderWithLogo(this.subsidiary.name, 'work policy management', 'manage work policy', 'add work policy', '../../../../../assets/images/dashboard/AMS.png');
    //     }
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
        let routeName='';
        this.translate.get('sub-header.manage-work-policy', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.work-policy-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;

                                this.translate.get('route-name.add-work-policy', this.appService.currentLang).subscribe(
                                    (routeNameT) => {
                                        routeName=routeNameT;
                                        this
                                            .appService
                                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/AMS.png');

                            }
                        );

                    }
                );
            }
        );
    }



    getPolicyList() {
        // debugger;
        this
            .workPolicyService
            .getPolicyList('/AMS/GetWorkPoliciesBySubsidiaryId?id=' + this.subsidiary.id)
            .subscribe(res => {
                //debugger;
                if (res.status === 200) {
                    this.policyList = JSON.parse(res._body);
                    // this.totalRecordsCount = this.policyList.totalrecords;//this.alertList.length;
                    // this.policyList= this.policyList.records;
                    // var x = this.totalRecordsCount % this.perPage;
                    // var y = this.totalRecordsCount - x;
                    // this.totalPages = y / this.perPage + 1;

                }
            }, (error: any) => {
                this.appService.showFail('NO POLICY AVAILABLE');

            });
    }

    deletePolicy(id) {

        let deleteUrl = '/AMS/DeleteWorkPolicy?id=' + id;
        this
            .layoutComponent
            .addClass();
        const dialogRef = this
            .dialog
            .open(ConfirmComponent, {
                width: '640px',
                height: 'auto',
                data: deleteUrl
            });
        dialogRef
            .afterClosed()
            .subscribe(result => {
                this
                    .layoutComponent
                    .removeClass()
                this.getPolicyList();
            });

    }

    updateBreadCrums() {
        this.appService.updateBreadCrums('AMS-VIEW');
    }

    enterPolicy(policy) {

        this.sessionStorageService.store('policy', policy);
        let viewPolicyData = {
            'policy': policy,
            'type': 'update',
            'starttime': policy.mealtime.starttime,
            'endtime': policy.mealtime.endtime
        };

        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(AddWorkComponent, {
                width: '768px',
                height: 'auto',
                data: viewPolicyData,
                hasBackdrop: true
            });

        dialogRef
            .afterClosed()
            .subscribe(result => {
                this
                    .layoutComponent
                    .removeClass()
                this.getPolicyList();
            });
    }

    // setPage(status: string) {
    //     this.page = this.paginationService.setPage(this.page, status, this.totalPages);
    //     this.getPolicyList();
    // }

}
