import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {Modules, PrepareRole, Screens} from '../role';
import {RoleService} from '../role.service';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';


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

    @SessionStorage('subdiaryid')
    public subdiaryid;
    @SessionStorage('prepareRoleComponentOpenCount')
    public prepareRoleComponentOpenCount;

    public addAreClicked: Boolean = false;
    public subDeptFlag: Boolean = true;
    public selectedAreas: any = [];
    public mode: string;
    public index: number;

    public prepareRole: PrepareRole;
    public submitted: Boolean = false;
    public modulesScreensList: any = [];
    public selectedModuleIndex = 0;
    constructor(
        public dialogRef: MatDialogRef<PrepareRoleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private storage: LocalStorageService,
        private roleService: RoleService,
        private eavWrapperService: EavWrapperService,
        public appService: AppService,
        public translate: TranslateService) {
        this.mode = data.message;
        this.index = data.index;
        this.prepareRole = data.role;
        // console.log("++++++++++++++++++++", this.prepareRole);
        dialogRef.disableClose = true;
        this.getAllModulesScreens();
    }

    addUpdate() {
        this.prepareRole.role.roleName=this.prepareRole.role.roleMultiLingual.map.en;
        // this.prepareRole.subsidiaryId = this.subdiaryid;
        if (this.mode === 'new') {
            this
                .roleService
                .createUpdateRole(`/rsb-security/security/role/createRole?Accept-Language=`+this.appService.currentLang, this.prepareRole.role)
                .subscribe((res) => {
                    let data = JSON.parse(res._body);
                    this.prepareRole.role.id = data.id;
                    this
                        .roleService
                        .createUpdateRoleModulePermission(`/rsb-security/security/authz/rolemodule/createRoleModulePermission`, this.prepareRole)
                        .subscribe((data) => {
                            this
                                .dialogRef
                                .close(true);
                        }, (error) => {

                        });
                }, (error) => {

                });


        } else if (this.mode === 'edit') {
            this
                .roleService
                .createUpdateRole(`/rsb-security/security/role/updateRole?Accept-Language=`+this.appService.currentLang, this.prepareRole.role)
                .subscribe((res) => {
                    this
                        .roleService
                        .createUpdateRoleModulePermission(`/rsb-security/security/authz/rolemodule/updateRoleModulePermission`, this.prepareRole)
                        .subscribe((data) => {
                            this
                                .dialogRef
                                .close(true);
                        }, (error) => {

                        });
                }, (error) => {

                });
        }
    }
    ngOnInit() {
        if (this.mode === 'edit') {
            // this.passSelectedAreaData(this.prepareRole.areaIds);
        }

    }

    getAllModulesScreens() {
        this.modulesScreensList = [];
        this
            .roleService
            .getAllModulesScreensList(`/rsb-security/security/authz/module/getAllModuleScreenWithoutPermissions`)
            .subscribe(res => {
                if (res.status === 200) {
                    this.modulesScreensList = JSON.parse(res._body);
                    this.setRoleModuleScreens();
                }
            }, (error: any) => {
            });
    }
    setRoleModuleScreens() {
        let roleTemp = new PrepareRole();
        for (let module of this.modulesScreensList) {
            let moduleTemp = new Modules();
            moduleTemp.module.id = module.id;
            moduleTemp.module.name = module.name;
            moduleTemp.module.desc = module.desc;
            moduleTemp.module.code = module.code;
            for (let screen of module.screens) {
                let screenTemp = new Screens();
                screenTemp.screen.id = screen.id;
                screenTemp.screen.screenName = screen.screenName;
                screenTemp.screen.description = screen.description;
                screenTemp.screen.code = screen.code;
                moduleTemp.module.screens.push(screenTemp);
            }
            roleTemp.modules.push(moduleTemp);
        }
        if (this.mode == 'new') {
            this.prepareRole = roleTemp;
        }
        if(this.mode == 'edit'){
            roleTemp.role.id=this.prepareRole.role.id;
            roleTemp.role.roleName=this.prepareRole.role.roleName;
            roleTemp.role.roleMultiLingual=this.prepareRole.role.roleMultiLingual;
            for (let module of roleTemp.modules) {
                for (let PModule of this.prepareRole.modules) {
                    if(PModule.module.id==module.module.id){
                        module.permission.access=PModule.permission.access;
                        if(PModule.permission.access==0){
                            module.permission.W=true;
                            module.permission.R=true;
                        }
                        if(PModule.permission.access==1){
                            module.permission.R=true;
                        }
                        for (let screen of module.module.screens) {
                            for (let PScreen of PModule.module.screens) {
                                if(PScreen.screen.id==screen.screen.id) {
                                    screen.permission.access = PScreen.permission.access;
                                    if (PScreen.permission.access == 0) {
                                        screen.permission.W = true;
                                        screen.permission.R = true;
                                    }
                                    if (PScreen.permission.access == 1) {
                                        screen.permission.R = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.prepareRole = roleTemp;
        }

        // console.log('rollllllllllllll', this.prepareRole);
    }

    setSelectedModuleIndex(index) {
        this.selectedModuleIndex = index;
        console.log(index);
    }

    ngOnDestroy() {
        this.prepareRoleComponentOpenCount = 0;
        this.storage.store('addClicked', false);
    }

    expandAddArea() {
        $('#left-elements').addClass('after-slide');
        this.addAreClicked = true;
    }

    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }

    isAreaChoosen(areaId) {
        let areaSelected: boolean = false;
        this.selectedAreas.forEach(element => {
            if (element.id === areaId && areaSelected === false) {
                areaSelected = true;
            }
        });
        return areaSelected;
    }

    passSelectedAreaData(event) {
        Object.keys(event).forEach((key) => {
            let areaSelected = this.isAreaChoosen(event[key].id);
            if (!areaSelected) {
                let value = event[key];
                if (value.name === undefined) {
                    event[key].name = event[key].areaName;
                }
                this.selectedAreas.push(event[key]);
            }
        });
    }

    //  remove area's on change of area's list
    removeAreas(event, areas, area) {
        this.selectedAreas.splice(areas, 1);
    }

    selectedModuleChanage(moduleIndex: any) {
        this.selectedModuleIndex = moduleIndex;
    }

    SWIsChecked(permission, screenIndex) {

        if (permission.W == true) {
            this.prepareRole.modules[this.selectedModuleIndex].module.screens[screenIndex].permission.W = false;
            if (permission.R == true) {
                this.prepareRole.modules[this.selectedModuleIndex].module.screens[screenIndex].permission.access = 1;
            } else {
                this.prepareRole.modules[this.selectedModuleIndex].module.screens[screenIndex].permission.access = 2;
            }

        } else {
            this.prepareRole.modules[this.selectedModuleIndex].module.screens[screenIndex].permission.W = true;
            this.prepareRole.modules[this.selectedModuleIndex].module.screens[screenIndex].permission.access = 0;
            if (permission.R != true) {
                this.prepareRole.modules[this.selectedModuleIndex].module.screens[screenIndex].permission.R = true;
            }
        }
        let counter = 0;
        for (let screen of this.prepareRole.modules[this.selectedModuleIndex].module.screens) {
            if (screen.permission.W == true) {
                counter = counter + 1;
            } else {
                counter = counter - 1;
            }
        }
        if (counter == this.prepareRole.modules[this.selectedModuleIndex].module.screens.length) {
            this.prepareRole.modules[this.selectedModuleIndex].permission.W = true;
            this.prepareRole.modules[this.selectedModuleIndex].permission.R = true;
            this.prepareRole.modules[this.selectedModuleIndex].permission.access = 0;
        }
        if (counter != this.prepareRole.modules[this.selectedModuleIndex].module.screens.length) {
            this.prepareRole.modules[this.selectedModuleIndex].permission.W = false;
            if (this.prepareRole.modules[this.selectedModuleIndex].permission.R == true) {
                this.prepareRole.modules[this.selectedModuleIndex].permission.access = 1;
            } else {
                this.prepareRole.modules[this.selectedModuleIndex].permission.access = 2;
            }
        }


    }

    SRIsChecked(permission, screenIndex) {
        if (permission.R == true) {
            this.prepareRole.modules[this.selectedModuleIndex].module.screens[screenIndex].permission.R = false;
            this.prepareRole.modules[this.selectedModuleIndex].module.screens[screenIndex].permission.access = 2;
            this.prepareRole.modules[this.selectedModuleIndex].module.screens[screenIndex].permission.W = false;

        } else {
            this.prepareRole.modules[this.selectedModuleIndex].module.screens[screenIndex].permission.R = true;

            if (permission.W == true) {
                this.prepareRole.modules[this.selectedModuleIndex].module.screens[screenIndex].permission.access = 0;
            } else {
                this.prepareRole.modules[this.selectedModuleIndex].module.screens[screenIndex].permission.access = 1;
            }
        }
        let counter = 0;
        for (let screen of this.prepareRole.modules[this.selectedModuleIndex].module.screens) {
            if (screen.permission.R == true) {
                counter = counter + 1;
            } else {
                counter = counter - 1;
            }
        }
        if (counter == this.prepareRole.modules[this.selectedModuleIndex].module.screens.length) {
            this.prepareRole.modules[this.selectedModuleIndex].permission.R = true;
            this.prepareRole.modules[this.selectedModuleIndex].permission.access = 1;
        }
        if (counter != this.prepareRole.modules[this.selectedModuleIndex].module.screens.length) {
            this.prepareRole.modules[this.selectedModuleIndex].permission.W = false;
            this.prepareRole.modules[this.selectedModuleIndex].permission.R = false;
            this.prepareRole.modules[this.selectedModuleIndex].permission.access = 2;
        }
    }

    MWIsChecked(permission) {
        if (permission.W == true) {
            this.prepareRole.modules[this.selectedModuleIndex].permission.W = false;
            if(permission.R==true){
                this.prepareRole.modules[this.selectedModuleIndex].permission.access = 1;
            }else {
                this.prepareRole.modules[this.selectedModuleIndex].permission.access = 2;
            }
            for (let screen of this.prepareRole.modules[this.selectedModuleIndex].module.screens) {
                screen.permission.W = false;
                if (screen.permission.R == true) {
                    screen.permission.access = 1;
                } else {
                    screen.permission.access = 2;
                }
            }
        }
        else {
            this.prepareRole.modules[this.selectedModuleIndex].permission.W = true;
            this.prepareRole.modules[this.selectedModuleIndex].permission.R = true;
            this.prepareRole.modules[this.selectedModuleIndex].permission.access = 0;
            for (let screen of this.prepareRole.modules[this.selectedModuleIndex].module.screens) {
                screen.permission.W = true;
                screen.permission.R = true;
                screen.permission.access = 0;
            }
        }
    }

    MRIsChecked(permission) {
        if (permission.R == true) {
            this.prepareRole.modules[this.selectedModuleIndex].permission.R = false;
            this.prepareRole.modules[this.selectedModuleIndex].permission.W = false;
            this.prepareRole.modules[this.selectedModuleIndex].permission.access = 2;
            for (let screen of this.prepareRole.modules[this.selectedModuleIndex].module.screens) {
                screen.permission.W = false;
                screen.permission.R = false;
                screen.permission.access = 2;
            }
        }
        else {
            this.prepareRole.modules[this.selectedModuleIndex].permission.R = true;

                this.prepareRole.modules[this.selectedModuleIndex].permission.access = 1;

            for (let screen of this.prepareRole.modules[this.selectedModuleIndex].module.screens) {
                screen.permission.R = true;
                if (screen.permission.W == true) {
                    screen.permission.access = 0;
                } else {
                    screen.permission.access = 1;
                }
            }
        }
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

    executeDisabledCheck() {
        let flag = true;
        for (let module of this.prepareRole.modules) {
            for (let screen of module.module.screens) {
                if (screen.permission.access == 0 || screen.permission.access == 1) {
                    flag = false;
                    break;
                }
            }
            if (flag == false) {
                break;
            }
        }
        return flag;
    }
}
