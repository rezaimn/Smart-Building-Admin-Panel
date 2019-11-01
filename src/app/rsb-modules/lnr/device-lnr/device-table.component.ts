import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {LnrDeviceModel} from './lnr-device-model';
import {Router} from '@angular/router';
import {PaginationService} from '../../../pagination-service';
import {LnrAPIService} from '../lnr-API-service';
import {AppService} from '../../../app.service';
import {ExcelService} from '../excel.service';
import {SessionStorage} from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';
// import {MatDialog, MdSnackBar} from '@angular/material';

// import {MatSnackBar} from '@angular/material';


/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
    selector: 'app-device-table',
    templateUrl: './device-table.component.html',
    styleUrls: ['./device-table.component.scss']
})
export class DeviceTableComponent implements OnInit {
    disableCSV=true;
    public models= [];
    public TName='';
    public models1: LnrDeviceModel[] = [];
    public page = 1;
    public perPage: number = 5;
    public totalRecordsCount: number = 0;
    public totalPages: number = 0;
    @SessionStorage('subsidiary')
    public subsidiary;
    constructor(private sanitizer: DomSanitizer,
                private paginationService: PaginationService,
                private lnrApiService: LnrAPIService,
                private router: Router,
                public appService: AppService,
                private excelExport: ExcelService,
                public translate: TranslateService) {


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


    getDeviceList()
    {
        this.lnrApiService.get('/LNR/GetHVACDataBySubsidiary?id=' + this.subsidiary.id +'&searchfield=device_name'+'&searchvalue='+this.TName+'&page=' + this.page + '&records=' + this.perPage)
        .subscribe(res => {
            if (res.status === 200) {
                const items = JSON.parse(res._body);
                this.models1=items.records;
                this.totalRecordsCount=items.totalrecords;
                var x = this.totalRecordsCount % this.perPage;
                var y = this.totalRecordsCount - x;
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
                this.translate.get('error-messages.device-no-data',this.appService.currentLang).subscribe(
                    (subHeaderT)=> {
                        this.appService.showFail(subHeaderT);
                    }
                )
        });

        
    }


    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this. getDeviceList();
    }


    //excute function
    //no params
    excute() {
        this. getDeviceList();
        console.log('excute is fired');
    }

    exportCSV() {
        this.models = [];
        this
            .lnrApiService
            .get('/LNR/GetHVACDataBySubsidiary?id=' + this.subsidiary.id + '&page=' + this.totalPages)
            .subscribe(res => {
                if (res.status === 200) {
                    let items = JSON.parse(res._body);
                    this.models=items.records;
                    let i=1;
                    let tempData=[];
                    for(let data of this.models){
                        let rowData={
                            "NO":i,
                            "DEVICE NAME":data.devicename,
                            "REAL-TIME TEMPERATURE":data.devicevalue.toFixed(2)+" °C"

                        }
                        tempData.push(rowData);
                        i=i+1;
                    }
                    this.excelExport.exportToCSV('Device_Report', ['DEVICE NAME','REAL-TIME TEMPERATURE'], tempData);

                }
            }, (error: any) => {
                this.translate.get('error-messages.device-no-data',this.appService.currentLang).subscribe(
                    (subHeaderT)=> {
                        this.appService.showFail(subHeaderT);
                    }
                )
            });
    }
    toFixed(temp:any){
        return temp.toFixed(2);
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
        this.translate.get('sub-header.devices',this.appService.currentLang).subscribe(
            (subHeaderT)=>{
                subHeader=subHeaderT;
                this.translate.get('page-details.logging-reporting.devices',this.appService.currentLang).subscribe(
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
