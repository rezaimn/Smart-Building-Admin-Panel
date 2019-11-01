import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

import {DateAdapter, MatDialog} from '@angular/material';
import {LnrAPIService} from '../lnr-API-service';
import {PaginationService} from '../../../pagination-service';
import {AppService} from '../../../app.service';
import {ExcelService} from '../excel.service';
import {SessionStorage} from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MdSnackBar,DateAdapter } from '@angular/material';
import {CalendarConverterService} from '../../../calendar-converter-service';
import * as moment from 'jalali-moment';

/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
    selector: 'app-system-log-table',
    templateUrl: './system-log-table.component.html',
    styleUrls: ['./system-log-table.component.scss'],
    providers: [DatePipe]
})
export class SystemLogTableComponent implements OnInit {
    disableCSV = true;
    public page: number = 1;
    public perPage: number = 3;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;
    public searchType = 0;
    public date: any;//= "02/03/2018";//current date
    public currentDate: any;
    public pickedFromDate: any;
    public fromDate: any;
    public pickedToDate: any;
    public toDate: any;
    public fromMill: any;
    public toMill: any;
    public fromTime: any;
    public toTime: any;

    public rep: any = [];
    public searchValue = '';
    public models: any = [];
    public models1: any = [];
    expand = false;
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
        let now = new Date();
        this.fromMill = now.getTime();
        this.toMill = now.getTime();
        this.fromTime = now.toLocaleTimeString('it-IT');
        this.toTime = now.toLocaleTimeString('it-IT');
        this.dateAdapter.setLocale('en-In');
        this.currentDate = this.datePipe.transform(now, 'dd/MM/yyyy');
        this.pickedFromDate = new Date(now);
        this.fromDate = this.currentDate;
        this.pickedToDate = new Date(now);
        this.toDate = this.currentDate;
    }
    ngOnInit() {
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        if(this.appService.currentLang=='fa'){
            let jalaliFrom=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.fromDate));
            this.pickedFromDate=moment(jalaliFrom,'jYYYY,jMM,jDD');
            let jalaliTo=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.toDate));
            this.pickedToDate=moment(jalaliTo,'jYYYY,jMM,jDD');
        }
        if(this.appService.currentLang=='en'){
            this.pickedFromDate=new Date(this.calendarConverter.convertDateFormat(this.fromDate));
            this.pickedToDate=new Date(this.calendarConverter.convertDateFormat(this.toDate));
        }
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                if(res=='fa'){
                    let jalaliFrom=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.fromDate));
                    this.pickedFromDate=moment(jalaliFrom,'jYYYY,jMM,jDD');
                    let jalaliTo=this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.toDate));
                    this.pickedToDate=moment(jalaliTo,'jYYYY,jMM,jDD');
                }
                if(res=='en'){
                    this.pickedFromDate=new Date(this.calendarConverter.convertDateFormat(this.fromDate));
                    this.pickedToDate=new Date(this.calendarConverter.convertDateFormat(this.toDate));

                }
                this.sendHeaderWithLogo();
            }
        )
    }

    convertJalaliDateToUTC(tempDate: any,state:any) {

        if(state=='from'){
            let fromT = tempDate._d.toString();
            let from = fromT.replace('00:00:00', this.fromTime);
             this.fromMill = new Date(from).getTime();
             this.fromDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');

        }
        if(state=='to'){
            let toT = tempDate._d.toString();
            let to = toT.replace('00:00:00', this.toTime);
            this.toMill = new Date(to).getTime();
            this.toDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');

        }

    }
    convertGregorianDateToUTC(tempDate: any,state:any) {
        if(state=='from'){
            let fromT = tempDate._selected.toString();
            let from = fromT.replace('00:00:00', this.fromTime);
            this.fromMill = new Date(from).getTime();
            this.fromDate = this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');

        }
        if(state=='to'){
            let toT = tempDate._selected.toString();
            let to = toT.replace('00:00:00', this.toTime);
            this.toMill = new Date(to).getTime();
            this.toDate = this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');

        }
    }
    excute() {
        this.page = 1;
        this.getSystemLogList();
    }

    getSystemLogList() {
        let body = {
            'from': this.page,
            'size': this.perPage,
            'query': {
                'range': {
                    '@timestamp': {
                        'gte': this.fromMill,
                        'lte': this.toMill,
                        'format': 'epoch_millis'
                    }
                }
            }

        }

        this.apiService.postSystemLog(body)
            .subscribe(res => {
                    if (res.status === 200) {
                        const items = JSON.parse(res._body);
                        this.models1 = items.hits.hits;
                        this.totalRecordsCount = items.hits.total;
                        var x = this.totalRecordsCount % this.perPage;
                        var y = this.totalRecordsCount - x;
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
                    this.translate.get('error-messages.system-log-no-data',this.appService.currentLang).subscribe(
                        (subHeaderT)=> {
                            this.appService.showFail(subHeaderT);
                        }
                    )
                });
    }


    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.getSystemLogList();
    }

    exportCSV() {
        let body = {
            'from': 1,
            'size': this.totalRecordsCount,
            'query': {
                'range': {
                    '@timestamp': {
                        'gte': this.fromMill,
                        'lte': this.toMill,
                        'format': 'epoch_millis'
                    }
                }
            }

        }
        this.models = [];
        this.apiService.postSystemLog(body)
            .subscribe(res => {
                    if (res.status === 200) {
                        const items = JSON.parse(res._body);
                        this.models = items.hits.hits;
                        let i=1;
                        let tempData=[];
                        for(let data of this.models){
                            let rowData={
                                "NO":i,
                                "TIME STAMP":data._source.timeStamp,
                                "MESSAGE":data._source.message,
                                "LEVEL":data._source.level

                            }
                            tempData.push(rowData);
                            i=i+1;
                        }
                        this.excelExport.exportToCSV('system_log_report', ['NO', 'TIME STAMP', 'MESSAGE', 'LEVEL'],tempData);

                    }
                }
                , (error: any) => {
                    this.translate.get('error-messages.system-log-no-data',this.appService.currentLang).subscribe(
                        (subHeaderT)=> {
                            this.appService.showFail(subHeaderT);
                        }
                    )
                });

    }

    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject


        let subHeader='';
        let pageDetails='';
        let subsidiaryName:'';
        if (this.appService.currentLang == 'en') {
            subsidiaryName = this.subsidiary.name.map.en;
        }
        if (this.appService.currentLang == 'fa') {
            subsidiaryName = this.subsidiary.name.map.fa;
        }
        this.translate.get('sub-header.system-log',this.appService.currentLang).subscribe(
            (subHeaderT)=>{
                subHeader=subHeaderT;
                this.translate.get('page-details.logging-reporting.system-log',this.appService.currentLang).subscribe(
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

    updateBreadCrums() {
        this.appService.updateBreadCrums('LNR-VIEW');
    }

    getColor(status: any) {
        switch (status) {
            case 'FATAL': {
                return '#F90BC0';
            }
            case 'ERROR': {
                return '#cf0d01';
            }
            case 'WARN': {
                return '#f98109';
            }
            case 'INFO': {
                return '#1ab4d4';
            }
            case 'DEBUG': {
                return '#1eb80b';
            }
            case 'TRACE': {
                return '#f4f959';
            }
            default: {
                return '#1ab4d4';
            }
        }
    }

    minimizeMessage(message) {
        if (message.length > 100 && !this.expand) {
            return message.substr(0, 100) + '...';
        }
        if (message.length > 100 && this.expand) {
            return message;
        }
        if (message.length <= 100) {
            return message;
        }
    }

    changeExpand(status) {

        this.expand = status;
    }
}
