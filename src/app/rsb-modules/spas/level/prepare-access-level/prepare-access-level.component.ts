import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {LevelService} from '../level.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'jalali-moment';
import {AppService} from '../../../../app.service';
import {accessComponent, accessLevel, timeSchedule} from '../../access-model';


@Component({
    selector: 'app-view-staff',
    templateUrl: './prepare-access-level.component.html',
    styleUrls: ['./prepare-access-level.component.scss']
})
export class PrepareAccessLevelComponent implements OnInit, OnDestroy {

    public prepareAccessLevel: accessLevel;
    public mode = 'new';
    public now = moment();
    public accessComponents: any[] = [];
    @SessionStorage('prepareAccessLevelComponentOpenCount')
    public prepareAccessLevelComponentOpenCount;
    public timeSchedules = [];
    public selectedTSId=0;

    public scrollbarOptions = {
        axis: 'y',
        theme: 'minimal-dark',
        mouseWheel: {
            enable: true
        },
        contentTouchScroll: 200,
        scrollInertia: 0,
        mouseWheelPixels: 300
    };
    constructor(private levelService: LevelService,
                public dialogRef: MatDialogRef<PrepareAccessLevelComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public appService: AppService,
                private storage: LocalStorageService,
                private staffService: LevelService,
                public translate: TranslateService,
                private sessionStorageService: SessionStorageService,
                private router: Router) {
        //   if(data.length > 0){
        this.prepareAccessLevel = data.accessL;

        this.selectedTSId=data.accessL.timeSchedule.id;

        this.mode = data.mode;
        dialogRef.disableClose = true;
        //   }

    }

    ngOnInit() {

        this.getAllAccessComponents();
        this.getAllTimeSchedules();
    }

    ngAfterViewInit() {
    }


    getAllAccessComponents() {


        this.levelService
            .getAllAccessComponents(this.appService.currentLang,)
            .subscribe((res) => {
                this.accessComponents.splice(0, this.accessComponents.length);
                let accessCs = JSON.parse(res._body).content;
                for (let accessC of accessCs) {
                    let newAC = new accessComponent(accessC);
                    let flag = false;
                    for (let door of this.prepareAccessLevel.doors) {
                        if (newAC.id == door.id) {
                            flag = true;
                            newAC.hasAccess = true;
                            this.accessComponents.push(newAC);
                            break;
                        }
                    }
                    if (!flag) {
                        this.accessComponents.push(newAC);
                    }

                }
            }, (err) => {

            });

    }

    getAllTimeSchedules() {

        this.levelService
            .getAllTimeSchedules()
            .subscribe((res) => {
                this.timeSchedules.splice(0, this.timeSchedules.length);
                this.timeSchedules = JSON.parse(res._body);

            }, (err) => {

            });
    }
    addUpdateAccessLevel() {

        this.setAccessComponentsForLevel();
        //console.log(this.prepareAccessLevel);
        for(let TS of this.timeSchedules){
            if(TS.id==this.selectedTSId){
                this.prepareAccessLevel.timeSchedule = TS;
            }
        }
        if(this.mode=='new'){
            delete this.prepareAccessLevel.id;
            this
                .levelService
                .addAccessLevel(this.prepareAccessLevel)
                .subscribe((data) => {
                    let jsonData = JSON.parse(data._body);

                    if (jsonData.length) {

                        jsonData = JSON.parse(jsonData);
                    } else {
                    }
                  //  console.log("created successssssssssssssssssssssssssss");
                    this.closeModal();
                }, (error) => {

                });

        }
        if(this.mode=='edit'){
            this
                .levelService
                .updateAccessLevel(this.prepareAccessLevel)
                .subscribe((data) => {

                    let jsonData = JSON.parse(data._body);

                    if (jsonData.length) {
                        jsonData = JSON.parse(jsonData);
                    } else {

                    }
                    this.closeModal();
                }, (error) => {

                });
        }
    }
    setAccessComponentsForLevel() {
        this.prepareAccessLevel.doors.splice(0, this.prepareAccessLevel.doors.length);
        for (let AC of this.accessComponents) {
            if (AC.hasAccess == true) {
                this.prepareAccessLevel.doors.push(AC);
            }
        }
    }
    setAccessComponents(index) {
        this.accessComponents[index].hasAccess = !this.accessComponents[index].hasAccess;
    }
    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }
    ngOnDestroy() {
        this.storage.store('addClicked', false);
        this.prepareAccessLevelComponentOpenCount = 0;
    }
}
