import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../../app.service';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service';
import {DateAdapter, MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {LayoutComponent} from '../../../../common/index';

import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';
import {PaginationService} from '../../../../pagination-service';
import {MasterDataService, SvgService} from '../../../../utils/index';
import {DatePipe} from '@angular/common';
import {PrepareRole} from '../../../sp/role/role';
import {RoleManagementService} from '../role-management.service';
import {PrepareRoleComponent} from '../prepare-role/prepare-role.component';


@Component({
    selector: 'app-manage-role',
    templateUrl: './role-management.component.html',
    styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
    public page: number = 0;
    public limit: number = 10;
    public size: number = 5;
    public totalPages: number;
    public last: boolean;
    public first: boolean;
    public totalElements: number;
    selectedRole = new PrepareRole();
    @SessionStorage('organization')
    public organization;

    @SessionStorage('subsidiary')
    public subsidiary;

    @SessionStorage('subdiaryid')
    public subdiaryid;

    @SessionStorage('role')
    public roles;

    @SessionStorage('prepareRoleComponentOpenCount')
    public prepareRoleComponentOpenCount;
    public addClicked = false; // Flag for add/edit to manage navigation
    public roleList = [];

    constructor(
        public dialog: MatDialog, public translate: TranslateService,
        public appService: AppService,
        public masterDataService: MasterDataService,
        public eavWrapperService: EavWrapperService,
        public layoutComponent: LayoutComponent,
        private sanitizer: DomSanitizer,
        private storage: LocalStorageService,
        public svgService: SvgService,
        public activatedRoute: Router,
        private roleManagementService: RoleManagementService,
        public sessionStorageService: SessionStorageService,
        public dateAdapter: DateAdapter<Date>,
        public paginationService: PaginationService) {
        this.getRoleModulePermission();
    }

    ngOnInit() {
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );
        this.prepareRoleComponentOpenCount = 0;
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.getRoleModulePermission();
    }

    sendHeaderWithLogo(): void {
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
            let routeName = '';
            this.translate.get('sub-header.role-management', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.role-management', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;

                            this
                                .appService
                                .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/OMS.png');
                        }
                    )
                }
            );
        }
    }

    updateBreadCrums() {
        this
            .appService
            .updateBreadCrums('ROLE');
    }

    getRoleModulePermission() {
        this.roleList = [];
        this
            .roleManagementService
            .getAllRoleModulesPermissionList(`/rsb-security/security/role/getAllPaginatedRoles?size=` + this.size + `&page=` + this.page + '&Accept-Language=' + this.appService.currentLang)
            .subscribe(res => {
                if (res.status === 200) {
                    const roleML = JSON.parse(res._body);
                    this.roleList = roleML.content;
                    // console.log("33333333333333333",this.roleList);
                    this.roleList.forEach(role => {
                            if (role.roleMultiLingual === undefined || role.roleMultiLingual === null) {
                                // console.log("44444444444444444",role);

                                role.roleMultiLingual = {
                                    'id': 0,
                                    'map': {
                                        'en': '',
                                        'fa': ''
                                    }
                                }
                                // console.log("55555555555555555",this.mapT);
                                // console.log("66666666666666666",role);
                            }
                        }
                    )
                    // console.log("000000000000000000",this.roleList);
                    this.first = roleML.first;
                    this.last = roleML.last;
                    this.totalPages = roleML.totalPages;
                    this.totalElements = roleML.totalElements;
                }
            }, (error: any) => {
            });
    }

    editRole(message, index, role) {

        let editRoleComponentData = {
            'message': message,
            'index': index,
            'role': role,
            // 'deptId': deptId
        };

        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(PrepareRoleComponent, {
                width: '1100px',
                height: 'auto',
                data: editRoleComponentData
            });
        dialogRef
            .afterClosed()
            .subscribe(result => {
                this
                    .layoutComponent
                    .removeClass();
                if (result)
                    this.getRoleModulePermission();
            });


    }


    setPage(status: string) {
        this.page = this.paginationService.setPageStart0(this.page, status, this.totalPages);
        this.getRoleModulePermission()
    }

}
