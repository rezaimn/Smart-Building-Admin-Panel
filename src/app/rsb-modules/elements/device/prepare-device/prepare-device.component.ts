import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {CreateDevice, PrepareDevice} from '../device';
import {MasterDataService} from '../../../../utils';
import {DeviceService} from '../device.service';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';

@Component({selector: 'app-prepare-device', templateUrl: './prepare-device.component.html', styleUrls: ['./prepare-device.component.scss']})
export class PrepareDeviceComponent implements OnInit {
    public index: number;
    public mode: string;
    selectedFile;
    public subDeviceList: Array<any> = [];
    public brandList: Array<any> = [];
    public modelList: Array<any> = [];
    public serialList: Array<any> = [];
    public deviceList: Array<any> = [];
    public manageDevice: PrepareDevice = new PrepareDevice({});
    public formData = new FormData(); // Create a formdata variable to send the uploaded svg file
    public bulkUpload = false; // Maintaining a flag to show the transition and file name according to the file uploaded
    public fileName: string; // Variable to the file name of the uploaded file
    public createDevice: CreateDevice = new CreateDevice({});
    @SessionStorage('prepareDeviceOpenCount')
    public prepareDeviceOpenCount;
    public status = 1;
    public modelId = 0;
    public serialNum = 0;
    public brand_id = 0;
    public sub_type_id = 0;
    public type_id = 0;

    constructor(public localStorageService: LocalStorageService,
                public dialogRef: MatDialogRef<PrepareDeviceComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public masterDataService: MasterDataService,
                public deviceService: DeviceService,
                public appService: AppService,
                public translate: TranslateService) {
        this.mode = data.message;
        this.index = data.index;
        dialogRef.disableClose = true;
        if (this.mode == 'edit') {
            let deviceT = data.data;

            this.editDataFill(deviceT);
        }

    }

    ngOnInit() {
        if (this.mode != 'edit') {
            this.getDeviceType();
        }
    }

    ngOnDestroy() {
        this.prepareDeviceOpenCount = 0;
        this.localStorageService.store('addClicked', false);
    }


    /**
     @Desc get device type data
     @Param
     @return
     */
    editDataFill(deviceT) {
        this.createDevice.serialNum = deviceT.serial_no;
        this.createDevice.status = deviceT.device_status;
        this.status = deviceT.device_status;
        this.createDevice.deviceId = deviceT.device_id;
        this
            .masterDataService
            .getDeviceType(`/rsb-oms/oms/getAllDeviceType`)
            .subscribe((data) => {

                console.log('getAllDeviceType');
                this.deviceList = JSON.parse(data._body);
                this.type_id = parseInt(deviceT.type_id);
                for (let type of this.deviceList) {
                    if (type.id == this.type_id) {
                        this
                            .masterDataService
                            .getDeviceList(`/rsb-oms/oms/getSubDevicesByDeviceTypeId?id=`, type.id)
                            .subscribe((data) => {

                                console.log('getSubDevicesByDeviceTypeId');
                                this.subDeviceList = JSON.parse(data._body);
                                this.sub_type_id = parseInt(deviceT.sub_type_id);
                                for (let subType of this.subDeviceList) {
                                    if (subType.id == this.sub_type_id) {
                                        this
                                            .masterDataService
                                            .getDeviceList(`/rsb-oms/oms/getDeviceBrandsByDeviceSubTypeId?id=`, subType.id)
                                            .subscribe((data) => {

                                                console.log('getDeviceBrandsByDeviceSubTypeId');
                                                this.brandList = JSON.parse(data._body);
                                                this.brand_id = parseInt(deviceT.brand_id);
                                                for (let brand of this.brandList) {
                                                    if (brand.id == this.brand_id) {
                                                        this
                                                            .masterDataService
                                                            .getDeviceList(`/rsb-oms/oms/getDeviceModelByDeviceBrandId?id=`, brand.id)
                                                            .subscribe((data) => {
                                                                console.log('getDeviceModelByDeviceBrandId');
                                                                this.modelList = JSON.parse(data._body);
                                                                this.modelId = parseInt(deviceT.model_id);
                                                            }, (error) => {
                                                                console.log(error);
                                                            });
                                                    }
                                                }
                                            }, (error) => {
                                                console.log(error);
                                            });
                                    }
                                }
                            }, (error) => {
                                console.log(error);
                            });
                    }
                }
            }, (error) => {
                console.log(error);
            });
    }

