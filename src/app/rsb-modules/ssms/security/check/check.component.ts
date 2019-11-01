import {SecurityService} from './../security.service';
import {MasterDataService} from './../../../../utils/services/master-data.service';
import {AppService} from './../../../../app.service';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
//import { SecurityService } from '../security.service';
import {Router} from '@angular/router';
import {NgModel} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
// import { DeviceSecurity } from 'app/rsb-modules/ssms/security/security';

declare let $: any;

@Component({
    selector: 'app-check',
    templateUrl: './check.component.html',
    styleUrls: ['./check.component.scss']
})
export class CheckComponent implements OnInit {

    @SessionStorage('addCheckCount')
    public addCheckCount;

    @SessionStorage('subsidiary')
    public subsidiary;
    public deviceSecurity: any = [];
    public checkListItems: any = [
        // {"devicetypeid":5,"checklistitem":"Please check the CEO room lights are OFF"},
        // {"devicetypeid":5,"checklistitem":"Please check the CEO room doors are closed"},
        // {"devicetypeid":5,"checklistitem":"Please check the COO room lights are OFF"},
        // {"devicetypeid":5,"checklistitem":"Please check the CEO room door is closed"},
        // {"devicetypeid":5,"checklistitem":"Please check the CEO room windows are closed"},
        // {"devicetypeid":5,"checklistitem":"Please check the COO room windows are OFF"},
        // {"devicetypeid":5,"checklistitem":"Please check the CTO room lights are OFF"},
        // {"devicetypeid":5,"checklistitem":"Please check the CFO room lights are OFF"},
        // {"devicetypeid":5,"checklistitem":"Please check the lobby room lights are OFF"}
    ];


    // public deviceSecurity: any;
    public formatTime: any;
    public selecetedDeviceId: any;

    public Selectedscheduledtime: string = '';
    public checklistTitle: any;

    public campusDropdownList: any[];
    public buildingDropdownList: any[];
    public floorDropdownList: any[];
    public selectedCampusId: any = 0;
    public selectedBuildingId: any = 0;
    public selectedFloorId: any = 0;
    public selectedDeviceId: any = 0;
    public deviceDropdownList: any[];
    // public deviceSecurity: any = new DeviceSecurity();
    public wrongTime: boolean;
    public editData: boolean = true;

    public checkData: any = [];

    constructor(
        public dialogRef: MatDialogRef<CheckComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private storage: LocalStorageService,
        public dialog: MatDialog,
        public appService: AppService,
        private sessionStorageService: SessionStorageService,
        public masterDataService: MasterDataService,
        public securityService: SecurityService,
        public translate: TranslateService,
        // public layoutComponent: LayoutComponent,
        private router: Router) {
        dialogRef.disableClose = true;
        this.checkData = data;
        if (this.checkData !== null) {
            console.log(this.checkData);
            this.editData = false;
            this.deviceSecurity.title = this.checkData.name;
            this.Selectedscheduledtime = this.checkData.scheduledtime;
            this.checkListItems = this.checkData.checklistitems;
        }

    }

