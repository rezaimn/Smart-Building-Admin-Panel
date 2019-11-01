import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

import {DateAdapter, MatDialog} from '@angular/material';
import {SessionStorage} from 'ngx-webstorage';
import {LnrAPIService} from '../lnr-API-service';
import {PaginationService} from '../../../pagination-service';
import {AppService} from '../../../app.service';
import {ExcelService} from '../excel.service';
import {TranslateService} from '@ngx-translate/core';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MdSnackBar, DateAdapter } from '@angular/material';
import {isUndefined} from 'util';
import {CalendarConverterService} from '../../../calendar-converter-service';
import * as moment from 'jalali-moment';

/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
    selector: 'app-leaves-table',
    templateUrl: './leaves-table.component.html',
    styleUrls: ['./leaves-table.component.scss'],
    providers: [DatePipe]

})
export class LeavesTableComponent implements OnInit {
    public searchType = 0;
    public page: number = 1;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;
    public searchValue = '';
    public date: any;//= "02/03/2018";//current date
    public pickedDate: any;
    public currentDate: any;
    public rep: any = [];
    disableCSV = true;
    public models: any = [];
    public models1: any = [];
    test;
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
                private calendarConverter: CalendarConverterService,
    ) {
        this.dateAdapter.setLocale('en-In');
        var now = Date.now();
        this.currentDate = this.datePipe.transform(now, 'dd/MM/yyyy');
        this.pickedDate = new Date(now);
        this.date = this.currentDate;
    }

    ngOnInit() {
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        if(this.appService.currentLang=='fa'){
            let jalali=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.date));
            this.pickedDate=moment(jalali,'jYYYY,jMM,jDD');
        }
        if(this.appService.currentLang=='en'){
            this.pickedDate=new Date(this.calendarConverter.convertDateFormat(this.date));
        }
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                if(res=='fa'){
                    let jalali=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.date));
                    this.pickedDate=moment(jalali,'jYYYY,jMM,jDD');
                    console.log("rrrrrrrrrrrrrrrrr", this.pickedDate);
                }
                if(res=='en'){
                    this.pickedDate=new Date(this.calendarConverter.convertDateFormat(this.date));
                }
                this.sendHeaderWithLogo();
            }
        )
    }
    //this method will convert start date to UTC date if it's not
    convertJalaliDateToUTC(tempDate: any) {
        if (!isUndefined(tempDate)) {
            this.date = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
        }
    }
    convertGregorianDateToUTC(tempDate: any) {
        this.date= this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
    }

    excute() {

        this.page = 1;

        this.getLeaveList();
    }

    getLeaveList() {
        let searchTypeString = '';
        if (this.searchType == 1) {
            searchTypeString = 'firstname';
        } else if (this.searchType == 2) {
            searchTypeString = 'lastname';
        }

        this.apiService.get('/LNR/GetLeavesBySubsidiary?id=' + this.subsidiary.id + '&searchfield=' + searchTypeString + '&searchvalue=' + this.searchValue + '&date=' + this.date + '&page=' + this.page + '&records=' + this.perPage)
            .subscribe(res => {
                if (res.status === 200) {
                    let items = JSON.parse(res._body);
                    this.models1 = items.records;
                    this.totalRecordsCount = items.totalrecords;
                    var x = this.totalRecordsCount % this.perPage;
                    var y = this.totalRecordsCount - x;
                    if (x == 0) {
                        this.totalPages = y / this.perPage;
                    } else {
                        this.totalPages = y / this.perPage + 1;
                    }
                    this.disableCSV = false;
                }
                if (this.models1.length == 0) {
                    this.disableCSV = true;
                    this.translate.get('error-messages.empty-result', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    )
                }
            }, (error: any) => {
                this.translate.get('error-messages.leave-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                )
            });
    }


    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.getLeaveList();
    }

    exportCSV() {
        let searchTypeString = '';
        if (this.searchType == 1) {
            searchTypeString = 'firstname';
        } else if (this.searchType == 2) {
            searchTypeString = 'lastname';
        }

        this.models = [];
        this
            .apiService
            //.getLeaveList("/LNR/GetLeavesBySubsidiary?id="+this.subsidiary.id+"&date=07/03/2017")
            .get('/LNR/GetLeavesBySubsidiary?id=' + this.subsidiary.id + '&searchfield=' + searchTypeString + '&searchvalue=' + this.searchValue + '&date=' + this.date + '&page=' + this.totalPages)
            .subscribe(res => {
                if (res.status === 200) {
                    let items = JSON.parse(res._body);
                    this.models = items.records;
                    let i = 1;
                    let tempData = [];
                    for (let data of this.models) {
                        let rowData = {
                            'NO': i,
                            'FIRST NAME': data.firstname,
                            'LAST NAME': data.lastname,
                            'LEAVE FROM': data.fromdate,
                            'LEAVE TO': data.todate


                        }
                        tempData.push(rowData);
                        i = i + 1;
                    }
                    this.excelExport.exportToCSV('Leaves_Report', ['NO', 'FIRST NAME', 'LAST NAME', 'LEAVE FROM', 'LEAVE TO'], tempData);

                }
            }, (error: any) => {
                this.translate.get('error-messages.leave-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                )
            });
    }

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
        this.translate.get('sub-header.leaves', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.logging-reporting.leaves', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;
                        this
                            .appService
                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, '', '../../../../../assets/images/dashboard/LOGGING-AND-REPORTING.png');
                    }
                )
            }
        )

    }

    updateBreadCrums() {
        this.appService.updateBreadCrums('LNR-VIEW');
    }

}
