import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../../app.service';
import {DomSanitizer} from '@angular/platform-browser';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {LevelService} from '../level.service';
import {ConfirmModalComponent, LayoutComponent} from '../../../../common';
import {MatDialog} from '@angular/material';
import {PrepareAccessLevelComponent} from '../prepare-access-level/prepare-access-level.component';
import {PaginationService} from '../../../../pagination-service';
import {TranslateService} from '@ngx-translate/core';
import {accessLevel} from '../../access-model';
import {EditAlertsComponent} from '../../../alms/alert-management/edit-alerts/edit-alerts.component';

@Component({
    selector: 'app-manage-staff',
    templateUrl: './manage-access-level.component.html',
    styleUrls: ['./manage-access-level.component.scss']
})
export class ManageAccessLevelComponent implements OnInit {

    @SessionStorage('subsidiary')
    public subsidiary;
    public accessLevels: any[] = [];
    public addClicked = false;
    public accessLevelSearch='';
    @SessionStorage('prepareAccessLevelComponentOpenCount')
    public prepareAccessLevelComponentOpenCount;

    public isLoading: boolean = false;
    public page = 0;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;
    constructor(
        public appService: AppService,
        private sanitizer: DomSanitizer,
        public dialog: MatDialog,
        private localStorageService: LocalStorageService,
        private activatedRoute: Router,
        private levelService: LevelService,
        public layoutComponent: LayoutComponent,
        public sessionStorageService: SessionStorageService,
        public paginationService: PaginationService,
        public translate: TranslateService
    ) {
    }

    ngOnInit() {
        this.getAllAccessLevels();
        this.prepareAccessLevelComponentOpenCount = 0;
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )

        this.localStorageService.observe('addClicked')
            .subscribe((newValueOfAddClicked) => {
                this.addClicked = newValueOfAddClicked;

                if (this.addClicked
                    && (this.prepareAccessLevelComponentOpenCount === 0 || this.prepareAccessLevelComponentOpenCount === null)
                    && this.activatedRoute.url === '/rsb-modules/spas/level/level-list/view-all') {
                    this
                        .layoutComponent
                        .addClass();

                    if (this.prepareAccessLevelComponentOpenCount === null) {
                        this.prepareAccessLevelComponentOpenCount = 0;
                    } else {
                        // console.log("give");
                        this.prepareAccessLevelComponentOpenCount++;
                    }


                    $('.page-wrapper').addClass('blur-bg');

                    let accessLevelT = new accessLevel({});
                    this.sessionStorageService.store('accessLevel', accessLevelT);
                    let viewAccessLevelData = {
                        'accessL': accessLevelT,
                        'mode': 'new'
                    };

                    this
                        .layoutComponent
                        .addClass();

                    const dialogRef = this
                        .dialog
                        .open(PrepareAccessLevelComponent, {
                            width: '800px',
                            height: '600px',
                            data: viewAccessLevelData,
                            hasBackdrop: true
                        });

                    dialogRef
                        .afterClosed()
                        .subscribe(result => {
                            console.log("return from modal");
                            this.getAllAccessLevels();
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
        this.translate.get('sub-header.manage-access-level', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.access-level-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;

                        this.translate.get('route-name.add-access-level', this.appService.currentLang).subscribe(
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

    getAllAccessLevels() {
        this.accessLevels = [];
       console.log("in get access func");
        this.levelService
            .getAllAccessLevels(this.accessLevelSearch,this.appService.currentLang,this.page,this.perPage)
            .subscribe((res) => {
              // console.log("get all access",JSON.parse(res._body));
                let levels = JSON.parse(res._body);
                this.accessLevels=levels.content;
                this.totalPages = levels.totalPages;
                this.totalRecordsCount = levels.totalElements;
            }, (err) => {

            });

    }

    deleteAccessLevel(accessLevel) {
        let deleteUrl = '/rsb-spas/accesselement?id=' + accessLevel.id;

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
                this.getAllAccessLevels();
                this.localStorageService.store('addClicked', false);
            });
    }

    editAccessLevel(accessLevel) {
        let viewAccessLevelData = {
            'accessL': accessLevel,
            'mode': 'edit'
        };
        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(PrepareAccessLevelComponent, {
                width: '800px',
                height: 'auto',
                data: viewAccessLevelData,
                hasBackdrop: true
            });
        dialogRef
            .afterClosed()
            .subscribe(result => {
                this
                    .layoutComponent
                    .removeClass();
                this.getAllAccessLevels();
            });
    }

    setPage(status: string) {
        this.page = this.paginationService.setPageStart0(this.page, status, this.totalPages);
        this.getAllAccessLevels()
    }
}
