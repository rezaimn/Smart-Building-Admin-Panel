import {Component, OnInit, Inject, Input, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {LocalStorageService, LocalStorage, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {GroupService} from '../group.service';
import {PersonalInfo} from '../group';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'jalali-moment';
import {Department, SubDepartment, Designation} from '../../../organizations/staff/staff';
import {AppService} from '../../../../app.service';
import {accessGroup, accessLevel, timeSchedule} from '../../access-model';
import {PrepareAccessLevelComponent} from '../../level/prepare-access-level/prepare-access-level.component';
import {LevelService} from '../../level/level.service';


@Component({
  selector: 'app-view-staff',
  templateUrl: './prepare-access-group.component.html',
  styleUrls: ['./prepare-access-group.component.scss']
})
export class PrepareAccessGroupComponent implements OnInit, OnDestroy {
    public prepareAccessGroup: accessGroup;
    public mode = 'new';
    public now = moment();
    public accessLevels: any[] = [];
    @SessionStorage('prepareAccessGroupComponentOpenCount')
    public prepareAccessGroupComponentOpenCount;



    constructor(private groupService: GroupService,
                public dialogRef: MatDialogRef<PrepareAccessGroupComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public appService: AppService,
                private storage: LocalStorageService,
                public translate: TranslateService,
                private sessionStorageService: SessionStorageService,
                private router: Router) {
        //   if(data.length > 0){
        this.prepareAccessGroup = data.accessG;
        this.mode = data.mode;
        dialogRef.disableClose = true;
        //   }

    }

    ngOnInit() {

        this.getAllAccessLevels();
        //this.getAllTimeSchedules();
    }

    ngAfterViewInit() {
    }


    getAllAccessLevels() {


        this.groupService
            .getAllAccessLevels(this.appService.currentLang)
            .subscribe((res) => {
                this.accessLevels.splice(0, this.accessLevels.length);
                let accessLs = JSON.parse(res._body).content;
                for (let accessL of accessLs) {
                    let newAL = new accessLevel(accessL);
                    let flag = false;
                    for (let area of this.prepareAccessGroup.areas) {
                        if (newAL.id == area.id) {
                            flag = true;
                            newAL.hasAccess = true;
                            this.accessLevels.push(newAL);
                            break;
                        }
                    }
                    if (!flag) {
                        this.accessLevels.push(newAL);
                    }

                }
            }, (err) => {

            });

    }


    addUpdateAccessGroup() {

        this.setAccessLevelsForGroup();


        if(this.mode=='new'){
            delete this.prepareAccessGroup.id;
            this
                .groupService
                .addAccessLevel(this.prepareAccessGroup)
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
        if(this.mode=='edit'){
            this
                .groupService
                .updateAccessLevel(this.prepareAccessGroup)
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


    setAccessLevelsForGroup() {
        this.prepareAccessGroup.areas.splice(0,this.prepareAccessGroup.areas.length);
        for (let AL of this.accessLevels) {
            if (AL.hasAccess == true) {
                this.prepareAccessGroup.areas.push(AL);
            }
        }
    }

    setAccessLevels(index) {
        this.accessLevels[index].hasAccess = !this.accessLevels[index].hasAccess;
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
        this.prepareAccessGroupComponentOpenCount = 0;
    }
}
