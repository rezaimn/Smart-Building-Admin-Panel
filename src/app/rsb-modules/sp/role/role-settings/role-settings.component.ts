import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../../app.service';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {PrepareRole} from '../role';
import {RoleService} from '../role.service';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service';
import {DateAdapter, MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {ConfirmModalComponent, LayoutComponent} from '../../../../common/index';
import {PrepareRoleComponent} from '../prepare-role/prepare-role.component';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';
import {PaginationService} from '../../../../pagination-service';
import {MasterDataService, SvgService} from '../../../../utils/index';
import {DatePipe} from '@angular/common';
import {multiLingMap} from '../../../organizations/staff/staff';
import {isUndefined} from 'util';


@Component({
    selector: 'app-manage-role',
    templateUrl: './role-settings.component.html',
    styleUrls: ['./role-settings.component.scss']
})
export class RoleSettingsComponent implements OnInit {
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
    public mapT={
        'id': 0,
        'map':{
            'en':"",
            'fa':""
        }
    }

    public addClicked = false; // Flag for add/edit to manage navigation
    public roleList = [];
    public modulesScreensList: any = [];
    public observeClicked: any;

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
        private roleService: RoleService,
        public sessionStorageService: SessionStorageService,
        public dateAdapter: DateAdapter<Date>,
        private datePipe: DatePipe,
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

        this.storage.observe('addClicked').subscribe((clickedRes) => {

            this.sessionStorageService.store('addAlert', 1);
            if (clickedRes && (this.prepareRoleComponentOpenCount === 0 || this.prepareRoleComponentOpenCount === null) && this.activatedRoute.url === '/rsb-modules/sp/role/role-list/settings') {
                if (this.prepareRoleComponentOpenCount === null) {
                    this.prepareRoleComponentOpenCount = 0;
                } else {
                    this.prepareRoleComponentOpenCount++;
                }
                let prepareRoleData = {
                    'message': 'new',
                    'index': 1,
                    'role': new PrepareRole()
                };
                $('.page-wrapper').addClass('blur-bg');
                let dialogRef = this
                    .dialog
                    .open(PrepareRoleComponent, {
                        width: '1100px',
                        height: 'auto',
                        data: prepareRoleData
                    });

                dialogRef
                    .afterClosed()
                    .subscribe(result => {

                        $('.page-wrapper').removeClass('blur-bg');
                        this
                            .storage
                            .store('addClicked', false);
                        if (result) {

                            this.prepareRoleComponentOpenCount = 0;
                        } else {
                            this.prepareRoleComponentOpenCount = 0;
                        }
                        this.getRoleModulePermission();
                    });
            }
        });


    }

    // sendHeader(): void {
    //   // send message to subscribers via observable subject
    //   if (this.subsidiary !== null) {
    //     this
    //       .appService
    //       .sendHeader(this.subsidiary.name, 'departments', 'MANAGE department', 'add department');
    //   }
    // }
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        // if (this.subsidiary !== null) {
            let subHeader = '';
            let pageDetails = '';
            // let subsidiaryName: '';
            // if (this.appService.currentLang == 'en') {
            //     subsidiaryName = this.subsidiary.name.map.en;
            // }
            // if (this.appService.currentLang == 'fa') {
            //     subsidiaryName = this.subsidiary.name.map.fa;
            // }
            let routeName = '';
            this.translate.get('sub-header.role-settings', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.role-settings', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;

                                    this.translate.get('route-name.add-role', this.appService.currentLang).subscribe(
                                        (routeNameT) => {
                                            routeName = routeNameT;
                                            this
                                                .appService
                                                .sendHeaderWithLogo('', subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/SETTING-PANEL.png');
                                        }
                                    )

                        }
                    );
                }
            );
        // }
    }

    updateBreadCrums() {
        this.appService.updateBreadCrums('SP-SUBSIDIARY');
    }

    getRoleModulePermission() {
        this.roleList = [];
        this
            .roleService
            .getAllRoleModulesPermissionList(`/rsb-security/security/role/getAllPaginatedRoles?size=` + this.size + `&page=` + this.page + '&Accept-Language=' + this.appService.currentLang)
            .subscribe(res => {
                if (res.status === 200) {
                    const roleML = JSON.parse(res._body);
                    this.roleList = roleML.content;
                    // console.log("33333333333333333",this.roleList);
                    this.roleList.forEach(role => {
                         if (role.roleMultiLingual===undefined||role.roleMultiLingual===null) {
                            // console.log("44444444444444444",role);

                            role.roleMultiLingual ={
                                'id': 0,
                                'map':{
                                    'en':"",
                                    'fa':""
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
        let roleT;
        this
            .roleService
            .getAllRoleModulesPermissionList(`/rsb-security/security/authz/permission/permissionForRole?roleId=` + role.id)
            .subscribe(res => {

                roleT = JSON.parse(res._body)[0];
                console.log("################",roleT);
                if(roleT.role.roleMultiLingual===null||roleT.role.roleMultiLingual===undefined){

                    roleT.role.roleMultiLingual=this.mapT;
                }
                console.log("****************",roleT);
                let editRoleComponentData = {
                    'message': message,
                    'index': index,
                    'role': roleT,
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

            }, (error: any) => {
            });


    }

    deleteRole(id) {
        let deleteUrl = '/rsb-security/security/role/deleteRole?roleId=' + id;
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
                this.getRoleModulePermission();
            });
    }

    setPage(status: string) {
        this.page = this.paginationService.setPageStart0(this.page, status, this.totalPages);
        this.getRoleModulePermission()
    }

}
