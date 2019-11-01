import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../../app.service';
import {DomSanitizer} from '@angular/platform-browser';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {StaffService} from '../staff.service';
import {EmployementDetails, multiLingMap, PersonalInfo} from '../staff';
import {ConfirmModalComponent, LayoutComponent} from '../../../../common';
import {MatDialog} from '@angular/material';
import {ViewStaffComponent} from '../view-staff/view-staff.component';
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
    public limit: number = 10;
    public size: number = 8;
    public totalPages: number;
    public last: boolean;
    public first: boolean;
    public totalElements: number;
    public addClicked = false;

    public searchName: any = '';
    public searchId: any = '';

    public mapT: {
        'id': 0,
        'map': multiLingMap
    }

    public allsearch: any = [];

    public Newstaff: any = [];
    public startPoint: number = 0;
    public endPoint: number = 0;

    public staffs: PersonalInfo[] = [];

    public prepareDepartmentComponentOpenCount;

    public isLoading: boolean = false;

    constructor(
        public translate: TranslateService,
        private appService: AppService,
        private sanitizer: DomSanitizer,
        public  dialog: MatDialog,
        private localStorageService: LocalStorageService,
        private activatedRoute: Router,
        private staffService: StaffService,
        public  layoutComponent: LayoutComponent,
        public sessionStorageService: SessionStorageService,
        public paginationService: PaginationService
    ) {
    }

    ngOnInit() {
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        //this.getNewStaff()
        this.localStorageService.observe('addClicked')
            .subscribe((newValueOfAddClicked) => {
                this.addClicked = newValueOfAddClicked;
                if (this.addClicked && this.activatedRoute.url === '/rsb-modules/organization/staff/managestaff/manage') {
                    this.activatedRoute.navigate(['rsb-modules/organization/staff/managestaff/prepare']);
                }
            });
    }

    // sendHeader(): void {
    //   if (this.subsidiary) {
    //     this
    //       .appService
    //       .sendHeader(this.subsidiary.name, 'staff management','manage cardHolder member', 'add cardHolder');
    //   }
    // }
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject

        let subHeader = '';
        let pageDetails = '';
        let subsidiaryName: '';
        let routeName = '';
        if (this.appService.currentLang == 'en') {
            subsidiaryName = this.subsidiary.name.map.en;
        }
        if (this.appService.currentLang == 'fa') {
            subsidiaryName = this.subsidiary.name.map.fa;
        }
        this.translate.get('sub-header.user-management', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.manage-user', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;

                                this.translate.get('route-name.add-user', this.appService.currentLang).subscribe(
                                    (routeNameT) => {
                                        routeName = routeNameT;
                                        this
                                            .appService
                                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/ALERT-MANAGEMENT-SYSTEM.png');
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
            .updateBreadCrums('STAFF');
    }

    ngAfterViewInit() {
        // Get Area details and render Area on map and Device points
        this.getAllStaffs();
    }

    setPage(status: string) {
        this.page = this.paginationService.setPageStart0(this.page, status, this.totalPages);
        this.getAllStaffs();
    }

    searchEmployee() {


        let ss = true;

        console.log(this.Newstaff);
        let newstaffs: any = [];
        //this.staffs = [];
        if (this.searchName.length > 0) {

            console.log(this.searchName);
            this.Newstaff.forEach(staff => {
                //let st: any  = staff.PersonalInfo;
                //let ut = st.firstName;
                // alert(staff.firstName.indexOf(this.searchName));

                if (staff.firstName.toLowerCase().indexOf(this.searchName.toLowerCase()) !== -1) {
                    //   alert('came in');
                    if (newstaffs.length == 8)
                        newstaffs = [];
                    newstaffs.push(staff);
                    ss = false;

                }
                if (staff.lastName.toLowerCase().indexOf(this.searchName.toLowerCase()) !== -1) {
                    //   alert('came in');

                    if (newstaffs.length == 8)
                        newstaffs = [];
                    newstaffs.push(staff);
                    ss = false;
                }

                this.staffs = newstaffs;

            });

        }


        else if (this.searchId.length > 0) {
            console.log(this.searchId);
            // console.log(this.searchName);
            this.staffs.forEach(staff => {
                //let st: any  = staff.PersonalInfo;
                //let ut = st.firstName;
                //    alert(staff.firstName.indexOf(this.searchName));
                if (staff.employmentDetails.employeeId.toLowerCase().indexOf(this.searchId.toLowerCase()) !== -1) {
                    //   alert('came in');
                    newstaffs = [];
                    newstaffs.push(staff);

                }
                this.staffs = newstaffs;

            });
        }
        else {
            this.getAllStaffs();
        }


    }

    getAllStaffs() {

        // if (this.page === 1) {
        //   this.staffs = [];
        // }

        if (!this.searchName)
            this.searchName = '';

        if (!this.searchId)
            this.searchId = '';

        //this.isLoading = true;
        this.staffService
            .searchAllStaffs(this.searchName, this.searchId, this.size, this.page, this.appService.currentLang)
            .subscribe((res) => {
                this.isLoading = false;
                let allStaffs = JSON.parse(res._body);
                this.allsearch = allStaffs.content;
                this.first = allStaffs.first;
                this.last = allStaffs.last;
                this.totalPages = allStaffs.totalPages;
                this.totalElements = allStaffs.totalElements;

                this.staffs.splice(0, this.staffs.length);
                allStaffs.content.forEach(staff => {
                    console.log(staff.auditparams.isActive);
                    if (staff.firstNameMultiLingual == null) {
                        staff.firstNameMultiLingual = this.mapT;
                    }
                    if (staff.lastNameMultiLingual == null) {
                        staff.lastNameMultiLingual = this.mapT;
                    }
                    if (staff.fatherNameMultiLingual == null) {
                        staff.fatherNameMultiLingual = this.mapT;
                    }
                    if (staff.resAddressMultiLingual == null) {
                        staff.resAddressMultiLingual = this.mapT;
                    }
                    if (staff.permAddressMultiLingual == null) {
                        staff.permAddressMultiLingual = this.mapT;
                    }
                    if (staff.auditparams.isActive === 'IN_ACTIVE') {
                    } else {
                        let employmentDetails: EmployementDetails = new EmployementDetails({});
                        if (staff.employments !== undefined && staff.employments.length > 0) {
                            employmentDetails = new EmployementDetails(staff.employments[0]);
                        }
                        let staffObject = new PersonalInfo(staff, this.organization.id, this.subsidiary.id, employmentDetails);
                        if (staffObject.phtoId !== '') {
                            this
                                .staffService
                                .getProfilePicture(staffObject.phtoId)
                                .subscribe(res => {
                                    const imageData = JSON.parse(res._body).data;
                                    const contentType = JSON.parse(res._body).contentType;
                                    const profilePicture = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + imageData);
                                    staffObject.profileImage = profilePicture;
                                }, (error: any) => {
                                });
                        } else {
                            staffObject.profileImage = '../../../../../assets/images/Profile_Pic.png';
                        }
                        this.staffs.push(staffObject);
                    }


                });
                // console.log('33333333333333333', this.staffs);
            });
    }

    getNewStaff() {
        this.Newstaff = [];
        // if (this.page === 1) {
        //   this.staffs = [];
        // }
        this.isLoading = true;
        this.staffService
            .getAllStaffs(0, 0)
            .subscribe((res) => {
                this.isLoading = false;
                let allStaffs = JSON.parse(res._body);
                this.allsearch = allStaffs.content;
                this.first = allStaffs.first;
                this.last = allStaffs.last;
                this.totalPages = allStaffs.totalPages;
                this.totalElements = allStaffs.totalElements;
                allStaffs.content.forEach(staff => {
                    console.log(staff.auditparams.isActive);
                    if (staff.auditparams.isActive === 'IN_ACTIVE') {
                    } else {
                        let employmentDetails: EmployementDetails = new EmployementDetails({});
                        if (staff.employments !== undefined && staff.employments.length > 0) {
                            employmentDetails = new EmployementDetails(staff.employments[0]);
                        }
                        let staffObject = new PersonalInfo(staff, this.organization.id, this.subsidiary.id, employmentDetails);
                        if (staffObject.phtoId !== '') {
                            this
                                .staffService
                                .getProfilePicture(staffObject.phtoId)
                                .subscribe(res => {
                                    const imageData = JSON.parse(res._body).data;
                                    const contentType = JSON.parse(res._body).contentType;
                                    const profilePicture = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + imageData);
                                    staffObject.profileImage = profilePicture;
                                }, (error: any) => {
                                });
                        } else {
                            staffObject.profileImage = '../../../../../assets/images/Profile_Pic.png';
                        }
                        this.Newstaff.push(staffObject);
                    }


                });
            });

    }

    deleteStaff(staff) {
        let deleteUrl = '/rsb-security/security/staff/deleteStaff?staffId=' + staff.id;

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
                this.page = 0;
                this.getAllStaffs();
                this.localStorageService.store('addClicked', false);
            });
    }

    viewStaff(staff) {
        this.sessionStorageService.store('staff', staff);
        let viewStaffData = {
            'staff': staff
        };
        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(ViewStaffComponent, {
                width: '1024px',
                height: '768px',
                data: viewStaffData,
                hasBackdrop: true
            });

        dialogRef
            .afterClosed()
            .subscribe(result => {
                this.getAllStaffs();
                this
                    .layoutComponent
                    .removeClass();
            });
    }

}
