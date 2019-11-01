import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ConfirmModalComponent, LayoutComponent} from '../../../../common';
import {PrepareStructureComponent} from '../prepare-structure/prepare-structure.component';
import {ManageStructure} from '../structure';
import {StructureService} from '../structure.service';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service'
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-manage-structure', templateUrl: './manage-structure.component.html', styleUrls: ['./manage-structure.component.scss'],
    // animations: [routerTransition()],
    // host: {'[@routerTransition]': ''}
})
export class ManageStructureComponent implements OnInit {

    public getEle: HTMLCollection;
    public parentId: any;

    public manageStructure: any[] = [];
    @SessionStorage('campus')
    public campus;

    @SessionStorage('prepareDeviceOpenCount')
    public prepareDeviceOpenCount;


    @SessionStorage('structure')
    public structure;
    public addClicked = false; // Flag for add/edit to manage navigation

    constructor(
        public dialog: MatDialog,
        public appService: AppService,
        private layoutComponent: LayoutComponent,
        private structureService: StructureService,
        private evaWrapper: EavWrapperService,
        private route: ActivatedRoute,
        private router: Router,
        private localStorageService: LocalStorageService,
        public translate: TranslateService
    ) {
    }


    ngOnInit() {
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );
        // this.parentId = this.route.snapshot.params['parentId'];
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.prepareDeviceOpenCount = 0;
        this.getStructure();
        this
            .localStorageService
            .observe('addClicked')
            .subscribe((clickedRes) => {
                this.addClicked = clickedRes;
                if (this.addClicked && (this.prepareDeviceOpenCount === 0 ||
                    this.prepareDeviceOpenCount === null)
                    && this.router.url === '/rsb-modules/organization/space/structure/manage') {
                    if (this.prepareDeviceOpenCount === null) {
                        this.prepareDeviceOpenCount = 0;
                    } else {
                        this.prepareDeviceOpenCount++;
                    }
                    $('.single-campus.active').removeClass('active');
                    this.prepareStructure('new', this.manageStructure.length + 1, {});
                }
            });
    }

    prepareStructure(message, index, structure) {
        console.log("strrrrrrrrrrrrrr",structure);
        // structure.buildingTypeMultiLingual=structure.buildingType;
        structure.nameMultiLingual=structure.name;
        structure.descriptionMultiLingual=structure.description;
        this.parentId = this.campus.id;
        let prepareStructureComponentData = {
            'message': message,
            'index': index,
            'structure': structure,
            'parentId': this.parentId
        };
        this
            .layoutComponent
            .addClass();
        const dialogRef = this
            .dialog
            .open(PrepareStructureComponent, {
                width: '640px',
                height: 'auto',
                data: prepareStructureComponentData
            });
        dialogRef
            .afterClosed()
            .subscribe(result => {
                this
                    .localStorageService
                    .store('addClicked', false);
                this
                    .layoutComponent
                    .removeClass();
                if (result) {
                    this.prepareDeviceOpenCount = 0;
                    this.evictcache();
                    this.getStructure();
                }
                else {
                    this.prepareDeviceOpenCount = 0;
                    this.evictcache();
                      this.getStructure();
                }
            });
    }

    evictcache() {

        this.structureService.evictcache(`/rsb-oms/oms/cacheEvict`)
            .subscribe(res => {

            }, (error: any) => {

            });

    }

    // sendHeader(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.campus !== null) {
    //     this.appService.sendHeader(this.campus.name, 'BUILDING / STRUCTURE', 'manage Building / Structure', 'Add BUILDING / STRUCTURE');
    //   }
    // }
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        if (this.campus !== null) {
            let subHeader = '';
            let pageDetails = '';
            let subsidiaryName: '';
            let routeName = '';
            let campusName='';
            if (this.appService.currentLang == 'en') {
                campusName = this.campus.name.map.en;
            }
            if (this.appService.currentLang == 'fa') {
                campusName = this.campus.name.map.fa;
            }
            this.translate.get('sub-header.building-structure', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.manage-building-structure', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;

                            this.translate.get('route-name.add-building-structure', this.appService.currentLang).subscribe(
                                (routeNameT) => {
                                    if(this.appService.spaceIsAvailable('STRUCTURE')){
                                        routeName = routeNameT;
                                    }
                                    this
                                        .appService
                                        .sendHeaderWithLogo(campusName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/OMS.png');
                                }
                            )
                        }
                    );
                }
            );
        }
    }

    getStructure() {
        this.parentId = this.campus.id;
        this.manageStructure = [];
        this
            .structureService
            .getStructureList(`/rsb-oms/oms/getChildEntities?parentId=` + this.parentId  + `&Accept-Language=` + this.appService.currentLang)
            .subscribe(res => {
                if (res.status === 200) {
                    // debugger
                    let allStructures = JSON.parse(res._body);
                    allStructures.forEach(structure => {
                        let structureJson = this.evaWrapper.eavToJson(structure, 'STRUCTURE');
                        if (structureJson !== null) {
                            this.manageStructure.push(structureJson);
                        }

                    });
                   // console.log("sssssssssttttttttttttttttttrrrrrrrrrrrrrr",this.manageStructure);
                }
            }, (error: any) => {

            });
    }

    storeStructure(structure) {
        this.structure = structure;
    }

    updateBreadCrums() {
        this.appService.updateBreadCrums('STRUCTURE');
    }

    // Delete structure
    deleteStructure(id) {
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
                    .removeClass();
                this.evictcache();
                this.getStructure();
            });
    }
}
