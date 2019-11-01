import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {LayoutComponent} from '../../../../common';
import {PrepareDeviceComponent} from '../prepare-device/prepare-device.component'
import {DeleteDeviceComponent} from '../delete-device/delete-device.component'
import {AppService} from '../../../../app.service';
import {DeviceService} from '../device.service';
import {CreateDevice, FilterComponent, ManageDevice} from '../device';
import {TranslateService} from '@ngx-translate/core';
import {PaginationService} from '../../../../pagination-service';
import {ErrorTableComponent} from '../error-table/error-table.component';

declare var Hammer: any;

@Component({
    selector: 'app-manage-device',
    templateUrl: './manage-device.component.html',
    styleUrls: ['./manage-device.component.scss']
})
export class ManageDeviceComponent implements OnInit {
    public manageDeviceList: ManageDevice[];
    public getDevice: any = new FilterComponent({});
    public addClicked = false; // Flag for add/edit to manage navigation
    public startPoint: number = 0;
    public size: number = 5;
    public totalPages: number;
    public currentPage=0;

    public scrollbarOptions = {

        axis: 'y',
        theme: 'minimal-dark',
        mouseWheel: {
            enable: true
        },

        contentTouchScroll: 200,
        scrollInertia: 0,
        mouseWheelPixels: 100
    };
    @SessionStorage('subsidiary')
    public subsidiary;
    @SessionStorage('filterData')
    public filter;
    @SessionStorage('subdiaryId')
    public subdiaryId;
    @SessionStorage('DeviceLength')
    public deviceLength;
    @SessionStorage('addDeviceErrors')
    public addBulkDeviceErrors;

    @SessionStorage('prepareDeviceOpenCount')
    public prepareDeviceOpenCount;

    constructor(
        public dialog: MatDialog,
        public appService: AppService,
        public layoutComponent: LayoutComponent,
        private storage: LocalStorageService,
        public activatedRoute: Router,
        private deviceService: DeviceService,
        public translate: TranslateService,
        private paginationService: PaginationService
    ) {

    }

