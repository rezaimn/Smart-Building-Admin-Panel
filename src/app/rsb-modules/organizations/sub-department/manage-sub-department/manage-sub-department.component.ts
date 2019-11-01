import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../../app.service';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {MatDialog} from '@angular/material';
import {ConfirmModalComponent, LayoutComponent} from '../../../../common';
import {Router} from '@angular/router';
import {PrepareSubDepartmentComponent} from '../prepare-sub-department/prepare-sub-department.component';
import {PrepareDesignationComponent} from '../../designation/prepare-designation/prepare-designation.component';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service'
import {SubDepartmentService} from '../sub-department.service';
import {ManageDesignation, ManageSubDepartment, PrepareSubDepartment} from '../sub-department';
import {TranslateService} from '@ngx-translate/core';
import {consoleTestResultHandler} from 'tslint/lib/test';

@Component({
    selector: 'app-manage-sub-department',
    templateUrl: './manage-sub-department.component.html',
    styleUrls: ['./manage-sub-department.component.scss']
})
export class ManageSubDepartmentComponent implements OnInit {

    @SessionStorage('department')
    public departments;

    @SessionStorage('organization')
    public organizations;

    @SessionStorage('subsidiary')
    public subsidiaries;

    @SessionStorage('subdepartment')
    public subdepartments;

    @SessionStorage('designation')
    public designations;

    @SessionStorage('prepareDepartmentComponentOpenCount')
    public prepareDepartmentComponentOpenCount;

    public designation: ManageDesignation[] = [];
    public worktime: any;

    public manageSubDepartments: any[] = [];

    constructor(public translate: TranslateService, public appService: AppService, private evaWrapper: EavWrapperService, private storage: LocalStorageService, public dialog: MatDialog, private layoutComponent: LayoutComponent, private subDepartmentService: SubDepartmentService, private activatedRoute: Router) {
    }

    // sendHeader() : void {
    //   // send message to subscribers via observable subject
    //   this
    //     .appService
    //     .sendHeader(this.departments.departmentName, 'sub-department','manage sub-department & designation', 'add sub-dept');
    // }

    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject

