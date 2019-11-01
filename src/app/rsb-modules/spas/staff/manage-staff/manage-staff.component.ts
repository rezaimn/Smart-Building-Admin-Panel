import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../../app.service';
import {DomSanitizer} from '@angular/platform-browser';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {StaffService} from '../staff.service';
import {cardHolder} from '../../access-model';
import {LayoutComponent} from '../../../../common';
import {MatDialog} from '@angular/material';
import {ViewStaffComponent} from '../view-staff/view-staff.component';
import {Department, Designation, SubDepartment} from '../../../organizations/staff/staff';
import {PaginationService} from '../../../../pagination-service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-manage-staff',
    templateUrl: './manage-staff.component.html',
    styleUrls: ['./manage-staff.component.scss']
})
export class ManageStaffComponent implements OnInit {

    @SessionStorage('organization')
    public organization;

    @SessionStorage('subsidiary')
    public subsidiary;

    public page: number = 0;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;
    public Newstaff: any = [];

    public totalElements: number;


    public startPoint: number = 0;
    public endPoint: number = 0;

    public addClicked = false;
    public staffArrayTemp: cardHolder[] = [];
    public staffs: cardHolder[] = [];
    public paginatedStaff: cardHolder[] = [];
    public departmentId: number = -1;
    public subDepartmentId: number = -1;
    public status: string = 'ALL';
    public searchName: any;
    public searchId: any;


    public prepareDepartmentComponentOpenCount;
    public departments: Department[] = [];
    public subdepartments: SubDepartment[] = [];

    public department: Department = new Department();

    public subDepartment: Department = new Department();


    public isLoading: boolean = false;
    public employeeSample: any = 22;

    constructor(
        public appService: AppService,
        private sanitizer: DomSanitizer,
        public  dialog: MatDialog,
        private localStorageService: LocalStorageService,
        private activatedRoute: Router,
        private staffService: StaffService,
        public  layoutComponent: LayoutComponent,
        public sessionStorageService: SessionStorageService,
        public paginationService: PaginationService,
        public translate: TranslateService
    ) {
        //this.departments="";
    }

    ngOnInit() {

        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.getDepartmentDetails();
        this.getAllStaffs();
        // this.getNewStaff();
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )

