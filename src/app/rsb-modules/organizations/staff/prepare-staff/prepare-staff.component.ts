import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from '../../../../app.service';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {Department, Designation, EmployementDetails, PersonalInfo, StaffPolicy, StaffVehicle, SubDepartment} from '../staff';
import {DateAdapter} from '@angular/material';
import {StaffService} from '../staff.service';
import {Router} from '@angular/router';
//import {setTimeout} from 'timers';
import {TranslateService} from '@ngx-translate/core';
import {CalendarConverterService} from '../../../../calendar-converter-service';
import * as moment from 'jalali-moment';
import {DatePipe} from '@angular/common';
@Component({
    selector: 'app-prepare-staff',
    templateUrl: './prepare-staff.component.html',
    styleUrls: ['./prepare-staff.component.scss']
})
export class PrepareStaffComponent implements OnInit, OnDestroy {

    @SessionStorage('organization')
    public organization;

    @SessionStorage('subsidiary')
    public subsidiary;
    @SessionStorage('editStaffObj')
    public editStaffObj;
    @SessionStorage('editStaffStep')
    public editStaffStep;
    @SessionStorage('editStaffMessage')
    public editStaffMessage;
    @SessionStorage('staff')
    public staff;
    public invalidEmpid: Boolean = false;
    public message: any = '';
    public image;
    // Generic
    public step: number = 1;
    public mode = '';
    public myDate: Date;
    public form: any = document.getElementsByTagName('form');
    public staffId: number = 0;
    public executingStaffCreation: boolean = false;

    // Personal Info
    public personalInfo: PersonalInfo = new PersonalInfo({}, this.organization.id, this.subsidiary.id, new EmployementDetails({}));
    public formData = new FormData(); // Create a formdata variable to send the uploaded Profile Picture
    public fileName: string; // Variable to the file name of the uploaded file
    public fileChanged = false;
    public fileTypeError = false;
    public profilePictureUploaded = false;

    // Employement Details
    public staffs: PersonalInfo[] = [];
    public employementDetails: EmployementDetails = new EmployementDetails({});

    //Policy Details
    public policyDetails: StaffPolicy = new StaffPolicy({});
    public departments: Department[] = [];
    public subdepartments: SubDepartment[] = [];
    public designations: Designation[] = [];
    public grades: any = [];
    public allowanceSelected: boolean = false;
    public allowancePolicies: any = [];
    public selectedAllowance: any = {};
    public workTimeSelected: boolean = false;
    public workTimePolicies: any = [];
    public selectedWorkTimePolicy: any = {};

    // Vehicle Details
    public vehicleDetails: StaffVehicle[] = [];
    public carOnePresent: boolean = true;
    public carOne: StaffVehicle = new StaffVehicle({});
    public carTwoPresent: boolean = false;
    public carTwo: StaffVehicle = new StaffVehicle({});
    public alertObj: any = {};
    public currentDate: any;
    public pickedCar1Date: any;
    public car1Date: any;
    public pickedCar2Date: any;
    public car2Date: any;
    public pickedDateStaff: any;
    public staffDate: any; //= "02/03/2018";//current date
    public pickedHireDate: any;
    public hireDate: any; //= "02/03/2018";//current date

