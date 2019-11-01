import {Database} from './../shared/database';
import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../../app.service';
import {MatDialog} from '@angular/material';
import {LayoutComponent} from '../../../../common';
import {DatabaseService} from '../database.service';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service';
import {SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {EditDatabaseComponent} from 'app/rsb-modules/sp/database/edit-database/edit-database.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-view-database',
    templateUrl: './view-database.component.html',
    styleUrls: ['./view-database.component.scss']
})
export class ViewDatabaseComponent implements OnInit {

    @SessionStorage('organization')
    public organization;

    @SessionStorage('subsidiary')
    public subsidiary;

    @SessionStorage('subdiaryId')
    public subdiaryId;


    public db: any;
    //public subsidiaries: ManageDatabase[] = [];
    public subsidiaries: any;

    public models: Database[] = [];

    constructor(
        public dialog: MatDialog,
        public appService: AppService,
        public layoutComponent: LayoutComponent,
        public sessionStorageService: SessionStorageService,
        private evaWrapper: EavWrapperService,
        private databaseService: DatabaseService,
        public translate: TranslateService
    ) {
        this.databaseService.cancelButtonClicked.subscribe(
            (res: any) => {
                if (res == true) {
                    this.getDatabases();
                }
            }
        )
    }


    // sendHeader(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.organization !== null) {
    //     this
    //       .appService
    //       .sendHeader(this.organization.name, 'setting panel', 'manage database', '');
    //   }

    // }


    /**
     @Desc set header logo icon
     @Param
     @return
     */
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        if (this.organization !== null) {
            let subHeader = '';
            let pageDetails = '';
            let subsidiaryName: '';
            let routeName = '';
            this.translate.get('sub-header.database-configuration', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.manage-database', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;

                            this
                                .appService
                                .sendHeaderWithLogo("", subHeader, pageDetails, '', '../../../../../assets/images/dashboard/SETTING-PANEL.png');


                        }
                    );
                }
            );
        }
    }


    ngOnInit() {
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.getDatabases();
    }

    /**
     @Desc set sub header links
     @Param
     @return
     */
    updateBreadCrums() {
        this.appService.updateBreadCrums('SP-SUBSIDIARY');
    }

    /**
     @Desc get data base list to show
     @Param
     @return
     */
    getDatabases() {
        //this.models = [];
        this
            .databaseService
            .getDatabases('/SP/GetDatabaseSettings')
            .subscribe(res => {
                if (res.status === 200) {
                    let items = JSON.parse(res._body);
                    this.models = items;
                }
            }, (error: any) => {
                this.translate.get('error-messages.database-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            });
    }

    /**
     @Desc call edit module to show on a modal
     @Param
     @return
     */
    editDb(db) {
        this.sessionStorageService.store('db', db);
        let dbData = {
            'db': db
        };
        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(EditDatabaseComponent, {
                width: '768px',
                height: 'auto',
                data: dbData,
                hasBackdrop: true
            });

        dialogRef
            .afterClosed()
            .subscribe(result => {
                this
                    .layoutComponent
                    .removeClass();
            });
        this.getDatabases();
    }

}
