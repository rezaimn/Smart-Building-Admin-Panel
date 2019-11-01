
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import {Router} from '@angular/router';

import {DatePipe} from '@angular/common';
import {MatDialog} from '@angular/material';
import {ExcelService} from '../excel.service';
import {AppService} from '../../../app.service';
import {PaginationService} from '../../../pagination-service';
import {LnrAPIService} from '../lnr-API-service';
import {SessionStorage} from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';

// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MdSnackBar } from '@angular/material';



/* Declaring the letiable for svg functionality */
declare const svgPanZoom: any;
declare const $: any;
declare const Hammer: any;

@Component({
  selector: 'app-staff-table',
  templateUrl: './staff-table.component.html',
  styleUrls: ['./staff-table.component.scss']
})
export class StaffTableComponent implements OnInit {
    @SessionStorage('subsidiary')
    public subsidiary;
    public page = 1;
    disableCSV=true;
    public perPage= 5;
    public totalRecordsCount= 0;
    public totalPages= 0;
    public searchType= 0;
    public date : any ; //= "02/03/2018";//current date
    public pickedDate: any;
    public pickedDateStr: any;
    public currentDate: any;
    public rep: any = [];
    public models: any= [];
    public models1: any= [];

    public searchValue='';
    constructor(public apiService: LnrAPIService,
                private sanitizer: DomSanitizer,
                private paginationService: PaginationService,
                public dialog: MatDialog,
                public appService: AppService,
                private router: Router,
                private excelExport: ExcelService,
                public translate: TranslateService
    ) {

    }
    ngOnInit() {
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )
    }
    excute(){
        this.page = 1;

        this.getStaffList();
    }



 getStaffList()
    {
        let searchTypeString='';
        if(this.searchType==1){
            searchTypeString='firstname';
        }else if(this.searchType==2){
            searchTypeString='lastname';
        }
        else if(this.searchType==3){
            searchTypeString='employee_id';
        }
        else if(this.searchType==4){
            searchTypeString='mobile_num';
        }
        this.apiService.get('/LNR/GetStaffBySubsidiary?id=' + this.subsidiary.id +'&searchfield='+searchTypeString+'&searchvalue='+this.searchValue+ '&page=' + this.page + '&records=' + this.perPage+'&Accept-Language='+this.appService.currentLang)
        .subscribe(res => {
            if (res.status === 200) {
                const allStaffs = JSON.parse(res._body);
                this.models1 = allStaffs.records;
                this.totalRecordsCount = allStaffs.totalrecords;
                const x = this.totalRecordsCount % this.perPage;
                const y = this.totalRecordsCount - x;
                if(x == 0){
                    this.totalPages = y / this.perPage ;
                } else {
                    this.totalPages = y / this.perPage + 1;
                }
                this.disableCSV=false;
            }
            if(this.models1.length==0){
                this.disableCSV=true;
                this.translate.get('error-messages.empty-result',this.appService.currentLang).subscribe(
                    (subHeaderT)=> {
                        this.appService.showFail(subHeaderT);
                    }
                )
            }
        }
        , (error: any) => {
                this.disableCSV=true;
                this.translate.get('error-messages.staff-no-data',this.appService.currentLang).subscribe(
                    (subHeaderT)=> {
                        this.appService.showFail(subHeaderT);
                    }
                )

            });


    }

    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.getStaffList();
    }
    exportCSV(){
        let searchTypeString='';
        if(this.searchType==1){
            searchTypeString='firstname';
        }else if(this.searchType==2){
            searchTypeString='lastname';
        }
        else if(this.searchType==3){
            searchTypeString='employee_id';
        }
        else if(this.searchType==4){
            searchTypeString='mobile_num';
        }
        this.models = [];
        this
            .apiService
            //.getStaffList("/LNR/GetStaffBySubsidiary?id="+this.subsidiary.id)
            .get('/LNR/GetStaffBySubsidiary?id=' + this.subsidiary.id +'&searchfield='+searchTypeString+'&searchvalue='+this.searchValue+ '&page=' + this.totalPages+'&Accept-Language='+this.appService.currentLang )

            .subscribe(res => {
                if (res.status === 200) {
                    const allStaffs = JSON.parse(res._body);
                    this.models = allStaffs.records;
                    let i=1;
                    let tempData=[];
                    for(let data of this.models){
                        let rowData={
                            "NO":i,
                            "FIRST NAME":data.firstname,
                            "LAST NAME":data.lastname,
                            "SYSTEM CODE":data.employeeid,
                            "CONTACT NUMBER":data.contactnumber,
                            "DESIGNATION":data.designation

                        }
                        tempData.push(rowData);
                        i=i+1;
                    }
                    this.excelExport.exportToCSV('Staff_Report', ['NO', 'FIRST NAME', 'LAST NAME', 'SYSTEM CODE', 'CONTACT NUMBER', 'DESIGNATION'], tempData);
                }
            }, (error: any) => {
                this.translate.get('error-messages.staff-no-data',this.appService.currentLang).subscribe(
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
        this.translate.get('sub-header.staff',this.appService.currentLang).subscribe(
            (subHeaderT)=>{
                subHeader=subHeaderT;
                this.translate.get('page-details.logging-reporting.staff',this.appService.currentLang).subscribe(
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
}
