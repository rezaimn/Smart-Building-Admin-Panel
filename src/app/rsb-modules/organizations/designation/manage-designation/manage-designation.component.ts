import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../../app.service';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {MatDialog} from '@angular/material';
import {ConfirmModalComponent, LayoutComponent} from '../../../../common';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service';
import {DesignationService} from '../designation.service';
import {PrepareDesignationComponent} from '../prepare-designation/prepare-designation.component';
import {ManageDesignation} from '../designation'
import {PoliciesService} from '../../policies/policies.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-manage-designation',
    templateUrl: './manage-designation.component.html',
    styleUrls: ['./manage-designation.component.scss']
})
export class ManageDesignationComponent implements OnInit {

    public designation: ManageDesignation[] = [];

    @SessionStorage('subdepartment')
    public subdepartment;

    @SessionStorage('department')
    public departments;

    @SessionStorage('subsidiary')
    public subsidiary;

    @SessionStorage('designation')
    public ssDesignation;

    public subdepartments: any
    public worktime: any;
    public gradePresent: Boolean = false;
    public allwancePresent: Boolean = false;

    constructor(public translate: TranslateService, public appService: AppService, private evaWrapper: EavWrapperService, private storage: LocalStorageService, public dialog: MatDialog, private layoutComponent: LayoutComponent, private designationService: DesignationService, private policiesService: PoliciesService) {
    }

    // sendHeader(): void {
    //   // send message to subscribers via observable subject
    //   if (this.subdepartment) {
    //     this
    //       .appService
    //       .sendHeader(this.subdepartment.departmentName, 'designations', 'manage designation', '');
    //   }
    // }
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        if (this.subdepartment !== null) {
            let subHeader = '';
            let pageDetails = '';
            let subsidiaryName: '';
            let routeName = '';
            this.translate.get('sub-header.designation', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.manage-designation', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;
                            this
                                .appService
                                .sendHeaderWithLogo(this.subdepartment.name, subHeader, pageDetails, '', '../../../../../assets/images/dashboard/OMS.png');
                        }
                    );
                }
            );
        }
    }

    // get designation list
    getDesignation() {
        this.designation = []
        this
            .designationService
            .getDesignationList(`/rsb-oms/oms/dept/getDept?deptId=` + this.departments.id)
            .subscribe(res => {
                this.subdepartments = JSON.parse(res._body);
                let subdepts: any = [];
                this
                    .subdepartments
                    .subDepartments
                    .forEach((element, index) => {
                        if (element.id === this.subdepartment.id && element !== null) {
                            console.log(element);
                            element
                                .designations
                                .forEach((k, i) => {
                                    console.log(k)
                                    if (k == null) {
                                        this.designation = []
                                    } else {
                                        this
                                            .designation
                                            .push(k);
                                    }
                                })
                        }
                    });
                console.log(this.designation);
                this.policyDetails(this.designation);
                this.getGradePolicies(this.designation);
                this.getAllowanceAvailable(this.designation);
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured', 'Ok', {
                //     duration: 5000,
                //     // extraClasses: ['error-snackbar']
                //   });
            });
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
                    if (result)
                        this.getDesignation();
                }
            );
    }

    // delete Designation
    deleteDesignation(id) {
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
                }
            );
    }

    ngOnInit() {
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );
        this.sendHeaderWithLogo();
        this.getDesignation();
        this.updateBreadCrums();
    }

    updateBreadCrums() {
        this
            .appService
            .updateBreadCrums('DESIGNATIONS');
    }

    storeDesignation(designation) {
        this.ssDesignation = designation;
    }

    policyDetails(data) {
        data.forEach((ele, ind) => {
            this.designationService.getDesignationList(`/rsb-oms/oms/getWorkTimePolicyGroup?subsidairyId=` + this.subsidiary.id + `&designationId=` + ele.id).subscribe((data) => {
                data = JSON.parse(data._body);
                if (data.workTimeGroupRelation.length > 0) {
                    this.worktime = true;
                } else {
                    this.worktime = false;
                }
            }, (error) => {
                // this.snackBar.open('Error Occured', 'okay', { duration: 2000, extraClasses: ['error-snackbar'] });
            })
        })
    }

    // Get Grade Policies
    getGradePolicies(data) {
        data.forEach((element, index) => {
            this
                .policiesService
                .getGradeList(`/rsb-oms/oms/getGradePolicyGroup?subsidairyId=` + this.subsidiary.id + '&designationId=' + element.id)
                .subscribe(res => {
                    if (res.status === 200 && res._body !== '') {
                        let selectedGradeArrFromApi = JSON.parse(res._body);
                        if (Object.keys(selectedGradeArrFromApi.gradePolicy).length >= 1) {
                            // this.manageGrades = selectedGradeArrFromApi.gradePolicy;
                            this.gradePresent = true;
                        } else {
                            this.gradePresent = false;
                        }
                    }
                }, (error: any) => {
                    // this
                    //   .snackBar
                    //   .open('Error occured', 'Ok', {
                    //     duration: 5000,
                    //     // extraClasses: ['error-snackbar']
                    //   });
                });
        });
    }

    //  get allowance policies
    getAllowanceAvailable(data) {
        // this.manageAllowance = [];
        data.forEach((element, index) => {
            this
                .policiesService
                .getGradeList(`/rsb-oms/oms/getAllowancePoliciesByDesignationId?designationId=` + element.id)
                .subscribe(res => {
                    if (res.status === 200 && res._body !== '') {
                        let selectedAllowanceArrFromApi = JSON.parse(res._body);
                        if (selectedAllowanceArrFromApi.length >= 1) {
                            this.allwancePresent = true;
                        } else {
                            this.allwancePresent = false;
                        }
                    }
                }, (error: any) => {
                    // this
                    //   .snackBar
                    //   .open('Error occured', 'Ok', {
                    //     duration: 5000,
                    //     // extraClasses: ['error-snackbar']
                    //   });
                });
        });
    }
}
