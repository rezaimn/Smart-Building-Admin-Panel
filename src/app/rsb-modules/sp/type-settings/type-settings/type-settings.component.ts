import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../../app.service';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {TypeSettingsService} from '../type-settings.service';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service';
import {DateAdapter, MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {LayoutComponent} from '../../../../common/index';
import {PrepareTypeComponent} from '../prepare-type/prepare-type.component';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';
import {PaginationService} from '../../../../pagination-service';
import {MasterDataService, SvgService} from '../../../../utils/index';
import {TypeEntities} from '../type-settings';


@Component({
    selector: 'app-manage-role',
    templateUrl: './type-settings.component.html',
    styleUrls: ['./type-settings.component.scss']
})
export class TypeSettingsComponent implements OnInit {
    public page: number = 0;
    public limit: number = 10;
    public size: number = 5;
    public totalPages: number;
    public last: boolean;
    public first: boolean;
    public totalElements: number;
    entityTypeList;
    @SessionStorage('organization')
    public organization;

    @SessionStorage('subsidiary')
    public subsidiary;

    @SessionStorage('subdiaryid')
    public subdiaryid;

    @SessionStorage('role')
    public roles;

    @SessionStorage('prepareTypeComponentOpenCount')
    public prepareTypeComponentOpenCount;
    public mapT = {
        'id': 0,
        'map': {
            'en': '',
            'fa': ''
        }
    }

    public addClicked = false; // Flag for add/edit to manage navigation
    public roleList = [];


    constructor(
        public dialog: MatDialog, public translate: TranslateService,
        public appService: AppService,
        public masterDataService: MasterDataService,
        public eavWrapperService: EavWrapperService,
        public layoutComponent: LayoutComponent,
        private sanitizer: DomSanitizer,
        private storage: LocalStorageService,
        public svgService: SvgService,
        public activatedRoute: Router,
        private typeSettingsService: TypeSettingsService,
        public sessionStorageService: SessionStorageService,
        public dateAdapter: DateAdapter<Date>,
        public paginationService: PaginationService) {
        this.entityTypeList = new TypeEntities().entities;
    }

    ngOnInit() {
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );
        this.prepareTypeComponentOpenCount = 0;
        this.sendHeaderWithLogo();
        this.updateBreadCrums();


    }

    sendHeaderWithLogo(): void {
        let subHeader = '';
        let pageDetails = '';

        let routeName = '';
        this.translate.get('sub-header.type-settings', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.type-settings', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;

                        this
                            .appService
                            .sendHeaderWithLogo('', subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/SETTING-PANEL.png');
                    }
                )


            }
        );
        // }
    }

    updateBreadCrums() {
        this.appService.updateBreadCrums('SP-SUBSIDIARY');
    }

    editTypeEntity(type) {
        let editRoleComponentData = {
            'type': type,
        };
        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(PrepareTypeComponent, {
                width: '1100px',
                height: 'auto',
                data: editRoleComponentData
            });
        dialogRef
            .afterClosed()
            .subscribe(result => {
                this
                    .layoutComponent
                    .removeClass();
            });
    }


}