    ngOnInit() {
        this.getDevice.endLimit=this.size;
        this.totalPages=Math.round(this.deviceLength/this.size);
        console.log("tttttttttttttttttttttt",this.totalPages);
        console.log("ffffffffffffff",this.deviceLength/this.size);
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );
        this.getDevice = this.filter;
        this.getFilterDevice();
        this.currentPage=1;
        this.prepareDeviceOpenCount = 0;
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.storage.observe('addClicked').subscribe((clickedRes) => {

            if (clickedRes && (this.prepareDeviceOpenCount === 0 || this.prepareDeviceOpenCount === null) && this.activatedRoute.url === '/rsb-modules/elements/device/ems-devices/manage') {
                if (this.prepareDeviceOpenCount === null) {
                    this.prepareDeviceOpenCount = 0;
                } else {
                    this.prepareDeviceOpenCount++;
                }

                let prepareDeviceData = {
                    'message': 'new',
                    'index': 1,
                    'data': new CreateDevice({})
                };

                $('.page-wrapper').addClass('blur-bg');
                let dialogRef = this
                    .dialog
                    .open(PrepareDeviceComponent, {
                        width: '768px',
                        height: 'auto',
                        data: prepareDeviceData
                    });
                dialogRef
                    .afterClosed()
                    .subscribe(result => {

                        $('.page-wrapper').removeClass('blur-bg');
                        this
                            .storage
                            .store('addClicked', false);
                        if (result) {
                            this.getAllDevice();
                            this.prepareDeviceOpenCount = 0;
                        } else {
                            this.prepareDeviceOpenCount = 0;
                        }
                        this.getAllDevice();
                    });
            }
        });
    }
    // sendHeader(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.subsidiary !== null) {
    //     this
    //       .appService
    //       .sendHeader(this.subsidiary.name, 'element management', 'manage device', 'add device');
    //   }
    // }
    /**
     @Desc set header logo
     @Param
     @return
     */
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        if (this.subsidiary !== null) {
            let subHeader = '';
            let pageDetails = '';
            let subsidiaryName: '';
            if (this.appService.currentLang == 'en') {
                subsidiaryName = this.subsidiary.name.map.en;
            }
            if (this.appService.currentLang == 'fa') {
                subsidiaryName = this.subsidiary.name.map.fa;
            }
            let routeName = '';
            this.translate.get('sub-header.element-management', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.manage-device', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;

                            this.translate.get('route-name.add-device', this.appService.currentLang).subscribe(
                                (routeNameT) => {
                                    routeName = routeNameT;
                                    this
                                        .appService
                                        .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/INDOOR-SURVEILLANCE-SYSTEM.png');
                                }
                            )

                        }
                    );
                }
            );
        }
    }

    /**
     @Desc show dialog to edit selected device
     @Param
     @return
     */
    editDevice(index, mode, data) {

        let prepareDeviceData = {
            'message': mode,
            'index': index,
            'data': data
        };

        $('.page-wrapper').addClass('blur-bg');
        let dialogRef = this
            .dialog
            .open(PrepareDeviceComponent, {
                width: '768px',
                height: 'auto',
                data: prepareDeviceData
            });
        dialogRef
            .afterClosed()
            .subscribe(errorData => {

                $('.page-wrapper').removeClass('blur-bg');
                this
                    .storage
                    .store('addClicked', false);

                this.getFilterDevice();
            });
    }

    /**
     @Desc show dialog to delete selected device
     @Param
     @return
     */
    deleteDevice(id, count) {
        let obj, url, deleteDevice;
        if (count > 1) {
            obj = {
                'ids': []
            }

            obj.ids.push(parseInt(id));

            url = '/rsb-oms/oms/deleteMultipleDevices';

            deleteDevice = {
                id: obj,
                count: obj.ids.length,
                url: url
            }
        }
        else if (count == 1) {
            obj = id;
            url = '/rsb-oms/oms/deleteDevice?id=';
            deleteDevice = {
                id: obj,
                count: 1,
                url: url
            }
        }

        $('.page-wrapper').addClass('blur-bg');
        let dialogRef = this
            .dialog
            .open(DeleteDeviceComponent, {
                width: '640px',
                height: 'auto',
                data: deleteDevice
            });
        dialogRef
            .afterClosed()
            .subscribe(result => {
                $('.page-wrapper').removeClass('blur-bg');
                if (result) {
                    this.getFilterDevice();
                }
                this.getFilterDevice();
            });
    }

    /**
     @Desc get all devices list
     @Param
     @return
     */
    getAllDevice() {

        this.manageDeviceList = [];
        this
            .deviceService
            .getDeviceList(`/rsb-oms/oms/getAllDevices`)
            .subscribe((res) => {
                this.manageDeviceList = JSON.parse(res._body);
                // console.log('allllllllllll:   ', this.manageDeviceList);
            }, (error) => {
                // this
                //   .snackBar
                //   .open('error in getting data', '', { duration: 2000 });
            });
    }

    /**
     @Desc get all device using filter for search
     @Param
     @return
     */
    getFilterDevice() {

        let filterData = Object.assign({}, this.getDevice);
        delete filterData.inUse;
        delete filterData.faulty;
        delete filterData.inService;
        delete filterData.notInUse;
        delete filterData.outOfService;
        this.manageDeviceList = [];
        console.log('ggggggggggggggggggggg', filterData);
        this.deviceService.saveDevice(`/rsb-oms/oms/getDevicesBySearch`, filterData).subscribe((res) => {
            this.manageDeviceList = JSON.parse(res._body);
        }, (error) => {
            // this.snackBar.open('error in getting data', '', { duration: 2000 });
        });
    }






    /**
     @Desc set sub header links
     @Param
     @return
     */
    updateBreadCrums() {
        this
            .appService
            .updateBreadCrums('EMS-SUBSIDIARY-IP');
    }

    getPreviousList() {
        this.deviceLength = parseInt(this.deviceLength);
        if(this.startPoint>0){
            if (this.startPoint - this.size >0) {
                this.getDevice.startLimit = this.startPoint - this.size;
                this.startPoint = this.startPoint - this.size;
                this.currentPage=Math.round(this.startPoint/this.size)+1;
                this.getFilterDevice();
            }

            // else {
            //     if (this.startPoint != this.deviceLength) {
            //         this.getDevice.startLimit = this.startPoint + (this.deviceLength % this.endPoint);
            //         this.startPoint = this.startPoint + (this.deviceLength % this.endPoint);
            //         this.getFilterDevice();
            //     }
            // }
        }

    }

    getNextList() {
        this.deviceLength = parseInt(this.deviceLength);
        if (this.startPoint + this.size < this.deviceLength) {
            this.getDevice.startLimit = this.startPoint + this.size;
            this.startPoint = this.startPoint + this.size;
            this.currentPage=Math.round(this.startPoint/this.size)+1;
            this.getFilterDevice();
        }
        else {
            if (this.currentPage!=Math.round(this.deviceLength/this.size)) {
                this.getDevice.startLimit = this.startPoint + (this.deviceLength % this.size);
                this.startPoint = this.startPoint + (this.deviceLength % this.size);
                this.currentPage=Math.round(this.startPoint/this.size)+1;
                this.getFilterDevice();
            }
        }
    }
    getFirstList(){
        this.currentPage=1;
        this.startPoint=0;
        this.getDevice.startLimit=0;
        this.getFilterDevice();
    }
    getLastList(){
        let balance=0;
        if(this.deviceLength%this.size==0){
            balance=1;
        }
        this.currentPage=Math.round(this.deviceLength/this.size);
        this.startPoint=(Math.floor(this.deviceLength/this.size)-balance)*5;
        this.getDevice.startLimit=(Math.floor(this.deviceLength/this.size)-balance)*5;
        this.getFilterDevice();
    }
}