    getDeviceType() {
        this
            .masterDataService
            .getDeviceType(`/rsb-oms/oms/getAllDeviceType`)
            .subscribe((data) => {
                this.deviceList = JSON.parse(data._body);
            }, (error) => {
                console.log(error);
            });
    }

    /**
     @Desc get sub device data
     @Param event
     @return
     */
    getSubDevice(data) {
        this
            .masterDataService
            .getDeviceList(`/rsb-oms/oms/getSubDevicesByDeviceTypeId?id=`, data)
            .subscribe((data) => {
                this.subDeviceList = JSON.parse(data._body);
            }, (error) => {
                console.log(error);
            });
    }

    /**
     @Desc get device brand
     @Param event
     @return
     */
    getBrand(data) {
        this
            .masterDataService
            .getDeviceList(`/rsb-oms/oms/getDeviceBrandsByDeviceSubTypeId?id=`, data)
            .subscribe((data) => {
                this.brandList = JSON.parse(data._body);
            }, (error) => {
                console.log(error);
            });
    }

    /**
     @Desc get device model
     @Param event
     @return
     */
    getModel(data) {
        this
            .masterDataService
            .getDeviceList(`/rsb-oms/oms/getDeviceModelByDeviceBrandId?id=`, data)
            .subscribe((data) => {
                this.modelList = JSON.parse(data._body);
            }, (error) => {
                console.log(error);
            });
    }

    /**
     @Desc get device serial
     @Param event
     @return
     */

    /**
     @Desc get device file details
     @Param event
     @return
     */


    onSubmit() {

    }

    loadFile(event) {
        this.formData = new FormData();
        const file = event.target.files[0];

        this.formData.append('file', file);
    }

    /**
     @Desc save or update device
     @Param
     @return
     */
    saveUpdateDevice() {
        if (this.bulkUpload) {
            this.deviceService.uploadFile('/rsb-oms/ems/device/upload', this.formData)
                .subscribe((data) => {
                    let errorData=JSON.parse(data._body);
                   // console.log(errorData);
                        this
                            .localStorageService
                            .store('addClicked', false);
                        this
                            .dialogRef
                            .close(errorData);
                    }
                )
        } else {
            let url;
            let mes = '';
            let deviceT = new CreateDevice({});
            deviceT.serialNum = this.createDevice.serialNum;
            deviceT.modelId = this.modelId;
            deviceT.status = this.status;
            deviceT.deviceId = this.createDevice.deviceId;
            if (this.mode == 'edit') {
                delete deviceT.brand_id;
                delete deviceT.sub_type_id;
                delete deviceT.type_id;
                delete deviceT.serialNum;
                delete deviceT.modelId;

                url = '/rsb-oms/ems/device/updateDeviceStatus';
                mes = 'updated';
            }
            else {

                url = '/rsb-oms/ems/device/createDevice';
                mes = 'added';
            }
            this.deviceService.saveDevice(url, deviceT)
                .subscribe((data) => {
                    this
                        .localStorageService
                        .store('addClicked', false);
                    this
                        .dialogRef
                        .close(null);
                }, (error) => {
                    // this
                    //   .snackBar
                    //   .open('Error occured while updating device', 'Ok', {
                    //     duration: 5000,
                    //     extraClasses: ['error-snackbar']
                    //   });
                });
        }

    }

    /**
     @Desc close modal
     @Param
     @return
     */
    closeModal() {
        this
            .localStorageService
            .store('addClicked', false);
        this.dialogRef.close();
        this.dialogRef = null;
    }
}
