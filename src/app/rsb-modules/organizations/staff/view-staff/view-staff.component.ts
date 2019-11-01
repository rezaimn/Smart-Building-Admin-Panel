import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {StaffService} from '../staff.service';
import {multiLingMap, PolicyViewObject, StaffVehicle} from '../staff';
import {Router} from '@angular/router';

import * as moment from 'jalali-moment';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {CalendarConverterService} from '../../../../calendar-converter-service';

@Component({
    selector: 'app-view-staff',
    templateUrl: './view-staff.component.html',
    styleUrls: ['./view-staff.component.scss']
})
export class ViewStaffComponent implements OnInit {

    public staff: any = {};

    public vehicles: StaffVehicle[] = [];
    public birthD = '';
    public joinD='';
    public now = moment();
    public mapT: {
        'id': 0,
        'map': multiLingMap
    }
    public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));

    constructor(public translate: TranslateService,
                public dialogRef: MatDialogRef<ViewStaffComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private storage: LocalStorageService,
                private staffService: StaffService,
                private sessionStorageService: SessionStorageService,
                public appService: AppService,
                private calendarConverter: CalendarConverterService,
                public datePipe: DatePipe,
                private router: Router) {
        this.staff = data.staff;
        this.birthD=this.staff.dob;
        this.joinD=this.staff.employmentDetails.doj;
        if (this.appService.currentCalendar == 'jalali') {
            let staffDate=this.datePipe.transform(this.staff.dob, 'dd/MM/yyyy');
            let jalaliStaff=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(staffDate));
            this.staff.dob=jalaliStaff;

            let staffJoinDate=this.datePipe.transform(this.staff.employmentDetails.doj, 'dd/MM/yyyy');
            let jalaliStaffJoin=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(staffJoinDate));
            this.staff.employmentDetails.doj=jalaliStaffJoin;

        }
        dialogRef.disableClose = true;
    }

    ngOnInit() {
        console.log(this.staff);
        if (this.staff.id !== undefined) {
            this.getVehicleDetails(this.staff.id);
            this.getPolicyDetails(this.staff.id);
        }
    }

    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
    }

    ngAfterViewInit() {
    }

    getPolicyDetails(staffId) {
        this.staffService
            .getPolicyDetails(staffId)
            .subscribe((res) => {
                this.policyObject = new PolicyViewObject(JSON.parse(res._body), this.now.format('YYYY-MM-DD') + 'T');
                console.log('uuuuuuuuuuuuuuuuuu', this.policyObject);
            }, (err) => {

            });
    }

    getVehicleDetails(staffId) {
        this.staffService
            .getVehicleDetails(staffId, this.appService.currentLang)
            .subscribe((res) => {
                let responseVehicles = JSON.parse(res._body);
                // vehicles
                responseVehicles.forEach(vehicle => {
                    if (vehicle.colorMultiLingual == null) {
                        vehicle.colorMultiLingual = this.mapT;
                    }
                    if (vehicle.brandMultiLingual == null) {
                        vehicle.brandMultiLingual = this.mapT;
                    }
                    this.vehicles.push(new StaffVehicle(vehicle));
                });
            }, (err) => {

            });
    }

    goToParticularStep(step, message, staffObj) {
        if(step==1){
            staffObj.dob=this.birthD;
        }
        if(step==2){
            staffObj.doj=this.joinD;
        }
        this.sessionStorageService.store('editStaffStep', step);
        this.sessionStorageService.store('editStaffMessage', message);
        this.sessionStorageService.store('editStaffObj', staffObj);
        // setTimeout(() => {
        this.dialogRef.close();
        this.router.navigate(['/rsb-modules/organization/staff/managestaff/prepare']);
        // }, 2000);
    }
}