    constructor(

        public translate: TranslateService,
        private appService: AppService,
        private staffService: StaffService,
        private router: Router,
        private datePipe: DatePipe,
        private localStorageService: LocalStorageService,
        private calendarConverter: CalendarConverterService,
        public dateAdapter: DateAdapter<Date>) {
        // console.log("2222222222222222222222",this.personalInfo);
        //  set the date format in dd-mm-yyyy format
        let now = new Date();
        this.dateAdapter.setLocale('en-In');
        this.currentDate = this.datePipe.transform(now, 'dd/MM/yyyy');
        this.pickedCar1Date = new Date(now);
        this.car1Date = this.currentDate;
        this.pickedCar2Date = new Date(now);
        this.car2Date = this.currentDate;
        this.pickedDateStaff = new Date(now);
        this.staffDate = this.currentDate;
        this.pickedHireDate = new Date(now);
        this.hireDate = this.currentDate;
        if (this.editStaffObj !== null && this.editStaffStep !== null && this.editStaffMessage !== null) {
            this.step = this.editStaffStep ? this.editStaffStep : 1;
            switch (this.step) {
                case 1:
                    this.staffDate=this.datePipe.transform(this.editStaffObj.dob, 'dd/MM/yyyy');
                    if(this.appService.currentLang=='fa'){
                        let jalaliStaff=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.staffDate));
                        this.pickedDateStaff=moment(jalaliStaff,'jYYYY,jMM,jDD');
                    }
                    if(this.appService.currentLang=='en'){
                        this.pickedDateStaff= new Date(this.calendarConverter.convertDateFormat(this.staffDate));
                    }

                    this.personalInfo = new PersonalInfo(this.editStaffObj, this.organization.id, this.subsidiary.id, new EmployementDetails({}));

                    break;
                case 2:

                    this.hireDate=this.datePipe.transform(this.editStaffObj.doj, 'dd/MM/yyyy');

                    if(this.appService.currentLang=='fa'){
                        let jalaliHire=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.hireDate));
                        this.pickedHireDate=moment(jalaliHire,'jYYYY,jMM,jDD');
                    }
                    if(this.appService.currentLang=='en'){
                        this.pickedHireDate= new Date(this.calendarConverter.convertDateFormat(this.hireDate));
                    }
                    this.employementDetails = new EmployementDetails(this.editStaffObj);
                    this.employementDetails.lineSupervisorId = parseInt(this.editStaffObj.lineSupervisorId);
                    this.employementDetails.lineMgrId = parseInt(this.editStaffObj.lineMgrId);
                    break;
                case 3:
                    this.getPolicyDetails();
                    this.policyDetails = new StaffPolicy(this.editStaffObj);
                    console.log();
                    break;
                case 4:
                    this.carOne = new StaffVehicle(this.editStaffObj[0]);
                    if (this.editStaffObj.length > 1) {
                        this.carTwo = new StaffVehicle(this.editStaffObj[1]);
                    }
                    break;
                // default:
                //   break;
            }
            this.message = this.editStaffMessage;

        }
    }

    // @ViewChild('preparePersonalInfoForm')
    // public preparePersonalInfoForm;

    ngOnInit() {
        if(this.appService.currentLang=='fa'){
            let jalaliCar1=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.car1Date));
            this.pickedCar1Date=moment(jalaliCar1,'jYYYY,jMM,jDD');
            let jalaliCar2=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.car2Date));
            this.pickedCar2Date=moment(jalaliCar2,'jYYYY,jMM,jDD');
            let jalaliStaff=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.staffDate));
            this.pickedDateStaff=moment(jalaliStaff,'jYYYY,jMM,jDD');
            let jalaliHire=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.hireDate));
            this.pickedHireDate=moment(jalaliHire,'jYYYY,jMM,jDD');
        }
        if(this.appService.currentLang=='en'){
            this.pickedCar1Date=new Date(this.calendarConverter.convertDateFormat(this.car1Date));
            this.pickedCar2Date=new Date(this.calendarConverter.convertDateFormat(this.car2Date));
            this.pickedDateStaff=new Date(this.calendarConverter.convertDateFormat(this.staffDate));
            this.pickedHireDate=new Date(this.calendarConverter.convertDateFormat(this.hireDate));
        }

        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        // this.myDate = new Date();

        // Staff Details for Step 2
        this.getAllStaffs();

        // Department Details for Step 3
        this.getDepartmentDetails();
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                if(res=='fa'){
                    let jalaliCar1=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.car1Date));
                    this.pickedCar1Date=moment(jalaliCar1,'jYYYY,jMM,jDD');
                    let jalaliCar2=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.car2Date));
                    this.pickedCar2Date=moment(jalaliCar2,'jYYYY,jMM,jDD');
                    let jalaliStaff=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.staffDate));
                    this.pickedDateStaff=moment(jalaliStaff,'jYYYY,jMM,jDD');
                    let jalaliHire=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.hireDate));
                    this.pickedHireDate=moment(jalaliHire,'jYYYY,jMM,jDD');
                }
                if(res=='en'){
                    this.pickedCar1Date=new Date(this.calendarConverter.convertDateFormat(this.car1Date));
                    this.pickedCar2Date=new Date(this.calendarConverter.convertDateFormat(this.car2Date));
                    this.pickedDateStaff=new Date(this.calendarConverter.convertDateFormat(this.staffDate));
                    this.pickedHireDate=new Date(this.calendarConverter.convertDateFormat(this.hireDate));

                }
                this.sendHeaderWithLogo();
            }
        )
    }

    // sendHeader(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.subsidiary !== null) {
    //     this
    //       .appService
    //       .sendHeader(this.subsidiary.name, 'add staff', 'create cardHolder member', '');
    //   }
    // }
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        if (this.subsidiary !== null) {
            let subHeader = '';
            let pageDetails = '';
            let subsidiaryName: '';
            if (this.appService.currentLang == 'en') {
                subsidiaryName =  this.subsidiary.name.map.en;
            }
            if (this.appService.currentLang == 'fa') {
                subsidiaryName =  this.subsidiary.name.map.fa;
            }

            let routeName = '';
            this.translate.get('sub-header.add-user', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.create-staff-member', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;

                                    this
                                        .appService
                                        .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/OMS.png');

                        }
                    );
                }
            );
        }
    }
    updateBreadCrums() {
        this
            .appService
            .updateBreadCrums('STAFF');
    }

    goToPage(cmd) {
        // console.log("555555555555555555",this.personalInfo);
        if (cmd == 'next') {
            this.step += 1;
        } else {
            this.step -= 1;
        }
    }

    startCreatingStaff() {
        // debugger;
        this.executingStaffCreation = true;

        if (this.profilePictureUploaded) {
            //Upload the Photo First, Which is not mandatory
            this.uploadProfilePicture(this.personalInfo);
        } else {
            this.createStaff(this.personalInfo);
        }
    }
    convertJalaliDateToUTCCar1(tempDate: any) {
        this.car1Date = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
    }
    convertGregorianDateToUTCCar1(tempDate: any) {
        this.car1Date= this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
    }
    convertJalaliDateToUTCCar2(tempDate: any) {
        this.car2Date = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
    }
    convertGregorianDateToUTCCar2(tempDate: any) {
        this.car2Date= this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
    }
    convertJalaliDateToUTCStaff(tempDate: any) {
        this.staffDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
    }
    convertGregorianDateToUTCStaff(tempDate: any) {
        this.staffDate= this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
    }
    convertJalaliDateToUTCHire(tempDate: any) {
        this.hireDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
    }
    convertGregorianDateToUTCHire(tempDate: any) {
        this.hireDate= this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
    }
    storeProfilePicture(event) {
        const file = event.target.files[0];
        this.image = file.name;
        if (event.target.files && file) {
            this.formData.append('fileUpload', file);
            if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') {
                this.fileTypeError = true;
            } else {
                this.fileTypeError = false;
                this.fileName = file.name;
                this.profilePictureUploaded = true;
                this.fileChanged = true;
            }
        }
        console.log(this.image);
    }

    uploadProfilePicture(personalInfo: PersonalInfo) {
        // debugger;
        this.staffService.uploadProfilePicture(this.formData).subscribe(res => {
            if (res.json().response) {
                personalInfo.phtoId = res.json().response;
                //Once the Profile Photo Uploaded. Create the Staff
                this.createStaff(personalInfo);
            }
        }, (error: any) => {
            this.createStaffError('Error while iploading the profile picture');
        });
    }

    createStaffError(message) {
        this.executingStaffCreation = false;
        // this.snackBar.open(message, 'Ok', {
        //   duration: 5000
        // });
    }

    createStaff(personalInfo: PersonalInfo) {

        //Remove the unwanted Details when Making API calls
        delete personalInfo.id;
        delete personalInfo.profileImage;
        delete personalInfo.employmentDetails;
        personalInfo.dob=this.staffDate;
        this.staffService.createStaff(personalInfo,this.appService.currentLang)
            .subscribe(res => {
                // Get the Staff Id from the Response and Make API calls for,
                // Employment, Policy, Vehicle
                let staff = JSON.parse(res._body);
                // Assign the Id coming from the API response
                let staffId = staff.id;
                //Make Serial Calls for Proper flow
                this.addEmployment(this.employementDetails, staffId);
            }, (err: any) => {
                this.createStaffError('error occured while creating the staff');
            })
    }

    addEmployment(employementDetails: EmployementDetails, staffId: number) {
        employementDetails.staffId = staffId;
        employementDetails.doj=this.hireDate;
        delete employementDetails.id;
        this.staffService.addEmployment(employementDetails)
            .subscribe(res => {
                this.addPolicy(this.policyDetails, staffId);
            }, (err: any) => {
                this.createStaffError('error occured while adding the employment details');
            });
    }

    addPolicy(policyDetails: StaffPolicy, staffId) {

        console.log(policyDetails);
        delete policyDetails.id;
        policyDetails.staffId = staffId;
        // API to integrate
        this.staffService.addPolicy(policyDetails)
            .subscribe(res => {
                this.addVehicles(staffId);
            }, (err: any) => {
                console.log(err);
                this.createStaffError('error occured while adding the staff details');
            });
    }

    addVehicles(staffId: any) {
        if (this.carOnePresent) {
            delete this.carOne.id;
            this.carOne.staffId = staffId;
            this.carOne.expDate=this.car1Date;
            this.vehicleDetails.push(this.carOne);

        }
        if (this.carTwoPresent) {
            this.carTwo.expDate=this.car2Date;
            delete this.carTwo.id;
            this.carTwo.staffId = staffId;
            this.vehicleDetails.push(this.carTwo);
        }
// console.log("wwwwwwwwwwwwwww",this.carOne);
        if (this.carOnePresent || this.carOnePresent) {
            this.staffService.addVehicles(this.vehicleDetails,this.appService.currentLang)
                .subscribe(res => {
                    // Once the add is Successful. Navigate to Manage Screen.
                    this.executingStaffCreation = false;
                    // this.snackBar.open('Staff Member added Successfully', 'Ok', {
                    //   duration: 3000
                    // });
                    let self = this;
                    setTimeout(function () {
                        self.router.navigate(['/rsb-modules/organization/staff/managestaff/manage']);
                    }, 2000);
                }, (err: any) => {
                    this.createStaffError('error occured while adding the vehicle details');
                });
        } else {
            this.executingStaffCreation = false;
            // this.snackBar.open('Staff Member added Successfully', 'Ok', {
            //   duration: 3000
            // });
        }

    }

    removeVehicle(whichNumber) {
        if (whichNumber === 1) {
            this.carOnePresent = false;
        } else if (whichNumber === 2) {
            this.carTwoPresent = false;
        }
    }

    addVehicle(whichNumber) {
        if (whichNumber === 1) {
            this.carOnePresent = true;
        } else if (whichNumber === 2) {
            this.carTwoPresent = true;
        }
    }

    getDepartmentDetails() {
        this.departments.splice(0,this.departments.length);
        this
            .staffService
            .getDepartmentDetails()
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
                }
                console.log("ttttttttttttttttttt",this.departments);
            }, (error: any) => {

            });
    }

    updateSubDepartments(event) {
        this.subdepartments = [];
        this.policyDetails.subDepartmentId = 0;
        this.designations = [];
        this.policyDetails.designationId = 0;

        this.departments.forEach(department => {
            if (department.id === this.policyDetails.departmentId) {
                this.subdepartments = department.subdepartments;
                this.designations = department.designations;
            }
        });
    }

    updateDegisnations(event) {
        this.resetPolicies();
        this.designations = [];
        this.policyDetails.designationId = 0;

        if (this.policyDetails.subDepartmentId == 0) {
            this.departments.forEach(department => {
                if (department.id === this.policyDetails.departmentId) {
                    this.designations = department.designations;
                }
            });
        } else {
            this.subdepartments.forEach(department => {
                if (department.id === this.policyDetails.subDepartmentId) {
                    this.designations = department.designations;
                }
            });
        }
    }

    getAllStaffs() {
        this.staffService
            .getAllStaffs(0, 0)
            .subscribe((res) => {
                let allStaffs = JSON.parse(res._body);
                allStaffs.content.forEach(staff => {
                    let employmentDetails: EmployementDetails;
                    if (staff.employments !== undefined && staff.employments.length > 0) {
                        employmentDetails = new EmployementDetails(staff.employments[0]);
                    }
                    let staffObject = new PersonalInfo(staff, this.organization.id, this.subsidiary.id, employmentDetails);
                    this.staffs.push(staffObject);
                });
            });
    }

    showAllowancePolicy(event) {
        this.policyDetails.gradeId = event;
        this.allowanceSelected = false;
        this.allowancePolicies.forEach((allowance) => {
            if (allowance.gradePolicy.id == this.policyDetails.gradeId) {
                this.allowanceSelected = true;
                this.selectedAllowance = allowance;
                this.policyDetails.allownce = allowance.id;
            }
        });
    }

    showWorkTimePolicy(event) {
        this.policyDetails.worktimePolicyGroupId = event;
        this.workTimeSelected = false;
        this.workTimePolicies.forEach((worktime) => {
            if (worktime.id == this.policyDetails.worktimePolicyGroupId) {
                this.workTimeSelected = true;
                this.selectedWorkTimePolicy = worktime;
                this.policyDetails.workTimePolicyId = worktime.workTimePolicy.id;
            }
        });
    }

    resetPolicies() {
        this.grades = [];
        this.policyDetails.gradeId = 0;
        this.allowanceSelected = false;
        this.selectedAllowance = {};
        this.allowancePolicies = [];
        this.policyDetails.allownce = 0;

        this.workTimeSelected = false;
        this.workTimePolicies = [];
        this.policyDetails.workTimePolicyId = 0;
        this.policyDetails.worktimePolicyGroupId = 0;
    }

    updatePolicies(event) {


        this.resetPolicies();

        // Get Grades
        this.getGradePolicies();

        // Get Allowance
        this.getAllowancePolicies();

        // Get Work Time
        this.getWorkTimePolicies();
    }

    getAllowancePolicies() {
        if (this.policyDetails.designationId === 0) {
            return;
        }
        this
            .staffService
            .getAllowancePolicies(this.policyDetails.designationId)
            .subscribe((response) => {
                this.allowancePolicies = JSON.parse(response._body);
            }, (error) => {
            });
    }

    getWorkTimePolicies() {

        if (this.policyDetails.designationId === 0) {
            return;
        }
        this
            .staffService
            .getWorkTimePolicies(this.policyDetails.designationId)
            .subscribe((response) => {
                if (response._body !== '') {
                    let workTimePoliciesObject = JSON.parse(response._body);
                    if (workTimePoliciesObject.workTimeGroupRelation !== null) {
                        this.workTimePolicies = workTimePoliciesObject.workTimeGroupRelation;
                    }
                }
            }, (error) => {
            });
    }

    getGradePolicies() {
        if (this.policyDetails.designationId === 0) {
            return;
        }
        this
            .staffService
            .getGrades(this.policyDetails.designationId)
            .subscribe(res => {
                if (res.status === 200 && res._body !== '') {
                    let selectedGradeArrFromApi = JSON.parse(res._body);
                    if (selectedGradeArrFromApi !== '') {
                        this.grades = selectedGradeArrFromApi.gradePolicy;
                    }
                }
            }, (error: any) => {
            });
    }

    closeModal() {
        this.editStaffObj = null;
        this.editStaffStep = null;
        this.editStaffMessage = null;
        this.router.navigate(['/rsb-modules/organization/staff/managestaff/manage']);
    }

    onSubmit() {

    }

    ngOnDestroy() {
        this.localStorageService.store('addClicked', false);
        this.editStaffObj = null;
        this.editStaffStep = null;
        this.editStaffMessage = null;
        this.step = 1;
    }

    updateStepOne(personalInfo: PersonalInfo) {
        //Remove the unwanted Details when Making API calls
        // delete personalInfo.id;
        // delete personalInfo.profileImage;
        // delete personalInfo.employmentDetails;
        // this.uploadProfilePicture(personalInfo);
        // this.startCreatingStaff();
        // uploadProfilePicture(personalInfo: PersonalInfo) {debugger;
        if (this.profilePictureUploaded) {

            this.staffService.uploadProfilePicture(this.formData).subscribe(res => {
                if (res.json().response) {
                    personalInfo.phtoId = res.json().response;
                    //Once the Profile Photo Uploaded. Create the Staff
                    this.updateStepOneInnerData(personalInfo);
                }
            }, (error: any) => {
                this.createStaffError('Error while iploading the profile picture');
            });
        } else {
            this.updateStepOneInnerData(personalInfo);
        }

        // }
    }

    updateStepOneInnerData(personalInfo) {
        personalInfo.dob=this.staffDate;
        this.staffService.updateStaff(personalInfo,this.appService.currentLang)
            .subscribe(res => {
                // this.snackBar.open('Updated Staff Member Successfully', 'Ok', {
                //   duration: 3000
                // });
                this.router.navigate(['/rsb-modules/organization/staff/managestaff/manage']);
            }, (err: any) => {
                this.createStaffError('error occured while updating the staff personal info');
            });
    }

    updateStepTwo(employementDetails) {
        employementDetails.doj=this.hireDate;
        this.staffService.updateEmployement(employementDetails)
            .subscribe(res => {
                // this.snackBar.open('Updated Staff Member Successfully', 'Ok', {
                //   duration: 3000
                // });
                this.router.navigate(['/rsb-modules/organization/staff/managestaff/manage']);
            }, (err: any) => {
                this.createStaffError('error occured while updating the staff employement details');
            });
    }

    updateStepThree(policyDetails) {
        this.policyDetails.id = this.staff.id;
        this.policyDetails.staffId = this.staff.id;
        console.log(this.policyDetails);
        this.staffService.updateStaffPolicy(this.policyDetails)
            .subscribe(res => {
                // this.snackBar.open('Updated Staff Member Successfully', 'Ok', {
                //   duration: 3000
                // });
                this.router.navigate(['/rsb-modules/organization/staff/managestaff/manage']);
            }, (err: any) => {
                this.createStaffError('error occured while updating the staff policy');
            });
    }

    updateStepFour(carOne, carTwo) {

        if (!this.carOnePresent) {
            carOne.expDate=this.car1Date;
            if (this.carOne.id && this.carOne.id > 0) {
                carOne.brand = '';
                carOne.regn = '';
                carOne.color = '';
                this.staffService.deleteVehicle(this.carOne.id).subscribe(res => {

                }, (err: any) => {
                });
            }
        }

        if (!this.carTwoPresent) {
            carTwo.expDate=this.car2Date;
            if (this.carTwo.id && this.carTwo.id > 0) {
                carTwo.brand = '';
                carTwo.regn = '';
                carTwo.color = '';
                this.staffService.deleteVehicle(this.carTwo.id).subscribe(res => {

                }, (err: any) => {
                });
            }
        }

        this.carOne.staffId = this.staff.id;
        this.carTwo.staffId = this.staff.id;
        if (carOne.brand != '' || carOne.regn != '' || carOne.color != '') {
            this.staffService.updateVehicle(carOne,this.appService.currentLang)
                .subscribe(res => {
                    if (carTwo.brand != '' || carTwo.regn != '' || carTwo.color != '') {
                        this.staffService.updateVehicle(carTwo,this.appService.currentLang)
                            .subscribe(res => {
                            }, (err: any) => {
                                this.createStaffError('error occured while updating the vehicle details of staff');
                            });
                    }
                    // this.snackBar.open('Updated Staff Member Successfully', 'Ok', {
                    //   duration: 3000
                    // });
                    this.router.navigate(['/rsb-modules/organization/staff/managestaff/manage']);
                }, (err: any) => {
                    this.createStaffError('error occured while updating the vehicle details of staff');
                });
        } else {
            // this.snackBar.open('Updated Staff Member Successfully', 'Ok', {
            //   duration: 3000
            // });
            this.router.navigate(['/rsb-modules/organization/staff/managestaff/manage']);
        }


    }

    getPolicyDetails() {
        this.staffService.getPolicyDetails(this.staff.id)
            .subscribe(res => {
                let data = JSON.parse(res._body);
                //this.getDepartmentDetails();
                let self = this;
                setTimeout(function () {
                    self.policyDetails.departmentId = data.departmentId;
                    self.updateSubDepartments(data.departmentId);
                    self.policyDetails.subDepartmentId = data.subDepartmentId;
                }, 1000);
                setTimeout(function () {
                    self.updateDegisnations(data.subDepartmentId);
                    self.policyDetails.designationId = data.designationId;
                }, 1000);
                setTimeout(function () {
                    self.updatePolicies(data.designationId);
                    self.policyDetails.gradeId = data.gradeId;
                }, 1000);
                setTimeout(function () {
                    self.showAllowancePolicy(data.gradeId);
                    // self.policyDetails.worktimePolicyGroupId = data.worktimePolicyGroupId;
                }, 1000);
                setTimeout(function () {
                    self.showWorkTimePolicy(data.worktimePolicyGroupId);
                    self.policyDetails.worktimePolicyGroupId = data.workTimePolicyGroupId;
                    // self.allowanceSelected =  true;
                    // self.workTimeSelected = true;
                }, 1000);
            }, (err: any) => {
                this.createStaffError('error occured while getting the policy details');
            });
    }

    //  validation for empid
    checkEmpIdValid(empid) {
        if (!empid.match((/^(?=.*?[A-Za-z])(?=.*\d)/))) {
            this.invalidEmpid = true;
        } else {
            this.invalidEmpid = false;
        }
    }
}
