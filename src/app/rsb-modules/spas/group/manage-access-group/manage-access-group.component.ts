import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../../app.service';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {LocalStorageService, LocalStorage, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {GroupService} from '../group.service';
import {PersonalInfo} from '../group';
import {LayoutComponent} from '../../../../common';
import {ConfirmModalComponent} from '../../../../common';
import { MatDialog, MatDialogRef} from '@angular/material';
import {PrepareAccessGroupComponent} from '../prepare-access-group/prepare-access-group.component';
import {debug} from 'util';
import {Department, SubDepartment, Designation} from '../../../organizations/staff/staff';
import {PaginationService} from '../../../../pagination-service';
import {TranslateService} from '@ngx-translate/core';
import {accessGroup, accessLevel} from '../../access-model';
import {PrepareAccessLevelComponent} from '../../level/prepare-access-level/prepare-access-level.component';
import {LevelService} from '../../level/level.service';

@Component({
  selector: 'app-manage-staff',
  templateUrl: './manage-access-group.component.html',
  styleUrls: ['./manage-access-group.component.scss']
})
export class ManageAccessGroupComponent implements OnInit {

    @SessionStorage('subsidiary')
    public subsidiary;
    public accessGroups: any[] = [];
    public addClicked = false;
    public accessGroupName='';
    @SessionStorage('prepareAccessGroupComponentOpenCount')
    public prepareAccessGroupComponentOpenCount;

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
        private groupService: GroupService,
        public layoutComponent: LayoutComponent,
        public sessionStorageService: SessionStorageService,
        public paginationService: PaginationService,
        public translate: TranslateService
    ) {
    }

    ngOnInit() {
        this.getAllAccessGroups();
        this.prepareAccessGroupComponentOpenCount = 0;
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
                    && (this.prepareAccessGroupComponentOpenCount === 0 || this.prepareAccessGroupComponentOpenCount === null)
                    && this.activatedRoute.url === '/rsb-modules/spas/group/group-list/view-all') {

                    if (this.prepareAccessGroupComponentOpenCount === null) {
                        this.prepareAccessGroupComponentOpenCount = 0;
                    } else {
                        // console.log("give");
                        this.prepareAccessGroupComponentOpenCount++;
                    }
                    let accessGroupT = new accessGroup({});
                    this.sessionStorageService.store('accessGroup', accessGroupT);
                    let viewAccessGroupData = {
                        'accessG': accessGroupT,
                        'mode': 'new'
                    };
                    this
                        .layoutComponent
                        .addClass();
                    $('.page-wrapper').addClass('blur-bg');
                    const dialogRef = this
                        .dialog
                        .open(PrepareAccessGroupComponent, {
                            width: '800px',
                            height: 'auto',
                            data: viewAccessGroupData,
                            hasBackdrop: true
                        });

                    dialogRef
                        .afterClosed()
                        .subscribe(result => {
                            this.getAllAccessGroups();
                            console.log("gggggggggggggrrrrrrrrrooouuuuuuuup");
                            this.addClicked = false;
                            $('.page-wrapper').removeClass('blur-bg');
                            this.layoutComponent
                                .removeClass();

                          this.prepareAccessGroupComponentOpenCount=0;
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
        this.translate.get('sub-header.manage-access-group', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.access-group-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;

                        this.translate.get('route-name.add-access-group', this.appService.currentLang).subscribe(
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
    getAllAccessGroups() {
        this.accessGroups = [];

        this.isLoading = true;
        this.groupService
            .getAllAccessGroups(this.accessGroupName,this.appService.currentLang,this.perPage,this.page)
            .subscribe((res) => {
                this.isLoading = false;
                let groups = JSON.parse(res._body);
                this.accessGroups=groups.content;
                this.totalPages = groups.totalPages;
                this.totalRecordsCount = groups.totalElements;
            }, (err) => {

            });

    }

    deleteAccessGroup(accessGroup) {
        let deleteUrl = '/rsb-spas/accesselement?id=' + accessGroup.id;

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
                this.getAllAccessGroups();
                this.localStorageService.store('addClicked', false);
            });
    }

    editAccessGroup(accessGroup) {
        let viewAccessGroupData = {
            'accessG': accessGroup,
            'mode': 'edit'
        };
        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(PrepareAccessGroupComponent, {
                width: '800px',
                height: 'auto',
                data: viewAccessGroupData,
                hasBackdrop: true
            });
        dialogRef
            .afterClosed()
            .subscribe(result => {
                this
                    .layoutComponent
                    .removeClass();
                this.getAllAccessGroups();
            });
    }
    setPage(status: string) {
        this.page = this.paginationService.setPageStart0(this.page, status, this.totalPages);
        this.getAllAccessGroups()
    }
}
