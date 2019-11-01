
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import {LnrSubsidiaryModel} from './lnr-subsidiary-model';

import {Router} from '@angular/router';
import {AppService} from '../../../app.service';
import {LnrAPIService} from '../lnr-API-service';
import {SessionStorage} from 'ngx-webstorage';
import {PaginationService} from '../../../pagination-service';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from '../../../common';
import {EavWrapperService} from '../../../utils/services/eav-wrapper.service';

// import { MdSnackBar } from '@angular/material';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-view-subsidiary',
    templateUrl: './view-subsidiary.component.html',
    styleUrls: ['./view-subsidiary.component.scss']
})
export class ViewSubsidiaryComponent implements OnInit {

    public models:LnrSubsidiaryModel[]=[];
    @SessionStorage('organization')
    public organization;

    @SessionStorage('subsidiary')
    public subsidiary;

    @SessionStorage('subdiaryId')
    public subdiaryId;

    @SessionStorage('user')
    public user;
    public subsidiaries: any;
    public page : number = 1;
    public perPage: number=5;
    public totalRecordsCount:number=0;
    public totalPages:number=0;
    constructor(public appService: AppService,
                private apiService:LnrAPIService,
                public authenticationService: AuthenticationService,
                private router: Router,
                private paginationService:PaginationService,
                public translate:TranslateService,
                private evaWrapper: EavWrapperService,

    ) {
    }
    ngOnInit() {

        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );

        this.getSubsidiary();
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
    }
    /**
     @Desc get all subsidiaries
     @Param
     @return
     */
    getSubsidiary() {
        this.subsidiaries = [];
        this
            .apiService
            .getSubsidiaryList(`/rsb-oms/oms/getChildEntities?parentId=` + this.organization.id+`&Accept-Language=`+this.appService.currentLang)
            .subscribe(res => {
                if (res.status === 200) {
                    let allSubsidiaries = JSON.parse(res._body);
                    allSubsidiaries.forEach(subsidiary => {
                        let subsidiaryJson = this
                            .evaWrapper
                            .eavToJson(subsidiary, 'SUBSIDIARY');
                        if (subsidiaryJson !== null) {
                            this
                                .subsidiaries
                                .push(subsidiaryJson);
                        }
                    });
                }
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured', 'Ok', {
                //     duration: 5000,
                //     // extraClasses: ['error-snackbar']
                //   });
            });
    }

    /**
     @Desc set sub header logo
     @Param
     @return
     */
    // sendHeaderWithLogo(): void {
    //     // Send message to subscribers via observable subject
    //     if (this.organization !== null) {
    //         this
    //             .appService
    //             .sendHeaderWithLogo(this.organization.name, 'subsidairies', 'select Subsidairy', '','../../../../../assets/images/dashboard/LOGGING-AND-REPORTING.png');
    //     }
    // }

    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        if (this.organization !== null) {

            let subHeader = '';
            let pageDetails = '';
            let orgName: '';
            if (this.appService.currentLang == 'en') {
                orgName = this.organization.name.map.en;
            }
            if (this.appService.currentLang == 'fa') {
                orgName = this.organization.name.map.fa;
            }
            let routeName = '';
            this.translate.get('sub-header.subsidiaries', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.manage-subsidiary', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;

                            this
                                .appService
                                .sendHeaderWithLogo(orgName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/LOGGING-AND-REPORTING.png');

                        }
                    );
                }
            );
        }
    }


    /**
     @Desc store  subsidiary
     @Param subsidiary temp
     @return
     */
    storeSubsidiary(subsidiary) {
        this.subdiaryId = subsidiary.id;
        this.subsidiary = subsidiary;
        let sideBarData = this.authenticationService.getSideBarContent('lnr',this.appService.currentLang);
        if(sideBarData.length>0){
            this.router.navigate([sideBarData[0].route])
        }
    }
    /**
     @Desc set page NO for pagination
     @Param statuses are next first last previous
     @return
     */
    setPage(status: string) {
        this.page = this.paginationService.setPage(this.page, status, this.totalPages);
        this.getSubsidiary();
    }
    /**
     @Desc set sub header links
     @Param
     @return
     */
    updateBreadCrums() {
        this.appService.updateBreadCrums('LNR-SUBSIDIARY');
    }
}
