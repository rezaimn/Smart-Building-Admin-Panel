import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {LayoutComponent} from '../../../../../common';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {MasterDataService} from '../../../../../utils/services/master-data.service';
import {EavWrapperService} from '../../../../../utils/services/eav-wrapper.service';
import {AppService} from '../../../../../app.service';
import {DomSanitizer} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {fileInfo, skFileAttach} from '../../../sk';
import {AttachFileComponent} from 'app/rsb-modules/sk/sk-manager/programing/attach-sk-file/attach-file.component';
import {EditDatabaseComponent} from '../../../../sp/database/edit-database/edit-database.component';
import {DatabaseService} from '../../../../sp/database/database.service';
import {Database} from '../../../../sp/database/shared/database';



@Component({
    selector: 'app-add-sk',
    templateUrl: './content-scheduling.component.html',
    styleUrls: ['./content-scheduling.component.scss']
})
export class ContentSchedulingComponent {

    public addClicked = false;

    public page: number = 0;
    public limit: number = 10;
    public size: number = 5;
    public totalPages: number;
    public last: boolean;
    public first: boolean;

    public totalElements: number;

    public isLoading: boolean = false;

    @SessionStorage('subdiaryId')
    public subdiaryId;
    @SessionStorage('subsidiary')
    public subsidiary;
    @SessionStorage('prepareDeviceOpenCount')
    public prepareDeviceOpenCount;
    @SessionStorage('prepareDeviceOpenCounts')
    public prepareDeviceOpenCounts;

    public skList: Array<any> = [];
    public selectedArea: any;
    public campusDropdownList: Array<any> = [];
    public buildingDropdownList: Array<any> = [];
    public floorDropdownList: Array<any> = [];
    public areaDropdownList: Array<any> = [];
    public selectedCampusId: any = 0;
    public selectedBuildingId: any = 0;
    public selectedFloorId: any = 0;
    public selectedAreaId: any = 0;
    public selectedCampus: any = null;
    public selectedBuilding: any = null;
    public selectedFloor: any = null;

    constructor(
        public  dialog: MatDialog,
        public appService: AppService,
        private sanitizer: DomSanitizer,
        private localStorageService: LocalStorageService,
        private activatedRoute: Router,
        public translate: TranslateService,
        private storage: LocalStorageService,
        public layoutComponent: LayoutComponent,
        public sessionStorageService: SessionStorageService,
        public masterDataService: MasterDataService,
        private eavWrapperService: EavWrapperService,
    ) {
        //this.departments="";

    }

