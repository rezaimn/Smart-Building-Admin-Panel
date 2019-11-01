import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../../app.service';
import {DomSanitizer} from '@angular/platform-browser';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {VisitorService} from '../visitor.service';
import {cardHolder, visitorInfo} from '../../access-model';
import {ConfirmModalComponent, LayoutComponent} from '../../../../common';
import {MatDialog} from '@angular/material';
import {ViewVisitorComponent} from '../view-visitor/view-visitor.component';
import {PaginationService} from '../../../../pagination-service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-manage-visitor',
    templateUrl: './manage-visitor.component.html',
    styleUrls: ['./manage-visitor.component.scss']
})
export class ManageVisitorComponent implements OnInit {

    @SessionStorage('organization')
    public organization;

    @SessionStorage('subsidiary')
    public subsidiary;
    public searchValue='';
    public workGroupId=0;
    public workGroups=[];
    public page: number = 0;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;
    public totalElements: number;
    public endPoint: number = 0;
    public addClicked = false;
    public visitors: visitorInfo[] = [];
    public departmentId: number = 0;
    public subDepartmentId: number = 0;

    @SessionStorage('prepareVisitorComponentOpenCount')
    public prepareVisitorComponentOpenCount;


    public isLoading: boolean = false;

    constructor(
        public appService: AppService,
        private sanitizer: DomSanitizer,
        public dialog: MatDialog,
        private localStorageService: LocalStorageService,
        private activatedRoute: Router,
        private visitorService: VisitorService,
        public layoutComponent: LayoutComponent,
        public sessionStorageService: SessionStorageService,
        public paginationService: PaginationService,
        public translate: TranslateService
    ) {
    }

    ngOnInit() {
        this.prepareVisitorComponentOpenCount = 0;
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.getAllVisitors();
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )
        this.getAllWorkGroups();
        this.localStorageService.observe('addClicked')
            .subscribe((newValueOfAddClicked) => {
                this.addClicked = newValueOfAddClicked;

                if (this.addClicked
                    && (this.prepareVisitorComponentOpenCount === 0 || this.prepareVisitorComponentOpenCount === null)
                    && this.activatedRoute.url === '/rsb-modules/spas/visitor/visitor-list/view-all') {
                    this
                        .layoutComponent
                        .addClass();

                    if (this.prepareVisitorComponentOpenCount === null) {
                        this.prepareVisitorComponentOpenCount = 0;
                    } else {
                        // console.log("give");
                        this.prepareVisitorComponentOpenCount++;
                    }


                    $('.page-wrapper').addClass('blur-bg');

                    let visitor = new visitorInfo({});
                    //visitor.cardholders=new cardHolder({});
                    this.sessionStorageService.store('visitor', visitor);
                    let viewVisitorData = {
                        'visitor': visitor,
                        'mode':'new'
                    };

                    this
                        .layoutComponent
                        .addClass();

                    const dialogRef = this
                        .dialog
                        .open(ViewVisitorComponent, {
                            width: '768px',
                            height: 'auto',
                            data: viewVisitorData,
                            hasBackdrop: true
                        });

                    dialogRef
                        .afterClosed()
                        .subscribe(result => {
                            this.addClicked = false;
                            $('.page-wrapper').removeClass('blur-bg');
                            this
                                .layoutComponent
                                .removeClass();
                            this.getAllVisitors();
                        });
                }
            });
    }
    getAllWorkGroups(){
        this.workGroups = [];

        this.visitorService
            .getAllWorkGroups('visitor',this.appService.currentLang)
            .subscribe((res) => {

                this.workGroups = JSON.parse(res._body).content;

            }, (err) => {

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
        this.translate.get('sub-header.manage-visitors', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.visitors-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;

                        this.translate.get('route-name.add-visitor', this.appService.currentLang).subscribe(
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

    enableCardHolder(enable, index) {
        this.visitors[index].cardholder.loader = true;
        this.visitors[index].cardholder.enabled = enable;
        this
            .visitorService
            .updateCardHolder(this.visitors[index].cardholder)
            .subscribe((data) => {
                let cardHolder = JSON.parse(data._body);
                this.visitors[index].cardholder.enabled = cardHolder.enabled;
                this.visitors[index].cardholder.loader = false;
            }, (error) => {
                this.visitors[index].cardholder.enabled = !enable;
                this.visitors[index].cardholder.loader = false;
            });
    }
    updateBreadCrums() {
        this
            .appService
            .updateBreadCrums('SA-MANAGEMENT');
    }

    ngAfterViewInit() {

    }


    getAllVisitors() {
        this.visitors.splice(0,this.visitors.length);
        this.visitorService
            .getAllVisitor(this.searchValue,this.workGroupId,this.page,this.perPage,this.appService.currentLang)
            .subscribe((res) => {
                let visitorsT = JSON.parse(res._body);
                this.totalPages = visitorsT.totalPages;
                this.totalRecordsCount = visitorsT.totalElements;
                for(let v of visitorsT.content){
                    let vTemp=new visitorInfo(v);
                    vTemp.cardholder.loader=false;
                    this.visitors.push(vTemp);
                }
            });
    }

    deleteVisitorAccess(visitor) {
        let deleteUrl = '/rsb-spas/visitor?id=' + visitor.id;

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
                this.getAllVisitors();
                this.localStorageService.store('addClicked', false);
            });
    }

    viewVisitor(visitor) {
        //this.addClicked = false;
        //visitor = new visitorInfo({});
        console.log('visitor', visitor);
        let viewVisitorData = {
            'visitor': visitor,
            'mode':'edit'
        };

        this
            .layoutComponent
            .addClass();
        const dialogRef = this
            .dialog
            .open(ViewVisitorComponent, {
                width: '1024px',
                height: '768px',
                data: viewVisitorData,
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
        this.getAllVisitors();
    }
}
