import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {Modules, PrepareRole, Screens} from '../../../sp/role/role';
import {RoleService} from '../../../sp/role/role.service';
import {RoleManagementService} from '../role-management.service';
import {PersonalInfo} from '../role-management.interface';
import {AuthenticationService} from '../../../../common/authentication.service';


@Component({
    selector: 'app-prepare-role',
    templateUrl: './prepare-role.component.html',
    styleUrls: ['./prepare-role.component.scss']
})
export class PrepareRoleComponent implements OnInit, OnDestroy {
    public scrollbarOptions = {
        axis: 'y',
        theme: 'light-3',
        mouseWheel: {
            enable: true
        },
        contentTouchScroll: 200,
        scrollInertia: 0,
        mouseWheelPixels: 100
    };
    @SessionStorage('organization')
    public organization;

    @SessionStorage('subsidiary')
    public subsidiary;

    @SessionStorage('prepareRoleComponentOpenCount')
    public prepareRoleComponentOpenCount;
    staffs=[];
    role;
    constructor(
        public dialogRef: MatDialogRef<PrepareRoleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private storage: LocalStorageService,
        private roleManagementService: RoleManagementService,
        public appService: AppService,
        public translate: TranslateService,
        public authenticationService : AuthenticationService) {
        this.role=data.role;
    }

    ngOnInit() {

        this.getAllStaffs();
    }

    getAllStaffs() {
        this.roleManagementService
            .getAllStaffs()
            .subscribe((res) => {
                let allStaffs = JSON.parse(res._body);
                allStaffs.content.forEach(staff => {
                    let staffObject = new PersonalInfo(staff, this.organization.id, this.subsidiary.id, {});
                    if(staff.roles && staff.roles[0]){
                        staffObject.hasRole=true;
                    }
                    this.staffs.push(staffObject);
                });

            });
    }
    attachOrDetachStaffToRole(event,staff){

        if (event.target.checked) {
            let data = {
                'roleId': this.role.id,
                'staffId': staff.id
            };
            this.roleManagementService
                .attachStaffToRole(`/rsb-security/security/staff/updateStaffRole`,data)
                .subscribe((res) => {

                }, (err) => {
                    // this.snackBar.open('There was an error while creating admin', 'okay', { duration: 3000 });
                });
        }else{
            this.authenticationService
                .deleteItem(`/rsb-security/security/staff/deleteStaffRole?staffId=` + staff.id + `&roleId=` + this.role.id)
                .subscribe((res) => {

                }, (err) => {
                    // this.snackBar.open('There was an error while creating admin', 'okay', { duration: 3000 });
                });
        }

    }

    ngOnDestroy() {
        this.prepareRoleComponentOpenCount = 0;
        this.storage.store('addClicked', false);
    }

    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }


    moduleHasPermission(module) {
        let flag = false;
        for (let screen of module.module.screens) {
            if (screen.permission.access == 0 || screen.permission.access == 1) {
                flag = true;
                break;
            }
        }
        return flag;
    }

}