    ngOnInit() {

        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        // Call the service here to load the campus for particular subsidiary
        this.getAllCampus();
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )

    }


    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        let subHeader = '';
        let pageDetails = '';
        let subsidiaryName: '';
        let routeName = '';
        if (this.appService.currentLang == 'en') {
            subsidiaryName = this.subsidiary.name.map.en;
        }
        if (this.appService.currentLang == 'fa') {
            subsidiaryName = this.subsidiary.name.map.fa;
        }
        this.translate.get('sub-header.sk-management', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.add-disable-enable-sk', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;
                        this
                            .appService
                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/SIGNAGES-AND-KIOSKS.png');

                    }
                );
            }
        );
    }

    updateBreadCrums() {
        this
            .appService
            .updateBreadCrums('SK-MANAGEMENT');
    }

    viewSK(sk) {

        let skFiles:skFileAttach=new skFileAttach({});
        skFiles.deviceId=sk.devices[0].deviceId;
        skFiles.deviceName=sk.devices[0].deviceName;
        for(let file of sk.devices[0].deviceFiles){

            let fileT:fileInfo=new fileInfo({});
            fileT.fileId=file.file.id;
            fileT.dailyScheduleTime=file.dailyScheduleTime;
            fileT.repeatAgain=file.repeatAgain;
            fileT.isUpdated=false;
            fileT.isSaved=true;
            skFiles.files.push(fileT);
        }
       // this.sessionStorageService.store('db', sk);
        let dataT = {
            'skFiles': skFiles
        };
        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(AttachFileComponent, {
                width: '820px',
                height: 'auto',
                data: dataT,
                hasBackdrop: true
            });

        dialogRef
            .afterClosed()
            .subscribe(result => {
                this.getAllSK();
                this
                    .layoutComponent
                    .removeClass();
            });

    }


    getAllCampus() {
        this.campusDropdownList = [];
        this
            .masterDataService
            .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.subsidiary.id + `&Accept-Language=` + this.appService.currentLang)
            .subscribe(res => {
                const allCampusList = JSON.parse(res._body);
                allCampusList.forEach(campus => {
                    const campusJson = this.eavWrapperService.eavToJson(campus, 'CAMPUS');
                    if (campusJson !== null) {
                        this.campusDropdownList.push(campusJson);
                    }
                });
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured while retriving area list', 'Ok', {
                //     duration: 5000,
                //     extraClasses: ['error-snackbar']
                //   });
            });
    }

    /**
     @Desc get all building list for drop down
     @Param
     @return
     */
    getAllBuildings() {
        if (this.selectedCampusId === 0) {
            return;
        }
        this.buildingDropdownList = [];
        this
            .masterDataService
            .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedCampusId + `&Accept-Language=` + this.appService.currentLang)
            .subscribe(res => {
                const allBuildingList = JSON.parse(res._body);
                allBuildingList.forEach(building => {
                    const buildingJson = this.eavWrapperService.eavToJson(building, 'STRUCTURE');
                    if (buildingJson !== null) {
                        this.buildingDropdownList.push(buildingJson);
                    }
                });
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured while retriving area list', 'Ok', {
                //     duration: 5000,
                //     extraClasses: ['error-snackbar']
                //   });
            });
    }

    /**
     @Desc get all floor list for drop down
     @Param
     @return
     */
    getAllFloors() {
        //alert("hi");
        if (this.selectedBuildingId === 0) {
            return;
        }
        this.floorDropdownList = [];
        this
            .masterDataService
            .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedBuildingId + `&Accept-Language=` + this.appService.currentLang)
            .subscribe(res => {
                const allFloorList = JSON.parse(res._body);
                allFloorList.forEach(floor => {
                    const floorJson = this.eavWrapperService.eavToJson(floor, 'LEVEL');
                    if (floorJson !== null) {
                        this.floorDropdownList.push(floorJson);
                    }
                });
            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured while retriving area list', 'Ok', {
                //     duration: 5000,
                //     extraClasses: ['error-snackbar']
                //   });
            });
    }

    /**
     @Desc get all areas for drop down
     @Param
     @return
     */
    getAreaByFloor() {
        if (this.selectedFloorId === 0) {
            return;
        }
        this
            .masterDataService
            .getCampusDropdownList(`/rsb-oms/oms/getChildEntities?parentId=` + this.selectedFloorId + `&Accept-Language=` + this.appService.currentLang)
            .subscribe(res => {
                this.areaDropdownList.splice(0, this.areaDropdownList.length);
                const allAreaList = JSON.parse(res._body);
                allAreaList.forEach(area => {
                    const areaJson = this.eavWrapperService.eavToJson(area, 'AREA');
                    if (areaJson !== null) {
                        this.areaDropdownList.push(areaJson);
                    }
                });

            }, (error: any) => {
                // this
                //   .snackBar
                //   .open('Error occured while retriving area list', 'Ok', {
                //     duration: 5000,
                //     // extraClasses: ['error-snackbar']
                //   });
            });
    }


    public getAllSK() {
        this.skList.splice(0, this.skList.length);
        if(this.selectedAreaId==0){
            for(let area of this.areaDropdownList){
                this.selectedAreaId=area.id;
                this
                    .masterDataService
                    .getSklist(`/rsb-oms/oms/getPointsByAreaId?id=` + this.selectedAreaId)
                    .subscribe(res => {
                        this.selectedAreaId=0;
                        this.isLoading = false;
                        let allSK = JSON.parse(res._body);
                        console.log(allSK);
                        allSK.forEach(sk => {
                                if ((sk.deviceType == 'Kiosk' || sk.deviceType == 'Display')&&sk.devices!=null) {
                                    this.skList.push(sk);
                                }
                            }
                        )

                    }, (error: any) => {
                        // this
                        //   .snackBar
                        //   .open('Error occured while retriving', 'Ok', {
                        //     duration: 5000,
                        //     extraClasses: ['error-snackbar']
                        //   });
                    });
            }
        }else{
            this
                .masterDataService
                .getSklist(`/rsb-oms/oms/getPointsByAreaId?id=` + this.selectedAreaId)
                .subscribe(res => {
                    this.selectedAreaId=0;
                    this.isLoading = false;
                    let allSK = JSON.parse(res._body);
                    console.log(allSK);
                    allSK.forEach(sk => {
                            if (sk.deviceType == 'Kiosk' || sk.deviceType == 'Display') {
                                this.skList.push(sk);
                            }
                        }
                    )

                }, (error: any) => {
                    // this
                    //   .snackBar
                    //   .open('Error occured while retriving', 'Ok', {
                    //     duration: 5000,
                    //     extraClasses: ['error-snackbar']
                    //   });
                });
        }

    }


}