    ngOnInit() {

        this.sendHeaderWithLogo();

        this.getAllCampus();
        this.getAllDevices();
        // this.sendHeader();

        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )

    }

    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        //if (this.subsidiary !== null) {

        let subHeader = '';
        let pageDetails = '';
        let subsidiaryName: '';
        this.translate.get('sub-header.manage-security-patrol', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.security-patrol-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;

                        this
                            .appService
                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, '', '../../../../../assets/images/dashboard/SMART-SECURITY-SYSTEM.png');


                    }
                )
            }
        )

    }
    // sendHeader(): void {
    //     // Send message to subscribers via observable subject
    //
    //     this
    //         .appService
    //         .sendHeader('header', 'alms management', 'hello', '');
    //
    // }


    ngAfterViewInit() {
    }

    getAllDevices() {
        this.deviceDropdownList = [];
        this
            .masterDataService
            .getCampusDropdownListPe(`/Common/GetDeviceTypes`)
            .subscribe(res => {
                if (res.status === 200) {

                    this.deviceDropdownList = JSON.parse(res._body);
                }
            }, (error: any) => {
                this.translate.get('error-messages.device-type-no-data',this.appService.currentLang).subscribe(
                    (subHeaderT)=> {
                        this.appService.showFail(subHeaderT);
                    }
                )
            });
    }

    getAllCampus() {
        this.campusDropdownList = [];
        this
            .masterDataService
            .getCampusDropdownListPe(`/Common/GetCampuses?subsidiaryid=` + this.subsidiary.id+ `&Accept_Language=` + this.appService.currentLang)
            .subscribe(res => {
                if (res.status === 200) {

                    this.campusDropdownList = JSON.parse(res._body);
                }
            }, (error: any) => {
                this.translate.get('error-messages.campus-no-data',this.appService.currentLang).subscribe(
                    (subHeaderT)=> {
                        this.appService.showFail(subHeaderT);
                    }
                )
            });
    }

    // On change campus trigger building
    getAllBuildings(event) {

        if (this.selectedCampusId === 0) {
            return;
        }
        this.buildingDropdownList = [];
        this
            .masterDataService
            .getCampusDropdownListPe(`/Common/GetBuildings?campusid=` + this.selectedCampusId+ `&Accept_Language=` + this.appService.currentLang)
            .subscribe(res => {
                if (res.status === 200) {

                    this.buildingDropdownList = JSON.parse(res._body);
                }
            }, (error: any) => {
                this.translate.get('error-messages.building-no-data',this.appService.currentLang).subscribe(
                    (subHeaderT)=> {
                        this.appService.showFail(subHeaderT);
                    }
                )
            });
    }

    getAllFloors() {

        if (this.selectedBuildingId === 0) {
            return;
        }
        this.floorDropdownList = [];
        this
            .masterDataService
            .getCampusDropdownListPe(`/Common/GetFloors?buildingid=` + this.selectedBuildingId+`&Accept_Language=` + this.appService.currentLang)
            .subscribe(res => {
                if (res.status === 200) {

                    this.floorDropdownList = JSON.parse(res._body);
                }
            }, (error: any) => {
                this.translate.get('error-messages.floor-no-data',this.appService.currentLang).subscribe(
                    (subHeaderT)=> {
                        this.appService.showFail(subHeaderT);
                    }
                )
            });
    }


    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }

    editList(index: any) {
        let i = 0

        this.checkListItems.forEach(checkL => {
            if (index === 0) {
                this.checklistTitle = this.checkListItems[0].checklistitem;
                this.selecetedDeviceId = this.checkListItems[0].devicetypeid;
                //  this.checkListItems.pop(index);
            }
            i++;
        });
    }

    deleteList(index: any) {
        let i = 0
        this.checkListItems.forEach(checkL => {
            if (index === i) {
                this.checkListItems.pop(index);
            }
        });
    }

    addCheckList() {
        var dat = {devicetypeid: this.selecetedDeviceId, checklistitem: this.checklistTitle};
        this.checkListItems.push(dat);
    }

    insertCheckList() {

        var dat =
            {
                'name': this.deviceSecurity.title,
                'scheduledtime': this.Selectedscheduledtime,
                'floorid': this.selectedFloorId.id,
                'checklistitems':
                this.checkListItems


            }

        console.log(dat);

        // http://localhost:55408/RSBService.svc/SSMS/UpdateCheckList

        if (this.checkData !== null) {
            this.securityService.InsertCheckList('/SSMS/UpdateCheckList', dat)
                .subscribe(res => {
                    if (res._body === 1) {
                        this.translate.get('error-messages.check-list-update-success',this.appService.currentLang).subscribe(
                            (subHeaderT)=> {
                                this.appService.showSuccess(subHeaderT);
                            }
                        )
                        this.closeModal();
                    }
                    if (res._body === 0) {
                        this.translate.get('error-messages.check-list-failed',this.appService.currentLang).subscribe(
                            (subHeaderT)=> {
                                this.appService.showFail(subHeaderT);
                            }
                        )
                    }
                    if(res._body>=2){
                        this.appService.generalExceptions(res._body);
                    }
                }, (error: any) => {
                    this.translate.get('error-messages.check-list-failed',this.appService.currentLang).subscribe(
                        (subHeaderT)=> {
                            this.appService.showFail(subHeaderT);
                        }
                    )
                });
        } else {
            this.securityService.InsertCheckList('/SSMS/InsertCheckList', dat)
                .subscribe(res => {
                    if (res._body === 1) {
                        this.translate.get('error-messages.check-list-add-success',this.appService.currentLang).subscribe(
                            (subHeaderT)=> {
                                this.appService.showSuccess(subHeaderT);
                            }
                        )
                        this.closeModal();
                    }
                    if (res._body === 0) {
                        this.translate.get('error-messages.check-list-failed',this.appService.currentLang).subscribe(
                            (subHeaderT)=> {
                                this.appService.showFail(subHeaderT);
                            }
                        )
                    }
                    if(res._body>=2){
                        this.appService.generalExceptions(res._body);
                    }
                }, (error: any) => {
                    this.translate.get('error-messages.check-list-failed',this.appService.currentLang).subscribe(
                        (subHeaderT)=> {
                            this.appService.showFail(subHeaderT);
                        }
                    )
                });
        }


    }

    openTimer(event: NgModel, id) {

        let eve = event;
        let self = this;
        $('#' + id)
            .mdtimepicker({
                timeFormat: 'hh:mm:ss',
                format: 'HH:mm tt',
                theme: 'blue',
                readOnly: false,
                hourPadding: false
            })
            .on('timechanged', function (e) {
                console.log(e.time);
                self.Selectedscheduledtime = e.time;
                // console.log(e.time);
                // self.workTime[eve.name] = e.time;
                // if (eve.name === "workEndTime") {
                //   self.checkDuration(self.workTime.workStartTime, self.workTime.workEndTime, 'workend');
                //   self.checkTime(self.workTime.workStartTime, self.workTime.workEndTime, 'work')
                // }
                // if (eve.name === "mealEndTime") {
                //   self.checkDuration(self.workTime.mealStartTime, self.workTime.mealEndTime, 'mealend');
                //   self.checkTime(self.workTime.mealStartTime, self.workTime.mealEndTime, 'meal');
                // }
            });
    }

    // checkTime(strTime, endTime, field) {
    //   if (strTime >= endTime) {
    //     if (field == 'work') {
    //       this.wrongWorkTime = true;
    //     } else if (field == 'meal') {
    //       this.wrongMealTime = true;
    //       this.wrongWorkTime = false;
    //     } else {
    //       this.wrongMealTime = false;
    //     }
    //   }
    // }
    ngOnDestroy() {
        this.storage.store('addClicked', false);
        this.addCheckCount = 0;
    }

}