        let subHeader = '';
        let pageDetails = '';
        let subsidiaryName: '';
        let routeName = '';
        this.translate.get('sub-header.sub-department', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.manage-sub-department', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;
                        this.translate.get('route-name.add-sub-department', this.appService.currentLang).subscribe(
                            (routeNameT) => {
                                routeName = routeNameT;
                                this
                                    .appService
                                    .sendHeaderWithLogo(this.departments.departmentName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/ALERT-MANAGEMENT-SYSTEM.png');
                            }
                        )
                    }
                );
            }
        );
    }
    getSubDepartment() {
        this
            .subDepartmentService
            .getSubDepartmentList(`/rsb-oms/oms/dept/getDept?deptId=` + this.departments.id)
            .subscribe(res => {
                let allSubDepartments = JSON.parse(res._body);
                this.manageSubDepartments = allSubDepartments.subDepartments;
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured', 'Ok', {
                //     duration: 5000,
                //     // extraClasses: ['error-snackbar']
                //   });
            });
    }

    // Edit Sub-departments
    prepareSubDepartment(message, index, subdept) {
        let areaData = this.departments.areas;

        let prepareSubDeptComponentData = {
            'message': message,
            'index': index,
            'subdept': subdept,
            'dept_areas': areaData
        };
        this
            .layoutComponent
            .addClass();
        const dialogRef = this
            .dialog
            .open(PrepareSubDepartmentComponent, {
                width: '920px',
                height: 'auto',
                data: prepareSubDeptComponentData
            });
        dialogRef
            .afterClosed()
            .subscribe(result => {
                    this
                        .layoutComponent
                        .removeClass()
                    if (result)
                        this.getSubDepartment();
                }
            );
    }

    // Delete Sub-department
    deleteSubdepartment(id) {
        // console.log("11111111111111111",id);

        let deleteUrl = '/rsb-oms/oms/dept/deleteDept?deptId=' + id;
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
                    .removeClass()
                this.getSubDepartment();
            });
    }

    // Get all designations
    getDesignation() {
        this.designation = [];
        this
            .subDepartmentService
            .getDesignationList(`/rsb-oms/oms/dept/getDept?deptId=` + this.departments.id)
            .subscribe(res => {
                let jsonBody = JSON.parse(res._body);
                this.designation = jsonBody.designations;
                this.policyDetails(this.designation);
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured', 'Ok', {
                //     duration: 5000,
                //     // extraClasses: ['error-snackbar']
                //   });
            });
    }

    // get policy Details
    policyDetails(data) {
        data.forEach((ele, ind) => {
            this
                .subDepartmentService
                .getDesignationList(`/rsb-oms/oms/getWorkTimePolicyGroup?subsidairyId=` + this.subsidiaries.id + `&designationId=` + ele.id)
                .subscribe((data) => {
                    data = JSON.parse(data._body);
                    if (data.workTimeGroupRelation.length > 0) {
                        this.worktime = true;
                    } else {
                        this.worktime = false;
                    }
                }, (error) => {
                    // this
                    //   .snackBar
                    //   .open('Error Occured', 'okay', {
                    //     duration: 2000,
                    //     extraClasses: ['error-snackbar']
                    //   });
                })
        })
    }

    // Create Designation
    prepareDesignation(message, index, desgn, linkTo) {
        let prepareDesignationComponentData = {
            'message': message,
            'index': index,
            'desgn': desgn,
            'linkTo': linkTo
        };
        this
            .layoutComponent
            .addClass();
        const dialogRef = this
            .dialog
            .open(PrepareDesignationComponent, {
                width: '640px',
                height: 'auto',
                data: prepareDesignationComponentData
            });
        dialogRef
            .afterClosed()
            .subscribe(result => {
                    this
                        .layoutComponent
                        .removeClass()
                    if (result) {
                        this.getDesignation();
                    }
                }
            );
    }

    // Delete a Designation
    deleteDesignation(id) {
        // console.log("11111111111111111111111111",id);
        let deleteUrl = '/rsb-oms/oms/dept/desig/deleteDesignation?designationId=' + id;
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
                    .removeClass()
                if (result)
                    this.getDesignation();
            });
    }

    ngOnInit() {
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );
        this.prepareDepartmentComponentOpenCount = 0;
        this.sendHeaderWithLogo();
        this.updateBreadCrums();

        this
            .storage
            .observe('addClicked')
            .subscribe((clickedRes) => {
                if (clickedRes
                    && (this.prepareDepartmentComponentOpenCount === 0 || this.prepareDepartmentComponentOpenCount === null)
                    && this.activatedRoute.url === '/rsb-modules/organization/dept/subdepartment/manage') {

                    if (this.prepareDepartmentComponentOpenCount === null) {
                        this.prepareDepartmentComponentOpenCount = 0;
                    } else {
                        this.prepareDepartmentComponentOpenCount++;
                    }

                    let areaData = this.departments.areas;
                    let prepareSubDepartment = new PrepareSubDepartment({});
                    prepareSubDepartment.areas = areaData;
                    prepareSubDepartment.orgId = this.organizations.id
                    prepareSubDepartment.subsidiaryId = this.subsidiaries.id
                    prepareSubDepartment.parentDepartmentId = this.departments.id;

                    let prepareSubDeptComponentData = {
                        'message': 'new',
                        'index': this.manageSubDepartments.length + 1,
                        'subdept': prepareSubDepartment,
                        'dept_areas': areaData
                    };

                    $('.page-wrapper').addClass('blur-bg');
                    let dialogRef = this
                        .dialog
                        .open(PrepareSubDepartmentComponent, {
                            width: '920px',
                            height: 'auto',
                            data: prepareSubDeptComponentData
                        });
                    dialogRef
                        .afterClosed()
                        .subscribe(result => {
                                $('.page-wrapper').removeClass('blur-bg');
                                if (result)
                                    this.getSubDepartment();
                            }
                        );
                }
            });
        this.getSubDepartment();
        this.getDesignation();
        $('.panel-heading a')
            .on('click', function (e) {
                if ($(this).parents('.panel').children('.panel-collapse').hasClass('in')) {
                    e.stopPropagation();
                }
            });
    }

    saveSubDept(data) {
        this.subdepartments = data;
    }

    // Store designation to session storage
    saveDesignation(designationObj) {
        this.designations = designationObj;
    }

    updateBreadCrums() {
        this
            .appService
            .updateBreadCrums('SUBDEPARTMENT');
    }
}