        this.localStorageService.observe('addClicked')
            .subscribe((newValueOfAddClicked) => {
                this.addClicked = newValueOfAddClicked;
                //   if (this.addClicked && this.activatedRoute.url === '/rsb-modules/organization/staff/managestaff/manage') {
                //   this.activatedRoute.navigate(['rsb-modules/organization/staff/managestaff/prepare']);
                // }
            });
    }

    getDepartmentDetails() {
        this.departments = [];
        this
            .staffService
            .getDepartmentDetails(this.appService.currentLang)
            .subscribe(res => {
                if (res.status === 200) {
                    let departmentDetails = JSON.parse(res._body);
                    departmentDetails.forEach(department => {
                        let sds: SubDepartment[] = [];
                        if (department.subDepartments !== undefined && department.subDepartments.length > 0) {
                            department.subDepartments.forEach(subdepartment => {
                                let dss: Designation[] = [];
                                if (subdepartment.designations !== undefined && subdepartment.designations.length > 0) {
                                    subdepartment.designations.forEach(designation => {
                                        let dObject = new Designation(designation);
                                        dss.push(dObject);
                                    });
                                }
                                let sdObject = new SubDepartment(subdepartment, dss);
                                sds.push(sdObject);
                            });
                        }

                        let ds: Designation[] = [];
                        if (department.designations !== undefined && department.designations.length > 0) {
                            department.designations.forEach(designation => {
                                let dObject = new Designation(designation);
                                ds.push(dObject);
                            });
                        }

                        let dptObject = new Department(department, sds, ds);
                        this.departments.push(dptObject);
                    });
                    //console.log("tttttttttttttttttttttttttt",this.departments);
                }

            }, (error: any) => {

            });

    }


    updateSubDepartments(event) {
        this.subdepartments = [];
        // console.log(event);
        this.departments.forEach(department => {
            //   console.log(department)
            if (department.id === event) {
                department.subdepartments.forEach(dep => {
                    this.subdepartments.push(dep);
                });
            }

            // this.subdepartments.push(department.subdepartments);
            // console.log(this.subdepartments);
        });
        if (this.subdepartments.length == 0) {
            this.subDepartmentId = -1;
        }
        //  console.log(this.subdepartments);
    }


    // sendHeader(): void {

    //   if (this.subsidiary) {
    //     this
    //       .appService
    //       .sendHeader(this.subsidiary.name, 'smart access management','manage access card', '');
    //   }
    // }
    // sendHeaderWithLogo(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.subsidiary) {
    //     this
    //       .appService
    //       .sendHeaderWithLogo(this.subsidiary.name, 'smart access management','manage access card', '','../../../../../assets/images/dashboard/SMART_PHYSICAL_ACCESS_SYSTEM.png');
    //   }
    // }

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
        // let routeName='';
        this.translate.get('sub-header.manage-access-card', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.smart-access-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;


                        this
                            .appService
                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, '', '../../../../../assets/images/dashboard/SMART_PHYSICAL_ACCESS_SYSTEM.png');

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

    ngAfterViewInit() {
        // Get Area details and render Area on map and Device points
        //this.getAllStaffs();
    }

    getAllStaffs() {


        if (!this.departmentId) {
            this.departmentId = -1;
        }
        if (!this.subDepartmentId) {
            this.subDepartmentId = -1;
        }
        if (!this.status) {
            this.status = 'ALL';
        }

        if (!this.searchName) {
            this.searchName = '';
        }

        if (!this.searchId) {
            this.searchId = '';
        }


        this.isLoading = true;
        this.staffService
            .getAllStaffsByDeptSubDept(this.perPage, this.page, this.departmentId, this.subDepartmentId, this.searchName, this.searchId)
            .subscribe((res) => {
                this.staffArrayTemp.splice(0, this.staffArrayTemp.length);
                this.isLoading = false;
                let allStaffs = JSON.parse(res._body);
                allStaffs.content.forEach(staff => {
                    let staffObject = new cardHolder(staff);
                    //
                    // this.staffService
                    //     .getPolicyDetails(staffObject.id)
                    //     .subscribe((res) => {
                    //         //this.policyObject = new PolicyViewObject(JSON.parse(res._body), this.now.format('YYYY-MM-DD') + 'T');
                    //
                    //         const depData = JSON.parse(res._body);
                    //         staffObject.department.name = depData.deptnameMultiLingual;
                    //         staffObject.subDepartment.name = depData.subDeptnameMultiLingual;
                            staffObject.id = 0;
                            staffObject.cardNumber = '';
                            staffObject.employeeId = staff.employments[0].employeeId;
                            this.staffArrayTemp.push(staffObject);
                        //
                        // }, (err) => {
                        //
                        // });


                });
                this.staffService.getAllCardHolders().subscribe(
                    (res: any) => {
                        let cardHolders = JSON.parse(res._body);
                        for (let i = 0; i < this.staffArrayTemp.length; i++) {
                            for (let CH of cardHolders) {
                                if (this.staffArrayTemp[i].employeeId == CH.employeeId) {
                                    if (CH.workgroup != null) {
                                        this.staffArrayTemp[i].workgroup = CH.workgroup;
                                    }
                                    if (CH.accessElement != null) {
                                        this.staffArrayTemp[i].accessElement = CH.accessElement;
                                    }
                                    if (CH.timeSchedule != null) {
                                        this.staffArrayTemp[i].timeSchedule = CH.timeSchedule;
                                    }
                                    if (CH.contractStartDate != null) {
                                        this.staffArrayTemp[i].contractStartDate = CH.contractStartDate;
                                    }
                                    if (CH.contractEndDate != null) {
                                        this.staffArrayTemp[i].contractEndDate = CH.contractEndDate;
                                    }
                                    if (CH.startDate != null) {
                                        this.staffArrayTemp[i].startDate = CH.startDate;
                                    }
                                    if (CH.endDate != null) {
                                        this.staffArrayTemp[i].endDate = CH.endDate;
                                    }
                                    if (CH.enabled != null) {
                                        this.staffArrayTemp[i].enabled = CH.enabled;
                                    }
                                    this.staffArrayTemp[i].cardNumber = CH.cardNumber;
                                    this.staffArrayTemp[i].id = CH.id;
                                }
                            }
                        }
                        this.localPagination();
                    }
                )

            });
    }

    localPagination() {

        this.paginatedStaff.splice(0, this.paginatedStaff.length);
        this.staffArrayTemp.forEach(staff => {
                if (staff.cardNumber != '' && this.status == 'ASSIGNED') {
                    this.paginatedStaff.push(staff);
                }
                if (staff.cardNumber == '' && this.status == 'UNASSIGNED') {
                    this.paginatedStaff.push(staff);
                }
                if (this.status == 'ALL') {
                    this.paginatedStaff.push(staff);
                }
            }
        )
        this.totalRecordsCount = this.paginatedStaff.length;
        var x = this.totalRecordsCount % this.perPage;
        var y = this.totalRecordsCount - x;
        if (x == 0) {
            this.totalPages = y / this.perPage;
        } else {
            this.totalPages = y / this.perPage + 1;
        }
        this.getPageData();
    }

    getPageData() {
        let counter=0;
        this.staffs.splice(0,this.staffs.length);
        for(let staff of this.paginatedStaff){
            if(counter>=this.page*this.perPage && counter<(this.page+1)*this.perPage){
                this.staffs.push(staff);
            }
            counter=counter+1;
        }
       // console.log("sssssssssssssssssssssss",this.staffs);
    }

    enableCardHolder(enable, index) {
        this.staffs[index].loader = true;
        this.staffs[index].enabled = enable;
        let cardHolderT:cardHolder=new cardHolder({});
        if(this.staffs[index].timeSchedule.id==0){
            cardHolderT.timeSchedule=null;
        }else{
            cardHolderT.timeSchedule=this.staffs[index].timeSchedule;
        }
        if(this.staffs[index].accessElement.id==0){
            cardHolderT.accessElement=null;
        }else{
            cardHolderT.accessElement=this.staffs[index].accessElement;
        }
        cardHolderT.firstName=this.staffs[index].firstNameMultiLingual.map.en;
        cardHolderT.lastName=this.staffs[index].lastNameMultiLingual.map.en;
        cardHolderT.enabled=enable;
        cardHolderT.cardNumber=this.staffs[index].cardNumber;
        cardHolderT.workgroup=this.staffs[index].workgroup;
        cardHolderT.firstNameMultiLingual=this.staffs[index].firstNameMultiLingual;
        cardHolderT.lastNameMultiLingual=this.staffs[index].lastNameMultiLingual;
        cardHolderT.id=this.staffs[index].id;
        cardHolderT.contractEndDate=this.staffs[index].contractEndDate;
        cardHolderT.contractStartDate=this.staffs[index].contractStartDate;
        cardHolderT.endDate=this.staffs[index].endDate;
        cardHolderT.startDate=this.staffs[index].startDate;
        cardHolderT.mobileNum=this.staffs[index].mobileNum;
        cardHolderT.employeeId=this.staffs[index].employeeId;
        this
            .staffService
            .updateCardHolder(cardHolderT)
            .subscribe((data) => {
                if(data._body!=""){
                    let cardHolder = JSON.parse(data._body);
                    this.staffs[index].enabled = cardHolder.enabled;
                }else{
                    this.staffs[index].enabled = !enable;
                }
                this.staffs[index].loader = false;
            }, (error) => {
                this.staffs[index].enabled = !enable;
                this.staffs[index].loader = false;
            });
    }

    viewStaff(staffIndex, mode) {
        console.log("iiiiiiiiiiiinnnnnnnnnnnnnnnnnn");

        let viewStaffData = {
            'cardholder': this.staffs[staffIndex],
            'mode': mode
        };

        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(ViewStaffComponent, {
                width: '780px',
                data: viewStaffData,
                hasBackdrop: true
            });

        dialogRef
            .afterClosed()
            .subscribe(result => {
                console.log("ooooooooouttttttttttttttttttttt");
                this.getPageData();
                this
                    .layoutComponent
                    .removeClass();
            });
    }

    setPage(status: string) {
        this.page = this.paginationService.setPageStart0(this.page, status, this.totalPages);
        this.getPageData();
    }
}
