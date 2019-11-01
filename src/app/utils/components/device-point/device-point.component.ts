import {Component, Input, OnInit} from '@angular/core';
import {MasterDataService} from './../../services';
import {CreateConfig, DeviceType} from './deviceType';
import {SessionStorageService} from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../../app.service';
import {MatDialog} from '@angular/material';
import {SelectRegionComponent} from '../select-region/select-region.component';

@Component({
    selector: 'app-device-point',
    templateUrl: './device-point.component.html',
    styleUrls: ['./device-point.component.scss']
})
export class DevicePointComponent implements OnInit {
    @Input() deviceData;
    public subDeviceList: Array<any> = [];
    public brandList: Array<any> = [];
    public applianceList: Array<any> = [];
    public modelList: Array<any> = [];
    public serialList: Array<any> = [];
    public createConfig: CreateConfig = new CreateConfig();
    public devicePoint: DeviceType = new DeviceType();
    public formData = new FormData(); // Create a formdata variable to send the uploaded svg file
    public fileUploaded = false; // Maintaining a flag to show the transition and file name according to the file uploaded
    public fileName: string; // Variable to the file name of the uploaded file
    public deviceList: Array<any> = [];
    public configData: Array<any> = [];

    constructor(public translate: TranslateService,
                public masterDataService: MasterDataService,
                public sessionStorageService: SessionStorageService,
                public appService: AppService,
                public dialog: MatDialog,
    ) {

    }

    closeButton() {
        this.sessionStorageService.store('deviceSliderclicked', false);
    }

    ngOnInit() {

        this.getDeviceType();
        this.getConfigData();
        console.log(this.deviceData, 'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
        if (this.deviceData.deviceType == 'Smart Plug') {

        }
        this.getApplianceType();
    }

    getConfigData() {

        this.masterDataService.getDeviceType(`/rsb-oms/oms/getDevicesByPointId?pointId=` + this.deviceData.deviceId)
            .subscribe((data) => {
                this.configData = JSON.parse(data._body);
                console.log("rrrrrrrrrrrrrrrrrrrrr",this.configData);
                if (this.configData.length > 0) {
                    this.devicePoint.deviceId = this.configData[0].deviceName;
                    this.getSubDevice(this.configData[0].type_id);
                    this.getBrand(this.configData[0].sub_type_id);
                    this.getModel(this.configData[0].brand_id);
                    this.getSerial(this.configData[0].model_id);
                    this.devicePoint.deviceModel = parseInt(this.configData[0].model_id);
                    this.devicePoint.deviceBrand = parseInt(this.configData[0].brand_id);
                    this.devicePoint.deviceSubType = parseInt(this.configData[0].sub_type_id);
                    this.createConfig.appliance.id = parseInt(this.deviceData.applianceId);
                    this.createConfig.id = parseInt(this.configData[0].serial_id);
                    this.createConfig.installationLabel = this.configData[0].installation_label;
                    this.createConfig.ipAddress = this.configData[0].ip_address;
                    this.createConfig.backeEndDeviceId = this.configData[0].backend_device_id;
                    this.createConfig.deviceName = this.configData[0].device_name;
                    console.log(this.createConfig);
                }
                else {
                    this.devicePoint.deviceModel =0;
                    this.devicePoint.deviceBrand = 0;
                    this.devicePoint.deviceSubType = 0;
                    this.createConfig.appliance.id = 0;
                    this.createConfig.id = 0;
                    this.createConfig.installationLabel = '';
                    this.createConfig.ipAddress = '';
                    this.createConfig.backeEndDeviceId = '';
                    this.createConfig.deviceName = '';
                }
                if (this.deviceData.point.deviceType == 'Camera' && this.createConfig.installationLabel == '') {
                    this.createConfig.installationLabel = '0,0,0,0';
                }
            }, (error) => {
                console.log(error);
            });
    }

    getApplianceType() {
        this
            .masterDataService
            .getApplianceTypes(`/rsb-oms/oms/applianceType/all`)
            .subscribe((data) => {
                this.applianceList = JSON.parse(data._body);
                this.getDeviceId();
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
                this.getDeviceId();
            }, (error) => {
                console.log(error);
            });
    }

    getDeviceId() {
        this.deviceList.forEach(element => {
            if (element.name == this.deviceData.point.deviceType) {
                this.getSubDevice(element.id);
            }
        });
    }

    getSubDevice(data) {
        this.masterDataService.getDeviceList(`/rsb-oms/oms/getSubDevicesByDeviceTypeId?id=`, data)
            .subscribe((data) => {
                this.subDeviceList = JSON.parse(data._body);
            }, (error) => {
                console.log(error);
            });
    }

    getBrand(data) {
        this.masterDataService.getDeviceList(`/rsb-oms/oms/getDeviceBrandsByDeviceSubTypeId?id=`, data)
            .subscribe((data) => {
                this.brandList = JSON.parse(data._body);
            }, (error) => {
                console.log(error);
            });
    }

    getModel(data) {
        this.masterDataService.getDeviceList(`/rsb-oms/oms/getDeviceModelByDeviceBrandId?id=`, data)
            .subscribe((data) => {
                this.modelList = JSON.parse(data._body);
            }, (error) => {
                console.log(error);
            });
    }

    getSerial(data) {
        this.masterDataService.getDeviceList(`/rsb-oms/oms/getDeviceSerialByModelId?id=`, data)
            .subscribe((data) => {
                this.serialList = (JSON.parse(data._body)) ? JSON.parse(data._body) : [];
            }, (error) => {
                console.log(error);
            });
    }

    onSubmit(data, devicePointForm) {
        delete this.deviceData.point.coordinate;
        delete this.deviceData.point.deviceCode;
        delete this.deviceData.point.deviceColor;
        delete this.deviceData.point.deviceType;
        this.createConfig.points = this.deviceData.point;
        if(this.deviceData.point.deviceType!='Smart Plug'){
            delete this.createConfig.appliance;
        }
        this.masterDataService.saveData(`/rsb-oms/oms/installDevice`, this.createConfig).subscribe(res => {

                this.sessionStorageService.store('deviceSliderclicked', false);
                this.closeButton();
            },
            (error: any) => {

            }
        );
    }

    selectRegion(ip) {
        let data = {
            'installationL': this.createConfig.installationLabel
        };

        const dialogRef = this
            .dialog
            .open(SelectRegionComponent, {
                width: '820px',
                height: 'auto',
                data: data,
                hasBackdrop: true
            });

        dialogRef
            .afterClosed()
            .subscribe(result => {
                this.createConfig.installationLabel = result;
            });

    }

}
