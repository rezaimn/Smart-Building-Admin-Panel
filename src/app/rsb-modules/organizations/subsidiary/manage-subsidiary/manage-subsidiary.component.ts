import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../../../../app.service';
import {MatDialog} from '@angular/material';
import {ConfirmModalComponent, LayoutComponent} from '../../../../common';
import {PrepareSubsidiaryComponent} from '../prepare-subsidiary/prepare-subsidiary.component';
import {SubsidiaryService} from '../subsidiary.service';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service'
import {ManageSubsidiary} from '../subsidiary';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from '../../../../common/authentication.service';

@Component({
    selector: 'app-manage-subsidiary', templateUrl: './manage-subsidiary.component.html', styleUrls: ['./manage-subsidiary.component.scss'],
    // animations: [routerTransition()],
    // host: { '[@routerTransition]': '' }
})

export class ManageSubsidiaryComponent implements OnInit {

    @SessionStorage('organization')
    public organization;

    @SessionStorage('subsidiary')
    public subsidiary;
    @SessionStorage('isLoading')
    public isLoading;
    @SessionStorage('subdiaryId')
    public subdiaryId;
    @SessionStorage('prepareDeviceOpenCount')
    public prepareDeviceOpenCount;


    public addClicked = false; // Flag for add/edit to manage navigation

    public manageSubsidiaries: any[] = [];

    constructor(public translate: TranslateService,
                public dialog: MatDialog,
                public appService: AppService,
                private layoutComponent: LayoutComponent,
                private subsidiaryService: SubsidiaryService,
                private evaWrapper: EavWrapperService,

                private localStorageService: LocalStorageService,
                private route: ActivatedRoute,
                public authenticationService: AuthenticationService,
                private router: Router,) {

    }

    prepareSubsidiary(message, index, subsidiary) {

        subsidiary.nameMultiLingual=subsidiary.name;
        subsidiary.addressMultiLingual=subsidiary.address;
        subsidiary.subsidiaryContactPersonNameMultiLingual=subsidiary.subsidiaryContactPersonName;
        // console.log("Subsiddddddddddddddddddddd",subsidiary);
        let prepareSubsidiaryComponentData = {
            'message': message,
            'index': index,
            'subsidiary': subsidiary
        };
        this
            .layoutComponent
            .addClass();
        $('.page-wrapper').addClass('blur-bg');
        const dialogRef = this
            .dialog
            .open(PrepareSubsidiaryComponent, {
                width: '640px',
                height: 'auto',
                data: prepareSubsidiaryComponentData
            });

        dialogRef
            .afterClosed()
            .subscribe(result => {

                this.localStorageService.store('addClicked', false);
                $('.page-wrapper').removeClass('blur-bg');
                this.layoutComponent
                    .removeClass();


                if (result) {
                    this.evictcache();
                    this.getSubsidiary();
                    this.prepareDeviceOpenCount = 0;
                }
                else {
                    this.prepareDeviceOpenCount = 0;
                }
            });
    }

    deleteSubsidiary(id) {

        let deleteUrl = '/rsb-oms/oms/deleteEntity?id=' + id;
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
                    .removeClass()
                if (result){
                    this.evictcache();
                    this.getSubsidiary();
                }

            });
    }

    evictcache() {

        this.subsidiaryService.evictcache(`/rsb-oms/oms/cacheEvict`)
            .subscribe(res => {
                // this.manageSubsidiary.getSubsidiary();
            }, (error: any) => {

            });
    }

    // sendHeader(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.organization !== null) {
    //     this
    //       .appService
    //       .sendHeader(this.organization.name, 'subsidairies', 'manage subsidiary', 'add subsidiary');
    //   }
    // }
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        if (this.organization !== null) {
              console.log(this.organization,"33333333333333333");
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

                            this.translate.get('route-name.add-subsidiary', this.appService.currentLang).subscribe(
                                (routeNameT) => {
                                    if(this.appService.spaceIsAvailable('SUBSIDIARY')){
                                        routeName = routeNameT;
                                    }
                                    this
                                        .appService
                                        .sendHeaderWithLogo(orgName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/ALERT-MANAGEMENT-SYSTEM.png');
                                }
                            )

                        }
                    );
                }
            );
        }
    }

    getSubsidiary() {
        this.manageSubsidiaries = [];
        this
            .subsidiaryService
            .getSubsidiaryList(`/rsb-oms/oms/getChildEntities?parentId=` + 1+`&Accept-Language=`+this.appService.currentLang)
            .subscribe(res => {
                if (res.status === 200) {
                    let allSubsidiaries = JSON.parse(res._body);
                    allSubsidiaries.forEach(subsidiary => {
                        let subsidiaryJson = this
                            .evaWrapper
                            .eavToJson(subsidiary, 'SUBSIDIARY');
                        if (subsidiaryJson !== null) {
                            this.manageSubsidiaries.push(subsidiaryJson);
                        }
                    });
                     console.log("aaaaaaaaaaaaaaaaaa",this.manageSubsidiaries);
                    if (this.manageSubsidiaries.length > 0) {
                        this.appService.reinitializeGlobalSearch('SUBSIDIARY', this.manageSubsidiaries);
                    }
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

    lineclamp() {
        let chars = $('.addr').text().length;
        if (chars >= 5) {
            $('.addr').addClass('shrink-line');
        }
    }

    ngOnInit() {
        this.isLoading=false;
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );
        this.getSubsidiary();
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.prepareDeviceOpenCount = 0;
        this.localStorageService
            .observe('search-text').subscribe((newValue) => {
            console.log(newValue);
        })
        this
            .localStorageService
            .observe('addClicked')
            .subscribe((clickedRes) => {
                this.addClicked = clickedRes;

                if (this.addClicked && (this.prepareDeviceOpenCount === 0 || this.prepareDeviceOpenCount === null) && this.router.url === '/rsb-modules/organization/space/subsidiary/manage') {
                    if (this.prepareDeviceOpenCount === null) {
                        this.prepareDeviceOpenCount = 0;
                    } else {
                        this.prepareDeviceOpenCount++;
                    }
                    $('.single-campus.active').removeClass('active');
                    this.prepareSubsidiary('new', this.manageSubsidiaries.length + 1, {});
                }
            });
    }

    storeSubsidiary(subsidiary) {
        this.subdiaryId = subsidiary.id;
        this.subsidiary = subsidiary;

        let sideBarData = this.authenticationService.getSideBarContent('organization',this.appService.currentLang);
        if(sideBarData.length>0){
            this.router.navigate([sideBarData[0].route])
        }
    }

    updateBreadCrums() {
        this.appService.updateBreadCrums('SUBSIDIARY');
    }
}
