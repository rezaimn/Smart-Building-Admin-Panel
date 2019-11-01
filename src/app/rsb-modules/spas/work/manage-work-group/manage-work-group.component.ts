import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../../app.service';
import {DomSanitizer} from '@angular/platform-browser';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {WorkService} from '../work.service';
import {ConfirmModalComponent, LayoutComponent} from '../../../../common';
import {MatDialog} from '@angular/material';
import {PrepareWorkGroupComponent} from '../prepare-work-group/prepare-work-group.component';
import {PaginationService} from '../../../../pagination-service';
import {TranslateService} from '@ngx-translate/core';
import {accessGroup, workGroup} from '../../access-model';
import {CalendarConverterService} from '../../../../calendar-converter-service';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-manage-work-group',
    templateUrl: './manage-work-group.component.html',
    styleUrls: ['./manage-work-group.component.scss']
})
export class ManageWorkGroupComponent implements OnInit {

    @SessionStorage('subsidiary')
    public subsidiary;
    public page: number = 0;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;

    public totalElements: number;

    public endPoint: number = 0;
    public addClicked = false;
    public workGroups: workGroup[] = [];
    public selectedAccessGroupId=0;
    public workGroupName='';
    public accessGroups:accessGroup[] =[];
    @SessionStorage('prepareWorkGroupComponentOpenCount')
    public prepareWorkGroupComponentOpenCount;

    public isLoading: boolean = false;

    constructor(
        public appService: AppService,
        private sanitizer: DomSanitizer,
        public dialog: MatDialog,
        private localStorageService: LocalStorageService,
        private activatedRoute: Router,
        private workService: WorkService,
        public layoutComponent: LayoutComponent,
        public sessionStorageService: SessionStorageService,
        public paginationService: PaginationService,
        public translate: TranslateService,
        private calendarConverter: CalendarConverterService,
        public datePipe: DatePipe,
    ) {
    }

    ngOnInit() {
        this.getAllWorkGroups();
        this.getAllAccessGroups();
        this.prepareWorkGroupComponentOpenCount = 0;
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        //  this.getDepartmentDetails();

        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
                this.getAllWorkGroups();
            }
        )

        this.localStorageService.observe('addClicked')
            .subscribe((newValueOfAddClicked) => {
                this.addClicked = newValueOfAddClicked;

                if (this.addClicked
                    && (this.prepareWorkGroupComponentOpenCount === 0 || this.prepareWorkGroupComponentOpenCount === null)
                    && this.activatedRoute.url === '/rsb-modules/spas/work/work-list/view-all') {
                    this
                        .layoutComponent
                        .addClass();

                    if (this.prepareWorkGroupComponentOpenCount === null) {
                        this.prepareWorkGroupComponentOpenCount = 0;
                    } else {
                        // console.log("give");
                        this.prepareWorkGroupComponentOpenCount++;
                    }


                    $('.page-wrapper').addClass('blur-bg');

                    let workG = new workGroup({});
                    this.sessionStorageService.store('workG', workG);
                    let viewWorkGroupData = {
                        'workG': workG,
                        'mode': 'new'
                    };

                    this
                        .layoutComponent
                        .addClass();

                    const dialogRef = this
                        .dialog
                        .open(PrepareWorkGroupComponent, {
                            width: '768px',
                            height: 'auto',
                            data: viewWorkGroupData,
                            hasBackdrop: true
                        });

                    dialogRef
                        .afterClosed()
                        .subscribe(result => {
                            console.log('wwwwwwwwwwwwwwooooooooooooooooorrrrrrrrrrrrrk');
                            this.getAllWorkGroups();
                            this.addClicked = false;
                            $('.page-wrapper').removeClass('blur-bg');
                            this
                                .layoutComponent
                                .removeClass();
                        });
                }
            });
    }


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
        let routeName = '';
        this.translate.get('sub-header.manage-work-group', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.work-group-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;

                        this.translate.get('route-name.add-work-group', this.appService.currentLang).subscribe(
                            (routeNameT) => {
                                routeName = routeNameT;
                                this
                                    .appService
                                    .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/SMART_PHYSICAL_ACCESS_SYSTEM.png');
                            }
                        )

                    }
                );
            }
        );
    }


    updateBreadCrums() {
        this
            .appService
            .updateBreadCrums('SA-MANAGEMENT');
    }
    ngAfterViewInit() {
        // Get Area details and render Area on map and Device points
        //this.getAllStaffs();
    }
    getAllAccessGroups(){
        this.accessGroups = [];
        this.workService
            .getAllAccessGroups(this.appService.currentLang)
            .subscribe((res) => {
                this.accessGroups = JSON.parse(res._body).content;

            }, (err) => {

            });
    }
    getAllWorkGroups() {
        this.workGroups = [];
        this.isLoading = true;
        this.workService
            .getAllWorkGroups(this.workGroupName,this.selectedAccessGroupId,this.appService.currentLang)
            .subscribe((res) => {
                this.isLoading = false;
                let groups = JSON.parse(res._body);
                this.workGroups=groups.content;
                this.totalPages = groups.totalPages;
                this.totalRecordsCount = groups.totalElements;
                if (this.appService.currentCalendar == 'jalali') {
                    for (let i = 0; i < this.workGroups.length; i++) {
                        let SDate=this.calendarConverter.convertDateFormat(this.workGroups[i].startDate);
                        let GSDate=this.calendarConverter.convertFromGregorianToJalaliString(SDate);
                        this.workGroups[i].startDateJ=GSDate;

                        let EDate=this.calendarConverter.convertDateFormat(this.workGroups[i].endDate);
                        let GEDate=this.calendarConverter.convertFromGregorianToJalaliString(EDate);
                        this.workGroups[i].endDateJ=GEDate;
                    }

                }

            }, (err) => {

            });
    }


    deleteVisitorAccess(workG) {
        let deleteUrl = '/rsb-spas/workgroup?id=' + workG.id;

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
                this.page = 0;
                this.getAllWorkGroups();
                this.localStorageService.store('addClicked', false);
            });
    }

    editWorkGroup(workG) {

        let viewWorkGroupData = {
            'workG': workG,
            'mode': 'edit'
        };

        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(PrepareWorkGroupComponent, {
                width: '1024px',
                height: '768px',
                data: viewWorkGroupData,
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
        this.getAllWorkGroups()
    }
}
