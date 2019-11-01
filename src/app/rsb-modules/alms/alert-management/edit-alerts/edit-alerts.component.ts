import {AppService} from './../../../../app.service';
import {Component, OnInit, Inject, Input, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {LocalStorageService, LocalStorage, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {AlertManagementService} from '../alert-management.service';
import {PersonalInfo, EmployementDetails, EmergencyVehicle, PolicyViewObject} from '../alert-management';
import {Router} from '@angular/router';
import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-edit-alerts',
    templateUrl: './edit-alerts.component.html',
    styleUrls: ['./edit-alerts.component.scss']
})
export class EditAlertsComponent implements OnInit {


    public counter : any = 0 ;
    public alertData: any = {};
    public dep =0;
    public subDep =0;
    public now = moment();
    sortDown = true;
    public cardNumber: string;
    public popupx: any = false;
    public smsx: any = false;
    public emailx: any = false;
    public sendOnlyForAdmin=false;
    public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));

    constructor(
        public dialogRef: MatDialogRef<EditAlertsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private storage: LocalStorageService,
        private AlertManagementService: AlertManagementService,
        public appService: AppService,
        private sessionStorageService: SessionStorageService,
        private router: Router,
        public dialog: MatDialog,
        public translate: TranslateService
    ) {
        // console.log(data, '2222222222222222');
        this.alertData = data.editData;
        this.popupx = this.alertData.isnotification;
        this.smsx = this.alertData.issms;
        this.emailx = this.alertData.isemail;

        dialogRef.disableClose = true;
      if(this.alertData.stafflist){
          if(this.alertData.stafflist.length==0){
              this.sendOnlyForAdmin=true;
          }else{
              this.sendOnlyForAdmin=false;
          }
      }else{
          this.alertData.stafflist=[];
      }
    }

    tooltipPosition = 'above';

    @SessionStorage('subsidiary')
    public subsidiary;

    @SessionStorage('user')
    public user;

    @SessionStorage('addAlert')
    public addAlert;

    public campusList: any;
    public buildingList: any;
    public floorList: any;
    public areaList: any;
    public departmentList: any;
    public subDepartmentList: any;
    public staffList: any;
    public systemList: any;
    public deviceList: any;
    public severityList: any;
    public staffData: any;
    subDeviceList: any;
    public selectedStaff: any;
    staffIsSelected: boolean = false;


    ngOnInit() {

        // this.sendHeader();
        this.getCampus();
        if (this.alertData.campusid) {
            this.getBuilding(this.alertData.campusid);
        }
        if (this.alertData.buildingid) {
            this.getFloor(this.alertData.buildingid);
        }
        if (this.alertData.floorid) {
            this.getArea(this.alertData.floorid);
        }
        this.getDepartment();
        if (this.alertData.departmentid) {
            this.getSubDepartment(this.alertData.departmentid);
        }
        if (this.alertData.subdepartmentid) {
            this.getStaffs(this.alertData.subdepartmentid);
        }
        this.getSystems();
        if (this.alertData.areaid) {
            this.getDeviceType(this.alertData.areaid);
        }
        if (this.alertData.devicetypeid) {
            this.getSubDeviceType(this.alertData.devicetypeid, this.alertData.areaid);
        }
        this.getSevertityList();
    }

    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }

    // add staff


