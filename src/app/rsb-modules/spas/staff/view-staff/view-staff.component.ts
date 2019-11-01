import {AppService} from './../../../../app.service';
import {Component, Inject, OnInit} from '@angular/core';
import {DateAdapter, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {StaffService} from '../staff.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'jalali-moment';
import {CalendarConverterService} from '../../../../calendar-converter-service';
import {DatePipe} from '@angular/common';
import {accessLevel, cardHolder, workGroup} from '../../access-model';
import {Department, Designation, SubDepartment} from '../../../organizations/staff/staff';

@Component({
    selector: 'app-view-staff',
    templateUrl: './view-staff.component.html',
    styleUrls: ['./view-staff.component.scss']
})
export class ViewStaffComponent implements OnInit {

    public cardHolder:cardHolder;
    public now = moment();
    public currentDate: any;
    public selectedTSId:any;
    public mode='new';
    public pickedCFromDate: any;
    public CFromDate: any;
    public pickedCToDate: any;
    public CToDate: any;

    public pickedFromDate: any;
    public fromDate: any;
    public pickedToDate: any;
    public toDate: any;

    public cardNumber: string;

    public timeSchedules = [];
    public accessLevels = [];
    public workGroups=[];
    public accessLevelId=0;
    public workGroupId=0;
    public timeScheduleId=0;
    // public departmentId:number = 0;
    // public subDepartmentId:number = 0;
    // public departments: Department[] = [];
    // public subdepartments: SubDepartment[] = [];
    //
    // public department: Department = new Department();
    //
    // public subDepartment: Department = new Department() ;
    //

    constructor(
        public dialogRef: MatDialogRef<ViewStaffComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private storage: LocalStorageService,
        private staffService: StaffService,
        public appService: AppService,
        public datePipe: DatePipe,
        public dateAdapter: DateAdapter<Date>,
        private sessionStorageService: SessionStorageService,
        public translate: TranslateService,
        private router: Router,
        private calendarConverter: CalendarConverterService,
    ) {

        let now = new Date();
        this.dateAdapter.setLocale('en-In');
        this.currentDate = this.datePipe.transform(now, 'dd/MM/yyyy');
        this.pickedCFromDate = new Date(now);
        this.CFromDate = this.currentDate;
        this.pickedCToDate = new Date(now);
        this.CToDate = this.currentDate;

        this.pickedFromDate = new Date(now);
        this.fromDate = this.currentDate;
        this.pickedToDate = new Date(now);
        this.toDate = this.currentDate;

        this.cardHolder = data.cardholder;
        this.mode=data.mode;
        this.workGroupId=this.cardHolder.workgroup.id;
        this.accessLevelId=this.cardHolder.accessElement.id;
        this.timeScheduleId=this.cardHolder.timeSchedule.id;
        // console.log("ffffffffffffffffffffffffffff",this.cardHolder);
        // this.departmentId= this.cardHolder.department.id;
        // this.subDepartmentId= this.cardHolder.subDepartment.id;

        if(this.cardHolder.startDate!=''&&this.cardHolder.startDate!=null ){
            this.fromDate=this.cardHolder.startDate;
        }
        if(this.cardHolder.endDate!=''&&this.cardHolder.endDate!=null ){
            this.toDate=this.cardHolder.endDate;
        }
        if(this.cardHolder.contractStartDate!=''&&this.cardHolder.contractStartDate!=null ){
            this.CFromDate=this.cardHolder.contractStartDate;
        }
        if(this.cardHolder.contractEndDate!=''&&this.cardHolder.contractEndDate!=null ){
            this.CToDate=this.cardHolder.contractEndDate;
        }
        dialogRef.disableClose = true;
    }

    ngOnInit() {
        //this.getDepartmentDetails();
        this.getAllTimeSchedules();
        this.getAllAccessLevels();
        this.getAllWorkGroups();
        if (this.appService.currentLang == 'fa') {
            let jalaliCFrom = this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.CFromDate));
            this.pickedCFromDate = moment(jalaliCFrom, 'jYYYY,jMM,jDD');
            let jalaliCTo = this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.CToDate));
            this.pickedCToDate = moment(jalaliCTo, 'jYYYY,jMM,jDD');

            let jalaliFrom = this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.fromDate));
            this.pickedFromDate = moment(jalaliFrom, 'jYYYY,jMM,jDD');
            let jalaliTo = this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.toDate));
            this.pickedToDate = moment(jalaliTo, 'jYYYY,jMM,jDD');
        }
        if (this.appService.currentLang == 'en') {

            this.pickedCFromDate = new Date(this.calendarConverter.convertDateFormat(this.CFromDate));
            this.pickedCToDate = new Date(this.calendarConverter.convertDateFormat(this.CToDate));

            this.pickedFromDate = new Date(this.calendarConverter.convertDateFormat(this.fromDate));
            this.pickedToDate = new Date(this.calendarConverter.convertDateFormat(this.toDate));
        }
    }

    convertJalaliDateToUTC(tempDate: any, state: any) {
        if (state == 'CFrom') {
            this.CFromDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
        }
        if (state == 'CTo') {
            this.CToDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
        }

        if (state == 'from') {
            this.fromDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
        }
        if (state == 'to') {
            this.toDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
        }
    }

    convertGregorianDateToUTC(tempDate: any, state: any) {
        if (state == 'CFrom') {
            this.CFromDate = this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
        }
        if (state == 'CTo') {
            this.CToDate = this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
        }

        if (state == 'from') {
            this.fromDate = this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
        }
        if (state == 'to') {
            this.toDate = this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
        }
    }
    // getDepartmentDetails() {
    //     this.departments = [];
    //     this
    //         .staffService
    //         .getDepartmentDetails(this.appService.currentLang)
    //         .subscribe(res => {
    //             if (res.status === 200) {
    //                 let departmentDetails = JSON.parse(res._body);
    //                 departmentDetails.forEach(department => {
    //
    //                     let sds: SubDepartment[] = [];
    //                     if (department.subDepartments !== undefined && department.subDepartments.length > 0) {
    //                         department.subDepartments.forEach(subdepartment => {
    //                             let dss: Designation[] = [];
    //                             if (subdepartment.designations !== undefined && subdepartment.designations.length > 0) {
    //                                 subdepartment.designations.forEach(designation => {
    //                                     let dObject = new Designation(designation);
    //                                     dss.push(dObject);
    //                                 });
    //                             }
    //                             let sdObject = new SubDepartment(subdepartment, dss);
    //                             sds.push(sdObject);
    //                         });
    //                     }
    //
    //                     let ds: Designation[] = [];
    //                     if (department.designations !== undefined && department.designations.length > 0) {
    //                         department.designations.forEach(designation => {
    //                             let dObject = new Designation(designation);
    //                             ds.push(dObject);
    //                         });
    //                     }
    //
    //                     let dptObject = new Department(department, sds, ds);
    //                     this.departments.push(dptObject);
    //                 });
    //                 //console.log("tttttttttttttttttttttttttt",this.departments);
    //             }
    //
    //         }, (error: any) => {
    //
    //         });
    //
    // }
    //
    //
    // updateSubDepartments(event) {
    //     this.subdepartments = [];
    //
    //     // console.log(event);
    //     this.departments.forEach(department => {
    //         //   console.log(department)
    //         if( department.id === event ){
    //             department.subdepartments.forEach(dep =>{
    //                 this.subdepartments.push(dep);
    //             });
    //         }
    //
    //         // this.subdepartments.push(department.subdepartments);
    //         // console.log(this.subdepartments);
    //     });
    //     if(this.subdepartments.length==0){
    //         this.subDepartmentId=-1;
    //     }
    //     //  console.log(this.subdepartments);
    // }

    getAllAccessLevels() {
        this.accessLevels = [];

        this.staffService
            .getAllAccessLevels(this.appService.currentLang)
            .subscribe((res) => {

                this.accessLevels = JSON.parse(res._body).content;

            }, (err) => {

            });

    }
    getAllWorkGroups(){
        this.workGroups = [];

        this.staffService
            .getAllWorkGroups('department',this.appService.currentLang)
            .subscribe((res) => {

                this.workGroups = JSON.parse(res._body).content;

            }, (err) => {

            });
    }
    getAllTimeSchedules() {
        this.staffService
            .getAllTimeSchedules()
            .subscribe((res) => {
                this.timeSchedules.splice(0, this.timeSchedules.length);
                this.timeSchedules = JSON.parse(res._body);

            }, (err) => {
            });
    }

    sendHeader(): void {
        // Send message to subscribers via observable subject

        this
            .appService
            .sendHeader('header', 'spas management', 'hello', '');

    }

    ngAfterViewInit() {
    }

    addUpdateCardHolder() {
        this.setWorkGroupForCardHolder();
        this.setAccessElementForCardHolder();
        this.setTimeScheduleForCardHolder();
        this.cardHolder.startDate=this.fromDate;
        this.cardHolder.endDate=this.toDate;
        this.cardHolder.contractStartDate=this.CFromDate;
        this.cardHolder.contractEndDate=this.CToDate;
        this.cardHolder.enabled=true;
        delete this.cardHolder.accessElement.doors;
        if(this.accessLevelId==0){
            this.cardHolder.accessElement=null;
        }
        if(this.timeScheduleId==0){
            this.cardHolder.timeSchedule=null;
        }
        console.log("ttttttttttt",this.timeScheduleId);
        console.log("aaaaaaaaaaaaaa",this.accessLevelId);
        if(this.mode=='new'){
            delete this.cardHolder.id;
            this
                .staffService
                .addCardHolder(this.cardHolder)
                .subscribe((data) => {
                    let jsonData = JSON.parse(data._body);

                    if (jsonData.length) {
                        jsonData = JSON.parse(jsonData);
                    } else {
                    }
                    this.closeModal();
                }, (error) => {
                    this.cardHolder.workgroup=new workGroup({});
                    this.cardHolder.accessElement=new accessLevel({});
                    this.cardHolder.cardNumber='';
                });

        }
        if(this.mode=='edit'){
            this
                .staffService
                .updateCardHolder(this.cardHolder)
                .subscribe((data) => {

                    let jsonData = JSON.parse(data._body);

                    if (jsonData.length) {

                        jsonData = JSON.parse(jsonData);

                    } else {

                    }
                    this.closeModal();
                }, (error) => {

                });

        }

    }
    setWorkGroupForCardHolder() {
        for (let WG of this.workGroups) {
            if (WG.id==this.workGroupId) {
                this.cardHolder.workgroup=WG;
            }
        }
    }
    setAccessElementForCardHolder(){
        if(this.accessLevelId!=0){
            for (let AL of this.accessLevels) {
                if (AL.id==this.accessLevelId) {
                    this.cardHolder.accessElement=AL;
                }
            }
        }
    }
    setTimeScheduleForCardHolder(){
        if(this.timeScheduleId!=0){
            for (let TS of this.timeSchedules) {
                if (TS.id==this.timeScheduleId) {
                    this.cardHolder.timeSchedule=TS;
                }
            }
        }
    }
    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }

    goToParticularStep(step, message, staffObj) {
        console.log(staffObj);
        this.sessionStorageService.store('editStaffStep', step);
        this.sessionStorageService.store('editStaffMessage', message);
        this.sessionStorageService.store('editStaffObj', staffObj);
        // setTimeout(() => {
        this.dialogRef.close();
        this.router.navigate(['/rsb-modules/organization/staff/managestaff/prepare']);
        // }, 2000);
    }
}
