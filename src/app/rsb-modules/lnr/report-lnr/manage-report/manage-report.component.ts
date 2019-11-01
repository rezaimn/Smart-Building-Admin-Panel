import {DatePipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';
import {PaginationService} from '../../../../pagination-service';
import {DomSanitizer} from '@angular/platform-browser';
import {ExcelService} from '../../excel.service';
import {Router} from '@angular/router';
import {DateAdapter, MatDialog} from '@angular/material';
import {AppService} from '../../../../app.service';
import {LnrAPIService} from '../../lnr-API-service';
import {EditReportComponent} from '../edit-report/edit-report.component';
import {LayoutComponent} from '../../../../common';
import {HttpService} from '../../../../utils/services/http.service';
import * as FileSaver from 'file-saver';
import {RequestOptions, RequestOptionsArgs, ResponseContentType} from '@angular/http';
import {EditReportComponentES} from 'app/rsb-modules/lnr/report-lnr/edit-report-es/edit-report-es.component';
import {CronJobsComponent} from 'app/rsb-modules/lnr/report-lnr/show-cron/cron.component';

declare var saveAs: any;

@Component({
    selector: 'app-manage-report',
    templateUrl: './manage-report.component.html',
    styleUrls: ['./manage-report.component.scss'],
    providers: [DatePipe]

})
export class ManageReportComponent implements OnInit {

    @SessionStorage('organization')
    public organization;

    @SessionStorage('subsidiary')
    public subsidiary;

    @SessionStorage('user')
    public loggedInUser;


    public addClicked = false;
    public allList: any = [];
    public reportData: any = {};
    public format: any = [];
    public page: any = [];
    public cronExpression: any = [];

    public reportId: any;
    public inputParam: any = {};
    public inputParams: any = [];
    public auditLogConfiged = false;
    public systemLogConfiged = false;

    constructor(
        public apiService: LnrAPIService,
        private sanitizer: DomSanitizer,
        private paginationService: PaginationService,
        public dialog: MatDialog,
        private localStorageService: LocalStorageService,
        public sessionStorageService: SessionStorageService,
        private activatedRoute: Router,
        public layoutComponent: LayoutComponent,
        public appService: AppService,
        public dateAdapter: DateAdapter<Date>,
        private datePipe: DatePipe,
        private router: Router,
        private excelExport: ExcelService,
        public translate: TranslateService,
        private http: HttpService
    ) {
    }

    ngOnInit() {
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
                this.getAllReports();
            }
        )
        this.getAllReports();

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
        let routeName = '';
        this.translate.get('sub-header.report-management', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.manage-report', this.appService.currentLang).subscribe(
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

    showCronWindow(report: any, index) {
        this
            .layoutComponent
            .addClass();
        const dialogRef = this
            .dialog
            .open(CronJobsComponent, {
                width: '1024px',
                height: 'auto',
                data: null,
                hasBackdrop: false
            });
        dialogRef
            .afterClosed()
            .subscribe(result => {
                this.cronExpression[index].cronText = result;
                this
                    .layoutComponent
                    .removeClass();
            });

    }

    editReport(report: any, index) {
        // alert (index);
        //console.log(this.inputParams);
        //console.log(report);
        if (report.type === 'ES') {

            this.getAllReports();
            this.sessionStorageService.store('addAlert', 0);
            let editReportData = {
                'report': report,
                'type': 'edit'
            };


            this
                .layoutComponent
                .addClass();
            const dialogRef = this
                .dialog
                .open(EditReportComponentES, {
                    width: '1024px',
                    height: 'auto',
                    data: editReportData,
                    hasBackdrop: false
                });
            dialogRef
                .afterClosed()
                .subscribe(result => {
                    console.log(result);
                    if (result != null) {
                        if (report.name == 'System Log') {
                            this.systemLogConfiged = true;
                        }
                        this.inputParam = result.inputParams;
                        console.log("//////////////////////",this.inputParam);
                        this.inputParams.splice(index, 1, result.inputParams);
                    }
                    this
                        .layoutComponent
                        .removeClass();
                });


        }
        else if (report.type === 'DB') {

            this.getAllReports();
            this.sessionStorageService.store('addAlert', 0);
            let editReportData = {
                'report': report,
                'type': 'edit'
            };


            this
                .layoutComponent
                .addClass();
            const dialogRef = this
                .dialog
                .open(EditReportComponent, {
                    width: '1024px',
                    height: 'auto',
                    data: editReportData,
                    hasBackdrop: false
                });
            dialogRef
                .afterClosed()
                .subscribe(result => {
                    if (result != null) {
                        this.inputParam = result.inputParams;
                        console.log("????????????????????????////", this.inputParam);
                        this.inputParams.splice(index, 0, result.inputParams);
                    }
                    this
                        .layoutComponent
                        .removeClass();
                    // this.getAllReports();
                });
        }


    } //


    updateBreadCrums() {
        this.appService.updateBreadCrums('LNR-VIEW');
    }

    getAllReports() {
        this.allList = [];
        this.http.get('/rsb-report/reports/getAllReports?Accept-Language=' + this.appService.currentLang).subscribe(res => {
            const allData = JSON.parse(res._body);
            allData.forEach(data => {
                let formats = {
                    'selectedFromat': 'html'
                }
                let pagenum = {
                    'pageInput': 0
                }
                let crontext = {
                    'cronText': ''
                }
                this.format.push(formats);
                this.page.push(pagenum);
                this.cronExpression.push(crontext);
                this.allList.push(JSON.parse(data));
            });
        });


    }

    getReportOffline(formatTemp, reportid, reportType, pageNum, reportname, crontext) {

        console.log(this.loggedInUser);
        //  this.loggedInUser.email ="satya_89@yahoo.com";
        let currentDate = this.datePipe.transform(Date.now(), 'yyyy-MM-ddThh:mm:ss');
        this.reportData = {
            'id': reportid,
            'inputParams': this.inputParam,
            'language': this.appService.currentLang,
            'page': pageNum,
            'size': 1000,
            'scheduleEmailRequest': {
                'email': this.loggedInUser.email,
                'subject': 'RSB Report :' + reportname,
                'body': 'Please find attached report',
                'cronText': crontext,
                'dateTime': currentDate,
                'timeZone': 'Asia/Kolkata'
            }
        };
        if (reportType === 'ES') {
            this.reportData = {
                'id': reportid,
                'condition': this.inputParam.condition,
                'rules': this.inputParam.rules,
                'page': pageNum,
                'size': 1000,
                'language': this.appService.currentLang,
                'scheduleEmailRequest': {
                    'email': this.loggedInUser.email,
                    'subject': 'RSB Report :' + reportname,
                    'body': 'Please find attached report',
                    'cronText': crontext,
                    'dateTime': currentDate,
                    'timeZone': 'Asia/Kolkata'
                }

            };
        }
        let options: RequestOptionsArgs;
        if (formatTemp === 'pdf') {
            options = new RequestOptions();
            this.http.post('/rsb-report/reports/getReportOffline.pdf?Accept-Language=' + this.appService.currentLang, this.reportData, options).subscribe(res => {
                //  alert("Report will be sent to your mail id");

            });
        }
        if (formatTemp == 'csv') {
            options = new RequestOptions();
            this.http.post('/rsb-report/reports/getReportOfflineXlsx?Accept-Language=' + this.appService.currentLang, this.reportData, options).subscribe(res => {
                //  alert("Report will be sent to your mail id");

            });
        }
        if (formatTemp == 'html') {
            options = new RequestOptions();
            this.http.post('/rsb-report/reports/getReportOfflineHtml?Accept-Language=' + this.appService.currentLang, this.reportData, options).subscribe(
                (res: any) => {
                    console.log(res);
					let newWindow = window.open();
					newWindow.document.write(res);
					newWindow.document.close();
                    //  alert("Report will be sent to your mail id");

                });
        }

        this.inputParam = {};
    }

    getReport(formatTemp, reportid, reportType, pageNum, reportname) {
    console.log("1111111111111",formatTemp);
    console.log("2222222222222",reportid);
    console.log("3333333333333",reportType);
    console.log("4444444444444",pageNum);
    console.log("5555555555555",reportname);
        if (pageNum == '' || pageNum == null) {
            pageNum = 0;
        }
        console.log(pageNum);
        this.reportData = {
            'id': reportid,
            'inputParams': this.inputParam,
            'page': pageNum,
            'size': 1000,
            'language': this.appService.currentLang,

        };
        if (reportType === 'ES') {

            // if (confirm('This report contains more records. Please select filter criteria using config to limit the result. You can also get the set of 1000 rows by giving page number. Ex. if page =0 it will return 1st set of 1000 , if its 1 it will return 2nd set of 1000 records. ')) {
            // }
            // else {
            // 	return;
            // }
            if (this.inputParam.condition) {
                this.reportData = {
                    'id': reportid,
                    'condition': this.inputParam.condition,
                    'rules': this.inputParam.rules,
                    'page': pageNum,
                    'size': 1000,
                    'language': this.appService.currentLang,

                };
            }

        }

        let options: RequestOptionsArgs;
        if (formatTemp === 'pdf') {
            options = new RequestOptions();
            options.responseType = ResponseContentType.Blob;
            this.http.post('/rsb-report/reports/getReport.pdf?Accept-Language=' + this.appService.currentLang, this.reportData, options).subscribe(res => {
                // let contentDisposition = res.headers('Content-Disposition');
                let filename = reportname + '.pdf';
                // filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();

                let fileBlob = res.blob();
                let blob = new Blob([fileBlob], {
                    type: 'application/pdf' // must match the Accept type
                });
                FileSaver.saveAs(blob, filename);


            });
        }
        if (formatTemp == 'csv') {
            options = new RequestOptions();
            options.responseType = ResponseContentType.Blob;
            this.http.post('/rsb-report/reports/getReport.xlsx?Accept-Language=' + this.appService.currentLang, this.reportData, options).subscribe(res => {
                let fileBlob = res.blob();
                let blob = new Blob([fileBlob], {
                    type: 'application/xlsx' // must match the Accept type
                });
                let filename = reportname + '.xlsx';
                FileSaver.saveAs(blob, filename);

            });
        }
        if (formatTemp == 'html') {

            this.http.post('/rsb-report/reports/getReport.html?Accept-Language=' + this.appService.currentLang, this.reportData).subscribe(res => {
                //console.log(res._body);
                let newWindow = window.open();
                newWindow.document.write(res._body);
                newWindow.document.close();

                // let fileBlob = res.blob();
                // let blob = new Blob([fileBlob], {
                //     type: 'text/plain' // must match the Accept type
                // });
                // let filename = reportname+'.html';
                // FileSaver.saveAs(blob, filename);

            });
        }

        this.inputParam = {};
    }
} //end
