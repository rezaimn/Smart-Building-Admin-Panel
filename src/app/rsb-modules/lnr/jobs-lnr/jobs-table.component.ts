///<reference path="../lnr-API-service.ts"/>
import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

import {DateAdapter, MatDialog} from '@angular/material';
import {LnrAPIService} from '../lnr-API-service';
import {PaginationService} from '../../../pagination-service';
import {AppService} from '../../../app.service';
import {ExcelService} from '../excel.service';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MdSnackBar, DateAdapter } from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {CalendarConverterService} from '../../../calendar-converter-service';
import * as moment from 'jalali-moment';
import {ConfirmModalComponent, LayoutComponent} from '../../../common';
/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
    selector: 'app-jobs-table',
    templateUrl: './jobs-table.component.html',
    styleUrls: ['./jobs-table.component.scss']
})
export class JobsTableComponent implements OnInit {
    public page: number = 1;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;
    public date: any;//= "02/03/2018";//current date
    public pickedDate: any;
    public currentDate: any;
    public allJobs: any = [];
    public subDepartmentId: any = -1;
    public rep: any = [];
    public models: any = [];
    public models1: any = [];
    disableCSV = true;
    @SessionStorage('subsidiary')
    public subsidiary;

    constructor(public apiService: LnrAPIService,
                private sanitizer: DomSanitizer,
                private paginationService: PaginationService,
                public dialog: MatDialog,
                public appService: AppService,
                public dateAdapter: DateAdapter<Date>,
                private datePipe: DatePipe,
                private router: Router,
                private excelExport: ExcelService,
                public translate: TranslateService,
                public layoutComponent: LayoutComponent,
                private localStorageService: LocalStorageService,
    ) {

    }

    ngOnInit() {
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.getJobs();
    }

    /**
     @Desc  getting device types for drop down
     @Param
     @return fill the device types drop down
     */
    getJobs() {
        this
            .apiService
            //.getStaffList("/LNR/GetStaffBySubsidiary?id="+this.subsidiary.id)
            .getJobList('/rsb-report/scheduler/jobs')

            .subscribe(res => {
                if (res.status === 200) {
                    this.allJobs = JSON.parse(res._body);
                }
            }, (error: any) => {
                // this.translate.get('error-messages.device-type-no-data',this.appService.currentLang).subscribe(
                //     (subHeaderT)=> {
                //         this.appService.showFail(subHeaderT);
                //     }
                // )
            });
    }
    toggleStatus(jobName,status){
        this
            .apiService
            .toggleJobStatus('/rsb-report/scheduler/'+status+'?jobName='+jobName)
            .subscribe(res => {
                this.getJobs();
            }, (error: any) => {
                // this.translate.get('error-messages.device-type-no-data',this.appService.currentLang).subscribe(
                //     (subHeaderT)=> {
                //         this.appService.showFail(subHeaderT);
                //     }
                // )
            });
    }
    /**
     @Desc  run filters for search
     @Param currentDate or selected date
     @return
     */
    deleteJob(jobName){

            let deleteUrl = '/rsb-report/scheduler/delete?jobName=' + jobName;

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
                    this.getJobs();
                    this.localStorageService.store('addClicked', false);
                });


    }

    /**
     @Desc  getting LNR alert list from database
     @Param
     @return
     */


    getAlertList() {
        this.apiService.get('/LNR/GetDeviceData?date=' + this.date + '&devicetypeid=' + this.subDepartmentId + '&page=' + this.page + '&records=' + this.perPage)
            .subscribe(res => {
                    if (res.status === 200) {
                        const allStaffs = JSON.parse(res._body);
                        this.models1 = allStaffs.records;
                        this.totalRecordsCount = allStaffs.totalrecords;
                        let x = this.totalRecordsCount % this.perPage;
                        let y = this.totalRecordsCount - x;
                        if(x == 0){
                            this.totalPages = y / this.perPage ;
                        } else {
                            this.totalPages = y / this.perPage + 1;
                        }

                        this.disableCSV = false;
                    }
                    if (this.models1.length == 0) {
                        this.disableCSV = true;
                        this.translate.get('error-messages.empty-result',this.appService.currentLang).subscribe(
                            (subHeaderT)=> {
                                this.appService.showFail(subHeaderT);
                            }
                        )
                    }
                }
                , (error: any) => {
                    this.translate.get('error-messages.alert-no-data',this.appService.currentLang).subscribe(
                        (subHeaderT)=> {
                            this.appService.showFail(subHeaderT);
                        }
                    )
                });


    }

    /**
     @Desc  set page NO for pagination
     @Param receiving next page last page previous page first page status and
     @return set page NO
     */
    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.getAlertList()
    }

    /**
     @Desc  converting tables data to CSV file to show on excel
     @Param
     @return saving data to excel file in downloads directory
     */
    exportCSV() {
        this.models = [];
        if (!this.subDepartmentId)
            this.subDepartmentId = -1;
        this
            .apiService
            //.getStaffList("/LNR/GetStaffBySubsidiary?id="+this.subsidiary.id)
            .get('/LNR/GetDeviceData?date=' + this.date + '&devicetypeid=' + this.subDepartmentId + '&page=' + this.totalPages)

            .subscribe(res => {
                if (res.status === 200) {
                    let allStaffs = JSON.parse(res._body);
                    //pagination config
                    console.log(allStaffs.records);
                    this.models = allStaffs.records;
                    let i = 1;
                    let tempData = [];
                    for (let data of this.models) {
                        let rowData = {
                            'NO': i,
                            'ID': data.id,
                            'NAME': data.name,
                            'DATE': data.recorddate
                        }
                        tempData.push(rowData);
                        i = i + 1;
                    }

                    this.excelExport.exportToCSV('Alert_Report', ['NO', 'ID', 'NAME', 'DATE'], tempData);
                }
            }, (error: any) => {
                this.translate.get('error-messages.alert-no-data',this.appService.currentLang).subscribe(
                    (subHeaderT)=> {
                        this.appService.showFail(subHeaderT);
                    }
                )
            });

    }

    /**
     @Desc set header logo
     @Param
     @return
     */
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject

        if (this.subsidiary !== null) {
            let subHeader='';
            let pageDetails='';
            let subsidiaryName:'';
            if (this.appService.currentLang == 'en') {
                subsidiaryName = this.subsidiary.name.map.en;
            }
            if (this.appService.currentLang == 'fa') {
                subsidiaryName = this.subsidiary.name.map.fa;
            }
            this.translate.get('sub-header.alerts',this.appService.currentLang).subscribe(
                (subHeaderT)=>{
                    subHeader=subHeaderT;
                    this.translate.get('page-details.logging-reporting.alerts',this.appService.currentLang).subscribe(
                        (pageDetailsT)=>{
                            pageDetails=pageDetailsT;

                                    this
                                        .appService
                                        .sendHeaderWithLogo(subsidiaryName, subHeader,pageDetails, '', '../../../../../assets/images/dashboard/LOGGING-AND-REPORTING.png');

                        }
                    )
                }
            )

        }
    }

    /**
     @Desc set sub header links
     @Param
     @return
     */
    updateBreadCrums() {
        this.appService.updateBreadCrums('LNR-VIEW');
    }

}
