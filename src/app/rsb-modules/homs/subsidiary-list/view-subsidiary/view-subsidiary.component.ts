import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AppService } from '../../../../app.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {AuthenticationService, LayoutComponent} from '../../../../common';
import { ConfirmModalComponent } from '../../../../common';
import { SubsidiaryListService } from '../subsidiary-list.service';
import { EavWrapperService } from '../../../../utils/services/eav-wrapper.service';
import { SessionStorage } from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-view-subsidiary',
    templateUrl: './view-subsidiary.component.html',
    styleUrls: ['./view-subsidiary.component.scss']
})
export class ViewSubsidiaryComponent implements OnInit {

    @SessionStorage('organization')
    public organization;

    @SessionStorage('subsidiary')
    public subsidiary;

    @SessionStorage('subdiaryId')
    public subdiaryId;



    public page : number = 1;
    public perPage: number=3;
    public totalRecordsCount:number=0;
    public totalPages:number=0;

    //public subsidiaries: ManageSubsidiary[] = [];
    public subsidiaries: any;

    constructor(
        public dialog: MatDialog,
        public appService: AppService,
        public layoutComponent: LayoutComponent,
        public authenticationService: AuthenticationService,
        private router: Router,
        private subsidiaryListService: SubsidiaryListService,
        private evaWrapper: EavWrapperService,
        public translate:TranslateService
    ) { }

    getSubsidiary() {
        this.subsidiaries = [];
        this
            .subsidiaryListService
            .getSubsidiaryList(`/rsb-oms/oms/getChildEntities?parentId=` + this.organization.id +`&Accept-Language=`+this.appService.currentLang)
            .subscribe(res => {
                if (res.status === 200) {
                    let allSubsidiaries = JSON.parse(res._body);
                    this.totalRecordsCount = allSubsidiaries.length;
                    var x = this.totalRecordsCount % this.perPage;
                    var y = this.totalRecordsCount - x;
                    if(x == 0){
                        this.totalPages = y / this.perPage ;
                    } else {
                        this.totalPages = y / this.perPage + 1;
                    }
                    allSubsidiaries.forEach(subsidiary => {
                        let subsidiaryJson = this
                            .evaWrapper
                            .eavToJson(subsidiary, 'SUBSIDIARY');
                        if (subsidiaryJson !== null) {
                            this
                                .subsidiaries
                                .push(subsidiaryJson);
                        }
                        // alert(this.subsidiaries);
                    });
                }
            }, (error: any) => {
                this.appService.showFail('NO SUBSIDIARY AVAILABLE.');
            });
    }


    // sendHeaderWithLogo(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.organization !== null) {
    //     this
    //       .appService
    //       .sendHeaderWithLogo(this.organization.name, 'subsidairies', 'select Subsidairy','', '../../../../../assets/images/dashboard/HOSPITALITY-MANAGEMENT-SYSTEM.png');
    //   }
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
                                .sendHeaderWithLogo(orgName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/HOSPITALITY-MANAGEMENT-SYSTEM.png');

                        }
                    );
                }
            );
        }
    }


    storeSubsidiary(subsidiary) {
        this.subdiaryId = subsidiary.id;
        this.subsidiary = subsidiary;
        let sideBarData = this.authenticationService.getSideBarContent('homs',this.appService.currentLang);
        if(sideBarData.length>0){
            this.router.navigate([sideBarData[0].route])
        }
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

    updateBreadCrums() {
        this.appService.updateBreadCrums('HOMS-SUBSIDIARY');
    }

}
