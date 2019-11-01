import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DateAdapter, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {WorkService} from '../work.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'jalali-moment';
import {AppService} from '../../../../app.service';
import {workGroup} from '../../access-model';
import {CalendarConverterService} from '../../../../calendar-converter-service';
import {DatePipe} from '@angular/common';


@Component({
    selector: 'app-view-work-group',
    templateUrl: './prepare-work-group.component.html',
    styleUrls: ['./prepare-work-group.component.scss']
})
export class PrepareWorkGroupComponent implements OnInit, OnDestroy {

    public prepareWorkGroup: workGroup;
    selectedAccessGroupId = 0;
    selectedAccessGroupType='department';
    public alertObj: any = {};
    public currentDate: any;
    public pickedFromDate: any;
    public fromDate: any;
    public pickedToDate: any;
    public toDate: any;
    public mode='new';
    public accessGroups=[];
    @SessionStorage('prepareWorkGroupComponentOpenCount')
    public prepareWorkGroupComponentOpenCount;

    constructor(
        public dialogRef: MatDialogRef<PrepareWorkGroupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public appService: AppService,
        private storage: LocalStorageService,
        private workService: WorkService,
        public datePipe: DatePipe,
        public dateAdapter: DateAdapter<Date>,
        public translate: TranslateService,
        private sessionStorageService: SessionStorageService,
        private calendarConverter: CalendarConverterService,
        private router: Router) {

            let now = new Date();
            this.dateAdapter.setLocale('en-In');
            this.currentDate = this.datePipe.transform(now, 'dd/MM/yyyy');
            this.pickedFromDate = new Date(now);
            this.fromDate = this.currentDate;
            this.pickedToDate = new Date(now);
            this.toDate = this.currentDate;
            this.prepareWorkGroup = data.workG;
            this.mode=data.mode;

            if(this.prepareWorkGroup.accessElement!=null){
                this.selectedAccessGroupId=this.prepareWorkGroup.accessElement.id;
            }
        console.log("llllllllllllllllllllllll",this.toDate);

            if(this.prepareWorkGroup.startDate!=null&&this.prepareWorkGroup.endDate!=null ){
                this.fromDate=this.prepareWorkGroup.startDate;
                this.toDate=this.prepareWorkGroup.endDate;
            }
        console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrr",this.toDate);
            dialogRef.disableClose = true;
    }
    ngOnInit() {
        this.getAllAccessGroups();
        if (this.appService.currentLang == 'fa') {
            let jalaliFrom = this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.fromDate));
            this.pickedFromDate = moment(jalaliFrom, 'jYYYY,jMM,jDD');
            let jalaliTo = this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.toDate));
            this.pickedToDate = moment(jalaliTo, 'jYYYY,jMM,jDD');
        }
        if (this.appService.currentLang == 'en') {
            this.pickedFromDate = new Date(this.calendarConverter.convertDateFormat(this.fromDate));
            this.pickedToDate = new Date(this.calendarConverter.convertDateFormat(this.toDate));
        }
    }

    ngAfterViewInit() {
    }

    convertJalaliDateToUTC(tempDate: any, state: any) {
        if (state == 'from') {
            this.fromDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
        }
        if (state == 'to') {
            this.toDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
        }
    }

    convertGregorianDateToUTC(tempDate: any, state: any) {
        if (state == 'from') {
            this.fromDate = this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
        }
        if (state == 'to') {
            this.toDate = this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
        }
    }

    addUpdateWorkGroup() {
        for(let AG of this.accessGroups){
            if(AG.id==this.selectedAccessGroupId){
                AG.type='ZONE';
                delete AG.areas;
                this.prepareWorkGroup.accessElement=AG ;
            }
        }
        this.prepareWorkGroup.startDate=this.fromDate;
        this.prepareWorkGroup.endDate=this.toDate;
        if(this.mode=='new'){
            delete this.prepareWorkGroup.id;
            this
                .workService
                .addWorkGroup(this.prepareWorkGroup)
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
        if(this.mode=='edit'){
            this
                .workService
                .updateWorkGroup(this.prepareWorkGroup)
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
    getAllAccessGroups(){
        this.accessGroups = [];
        this.workService
            .getAllAccessGroups(this.appService.currentLang)
            .subscribe((res) => {
                this.accessGroups = JSON.parse(res._body).content;

            }, (err) => {

            });
    }

    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }

    goToParticularStep(step, message, staffObj) {
        //console.log(staffObj);
        this.sessionStorageService.store('editStaffStep', step);
        this.sessionStorageService.store('editStaffMessage', message);
        this.sessionStorageService.store('editStaffObj', staffObj);
        // setTimeout(() => {
        this.dialogRef.close();
        this.router.navigate(['/rsb-modules/organization/staff/managestaff/prepare']);
        // }, 2000);
    }

    ngOnDestroy() {
        this.storage.store('addClicked', false);
        this.prepareWorkGroupComponentOpenCount = 0;
    }
}