// update staff
    updateStaff(staff) {

        this.staffIsSelected = false;
        let staffData = {
            'executionorder': this.alertData.stafflist ? this.alertData.stafflist.length + 1 : 1,
            'staffid': staff.employeeid
        }
        if (staff != 0) {
            if(this.alertData.stafflist) {
                // console.log("111111111111111111111111",staff);
                let counter=0;
                for (let i=0;i<this.alertData.stafflist.length;i++) {
                    if (this.alertData.stafflist[i].staffid == staffData.staffid) {
                        counter=counter+1;
                    }
                }
                if(counter==0){
                    this.alertData.stafflist.push(staffData);
                }


                //this.alertData.stafflist.push(staffData);
            } else {
                this.alertData.stafflist = [];
                this.alertData.stafflist.push(staffData);
            }
        }
        console.log(this.alertData.stafflist, 'staff data');

        //

    }

    addStaff(data) {
        let staffData = {
            'executionorder': this.alertData.stafflist ? this.alertData.stafflist.length + 1 : 1,
            'staffid': data.employeeid
        }
        if (data != 0) {
        if(this.alertData.stafflist) {
            // console.log("length0000000000",data);

            for (let i=0;i<this.alertData.stafflist.length;i++) {
                if (this.alertData.stafflist[i].staffid == staffData.staffid) {
                   this.counter=this.counter+1;
                }

            }
            if(this.counter==0){
                this.alertData.stafflist.push(staffData);
            }
            // else {
            //     this.translate.get('error-messages.data-already-exist', this.appService.currentLang).subscribe(
            //         (subHeaderT) => {
            //             this.appService.showFail(subHeaderT);
            //         }
            //     );
            // }


            //this.alertData.stafflist.push(staffData);
        } else {
            this.alertData.stafflist = [];
            this.alertData.stafflist.push(staffData);
        }
        }
        console.log(this.alertData.stafflist, 'staff data');

        //
        // console.log(this.alertData.stafflist, 'staff data');
    }



    //
    // sortTable(sortType: any) {
    //  let sortData = this.staffData.executionorder ;
    //     if (sortType == 'asce') {
    //         sortData
    //
    //     }
    //     if (sortType == 'desc') {
    //
    //
    //     }
    //
    // }
    // sortTable(sortBy: any){
    //     this.staffData.executionorder.forEach(item => {
    //         if(item.Name == sortBy){
    //             if(item.IsSort == true){
    //                 item.Order = (item.Order == "ASC" ? "DESC" : "ASC" );
    //                 this.order = item.Order;
    //             }
    //             else {
    //                 item.IsSort = true;
    //                 item.Order = "DESC"
    //             }
    //             this.orderBy = item.Name;
    //             this.order = item.Order;
    //         }
    //         else {
    //             item.IsSort = false;
    //             item.Order = ""
    //         }
    //     });
    //     this.getData();
    // }





            // delete staff

    deleteStaff(data) {
        this.staffIsSelected = false;
        // console.log(data, '5555555555555555555');
        // let staffData = {
        //     'executionorder': this.alertData.stafflist ? this.alertData.stafflist.length + 1 : 1,
        //     'staffid': data.employeeid
        // }
        for (let i = 0; i < this.alertData.stafflist.length; i++) {
            if (this.alertData.stafflist[i].staffid == data.employeeid) {
                this.alertData.stafflist.splice(i, 1);
            }
        }

        // if(this.alertData.stafflist) {
        //     this.alertData.stafflist.pop(staffData);
        // } else {
        //
        //     this.alertData.stafflist = [];
        //     this.alertData.stafflist.pop(staffData);
        // }
    }


    // get campus list
    getCampus() {
        this.AlertManagementService.getCampuses(this.subsidiary.id,this.appService.currentLang).subscribe(
            res => {
                this.campusList = JSON.parse(res._body);
                if (res._body == []) {
                    this.translate.get('error-messages.campus-no-data', this.appService.currentLang).subscribe(
                        (translateRes) => {
                            this.appService.showFail(translateRes);
                        }
                    );

                }
                console.log(this.campusList);
            }, (error: any) => {
                this.translate.get('error-messages.campus-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );

            })
    }


    // get building list
    getBuilding(campus) {
        console.log(campus);
        this.AlertManagementService.getBuildings(campus,this.appService.currentLang).subscribe(
            res => {
                this.buildingList = JSON.parse(res._body);
                if (res._body == []) {
                    this.translate.get('error-messages.building-no-data', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                }
                console.log(this.buildingList);
            }, (error: any) => {
                this.translate.get('error-messages.building-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            })
    }

    // get building list
    getFloor(building) {
        console.log(building);
        this.AlertManagementService.getFloors(building,this.appService.currentLang).subscribe(
            res => {
                this.floorList = JSON.parse(res._body);
                if (res._body == []) {
                    this.translate.get('error-messages.floor-no-data', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                }
                console.log(this.floorList);
            }, (error: any) => {
                this.translate.get('error-messages.floor-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );

            })
    }

    // get area list
    getArea(floor) {
        console.log(floor);
        this.AlertManagementService.getAreas(floor).subscribe(
            res => {
                this.areaList = JSON.parse(res._body);
                if (res._body == []) {
                    this.translate.get('error-messages.area-no-data', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                }
                console.log(this.areaList);
            }, (error: any) => {
                this.translate.get('error-messages.area-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            })
    }

    // get department list
    getDepartment() {
        this.AlertManagementService.getDepartments(this.subsidiary.id,this.appService.currentLang).subscribe(
            res => {
                this.departmentList = JSON.parse(res._body);
                if (res._body == []) {
                    this.translate.get('error-messages.department-no-data', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                }
                console.log(this.departmentList);
            }, (error: any) => {
                this.translate.get('error-messages.department-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            })
    }

    // get sub department list
    getSubDepartment(departmentId) {
        this.AlertManagementService.getSubDepartments(departmentId,this.appService.currentLang).subscribe(
            res => {
                this.subDepartmentList = JSON.parse(res._body);
                if (res._body == []) {
                    this.translate.get('error-messages.sub-department-no-data', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                }
                console.log(this.subDepartmentList);
            }, (error: any) => {
                this.translate.get('error-messages.sub-department-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            })
    }

    // get staff list
    getStaffs(subId) {
        this.AlertManagementService.getStaffBySubDepartments(subId).subscribe(
            res => {
                this.staffList = JSON.parse(res._body);
                if (res._body == []) {
                    this.translate.get('error-messages.staff-no-data', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                }
                console.log(this.staffList);
            }, (error: any) => {
                this.translate.get('error-messages.staff-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            })
    }

    // select staff


    // get systems list
    getSystems() {
        this.AlertManagementService.getSystems().subscribe(
            res => {
                this.systemList = JSON.parse(res._body);
                if (res._body == []) {
                    this.translate.get('error-messages.system-no-data', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                }
                console.log(this.systemList);
            }, (error: any) => {
                this.translate.get('error-messages.system-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );

            })
    }

    // get device list
    getDeviceType(areaId) {
        this.AlertManagementService.getDeviceTypes(areaId).subscribe(
            res => {
                this.deviceList = JSON.parse(res._body);
                if (res._body == []) {
                    this.translate.get('error-messages.device-no-data', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                }
                console.log(this.deviceList);
            }, (error: any) => {
                this.translate.get('error-messages.device-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            })
    }

    // get sub device list
    getSubDeviceType(typeId, areaId) {
        this.AlertManagementService.getSubDeviceTypes(typeId, areaId).subscribe(
            res => {
                this.subDeviceList = JSON.parse(res._body);
                if (res._body.length == 0) {
                    this.translate.get('error-messages.sub-device-no-data', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                }
                console.log(this.subDeviceList);
            }, (error: any) => {
                this.translate.get('error-messages.sub-device-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            })
    }

    // get severity list
    getSevertityList() {
        this.AlertManagementService.getSeverity().subscribe(
            res => {
                this.severityList = JSON.parse(res._body);
                if (res._body.length == 0) {
                    this.translate.get('error-messages.severity-no-data', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                }
                console.log(this.severityList);
            }, (error: any) => {
                this.translate.get('error-messages.severity-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            })
    }

    // execute data
    execute(data) {
        if(this.sendOnlyForAdmin){
            this.alertData.stafflist.splice(0,this.alertData.stafflist.length);
        }
        if (this.popupx) {
            this.alertData.isnotification = 1;
        } else {
            this.alertData.isnotification = 0;
        }

        if (this.emailx) {
            this.alertData.isemail = 1;
        } else {
            this.alertData.isemail = 0;
        }

        if (this.smsx) {
            this.alertData.issms = 1;
        } else {
            this.alertData.issms = 0;
        }

        // this.alertData.isemail = this.emailx;
        // this.alertData.issms = this.smsx;

        console.log(data, 'alert data');
        if (this.addAlert == 0) {
            this.AlertManagementService.updateAlertsList(data).subscribe(
                res => {
                    console.log(res, 'res');
                    if (res._body == 1) {
                        this.translate.get('error-messages.alert-update-success', this.appService.currentLang).subscribe(
                            (subHeaderT) => {
                                this.appService.showSuccess(subHeaderT);
                            }
                        );

                        this.closeModal();
                    }
                    if (res._body == 0) {
                        this.translate.get('error-messages.alert-update-failed', this.appService.currentLang).subscribe(
                            (translateRes) => {
                                this.appService.showFail(translateRes);
                            }
                        );
                    }
                    if (res._body >= 2) {
                        this.appService.generalExceptions(res._body);
                    }
                }, (error: any) => {
                    this.translate.get('error-messages.alert-update-failed', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                })
        } else {
            this.AlertManagementService.createAlertsList(data).subscribe(
                res => {
                    console.log(res, 'res');
                    if (res._body == 1) {
                        this.translate.get('error-messages.alert-add-success', this.appService.currentLang).subscribe(
                            (subHeaderT) => {
                                this.appService.showSuccess(subHeaderT);
                            }
                        );
                        this.closeModal();
                    }
                    if (res._body == 0) {
                        this.translate.get('error-messages.alert-add-failed', this.appService.currentLang).subscribe(
                            (subHeaderT) => {
                                this.appService.showFail(subHeaderT);
                            }
                        );
                    }
                    if (res._body >= 2) {
                        this.appService.generalExceptions(res._body);
                    }
                }, (error: any) => {
                    this.translate.get('error-messages.alert-add-failed', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                })
        }
    }
    SelectStaffAction(staffId) {
        this.AlertManagementService.selectDep(staffId).subscribe(
            res => {
                console.log(res);
                if(res.status == 200) {
                    let deptData = JSON.parse(res._body);
                    this.alertData.departmentid = deptData.key.id ;
                    this.AlertManagementService.getSubDepartments(this.alertData.departmentid,this.appService.currentLang).subscribe(
                        res => {
                            this.subDepartmentList = JSON.parse(res._body);
                            this.alertData.subdepartmentid = deptData.value.id ;
                            this.AlertManagementService.getStaffBySubDepartments(this.alertData.subdepartmentid).subscribe(
                                res => {
                                    this.staffList = JSON.parse(res._body);
                                    for(let staff of this.staffList){
                                        if(staffId==staff.employeeid){
                                            this.staffData=staff;
                                            this.staffIsSelected = true;
                                        }
                                    }
                                    if (res._body == []) {
                                        this.translate.get('error-messages.staff-no-data', this.appService.currentLang).subscribe(
                                            (subHeaderT) => {
                                                this.appService.showFail(subHeaderT);
                                            }
                                        );
                                    }
                                    console.log(this.staffList);
                                }, (error: any) => {
                                    this.translate.get('error-messages.staff-no-data', this.appService.currentLang).subscribe(
                                        (subHeaderT) => {
                                            this.appService.showFail(subHeaderT);
                                        }
                                    );
                                })

                            if (res._body == []) {
                                this.translate.get('error-messages.sub-department-no-data', this.appService.currentLang).subscribe(
                                    (subHeaderT) => {
                                        this.appService.showFail(subHeaderT);
                                    }
                                );
                            }
                            console.log(this.subDepartmentList);
                        }, (error: any) => {
                            this.translate.get('error-messages.sub-department-no-data', this.appService.currentLang).subscribe(
                                (subHeaderT) => {
                                    this.appService.showFail(subHeaderT);
                                }
                            );
                        })



                }

            }

        )
    }
    sortDownStaff(){

        // this.alertData.stafflist.forEach(item => {
        //         if(item.Name == sortBy){
        //             if(item.IsSort == true){
        //                 item.Order = (item.Order == "ASC" ? "DESC" : "ASC" );
        //                 this.order = item.Order;
        //             }
        //             else {
        //                 item.IsSort = true;
        //                 item.Order = "DESC"
        //             }
        //             this.orderBy = item.Name;
        //             this.order = item.Order;
        //         }
        //         else {
        //             item.IsSort = false;
        //             item.Order = ""
        //         }
        //     });
        //     this.getData();
        //

    }
    sortUpStaff(){

    }

}
