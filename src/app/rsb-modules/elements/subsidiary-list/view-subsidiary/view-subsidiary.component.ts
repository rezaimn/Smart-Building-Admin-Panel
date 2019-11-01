import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AppService } from '../../../../app.service';
import { MatSnackBar } from '@angular/material';
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

    //public subsidiaries: ManageSubsidiary[] = [];
    public subsidiaries: any;
    constructor(
        public dialog: MatDialog,
        public appService: AppService,
        public layoutComponent: LayoutComponent,
        public snackBar: MatSnackBar,
        public authenticationService: AuthenticationService,
        private router: Router,
        private subsidiaryListService: SubsidiaryListService,
        private evaWrapper: EavWrapperService,
        public translate:TranslateService
    ) { }
    /**
     @Desc get all subsidiary list
     @Param
     @return
     */
    getSubsidiary() {
        this.subsidiaries = [];
        this
            .subsidiaryListService
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

            });
    }

    // sendHeader(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.organization !== null) {
    //     this
    //       .appService
    //       .sendHeader(this.organization.name, 'subsidairies', 'select Subsidairy', '');
    //   }
    // }
    /**
     @Desc set header logo
     @Param
     @return
     */
    // sendHeaderWithLogo(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.organization !== null) {
    //     this
    //       .appService
    //       .sendHeaderWithLogo(this.organization.name, 'subsidairies', 'select Subsidairy', '','../../../../../assets/images/dashboard/INDOOR-SURVEILLANCE-SYSTEM.png');
    //   }
    // }

    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        if (this.organization !== null) {
            // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",this.organization);
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
                                .sendHeaderWithLogo(orgName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/INDOOR-SURVEILLANCE-SYSTEM.png');

                        }
                    );
                }
            );
        }
    }

    /**
     @Desc store subsidiary to local variable
     @Param subsidiary object
     @return
     */
    storeSubsidiary(subsidiary) {
        this.subdiaryId = subsidiary.id;
        this.subsidiary = subsidiary;
        let sideBarData = this.authenticationService.getSideBarContent('elements',this.appService.currentLang);
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
    /**
     @Desc set sub header links
     @Param
     @return
     */
    updateBreadCrums() {
        this.appService.updateBreadCrums('EMS-SUBSIDIARY-LIST');
    }

}
