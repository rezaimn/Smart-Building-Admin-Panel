import {Device, Schedule} from './../shared/device';
import {AppService} from './../../../../app.service';
import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {DeviceConService} from '../device.service';
import {PolicyViewObject} from '../device';
import {Router} from '@angular/router';

import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';
import {LayoutComponent} from '../../../../common';

declare var $: any;

@Component({
    selector: 'app-add-device',
    templateUrl: './add-device.component.html',
    styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent implements OnInit {

    @Output() OnUpdateList: EventEmitter<any> = new EventEmitter();
    public devicetypes = [];
    public now = moment();
    public device: Device;
    public cardNumber: string;
    public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));
    public scrollbarOptions = {
        axis: 'y',
        theme: 'light-3',
        mouseWheel: {
            enable: true
        },
        contentTouchScroll: 200,
        scrollInertia: 0,
        mouseWheelPixels: 100
    };
    constructor(
        public dialogRef: MatDialogRef<AddDeviceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private storage: LocalStorageService,
        private deviceService: DeviceConService,
        public appService: AppService,
        private sessionStorageService: SessionStorageService,
        private router: Router,
        public translate: TranslateService
    ) {
        if (data.device != null) {
            this.device = data.device;
        } else {
            this.device = new Device();
        }


        //this.model.devicetypeid=1;
        dialogRef.disableClose = true;
    }

    ngOnInit() {
        this.getDeviceTypes();
        // this.sendHeader();
    }

    /**
     @Desc Send message to subscribers via observable subject
     @Param
     @return
     */
    sendHeader(): void {
        //

        this
            .appService
            .sendHeader('header', 'homs management', 'hello', '');

    }

    ngAfterViewInit() {
    }

    /**
     @Desc get device types to fill drop down list
     @Param
     @return
     */
    getDeviceTypes() {
        this
            .deviceService
            .getDevicetypes('/SP/GetSettingsDeviceTypes')
            .subscribe(res => {
                if (res.status === 200) {
                    let items = JSON.parse(res._body);
                    for (let device of items) {
                        if (device.code == 'SPD' || device.code == 'LTN' || device.code == 'TRM') {
                            this.devicetypes.push(device);
                        }
                    }
                }
            }, (error: any) => {
                this.translate.get('error-messages.device-type-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            });
    }

    /**
     @Desc add a new device type
     @Param
     @return
     */
    addUpdateSchedule(schedule) {
        let deviceSchedule = {
            id: schedule.id,
            deviceTypeId: this.device.deviceType.id,
            onTime: schedule.onTime+':00',
            offTime: schedule.offTime+':00',
            edgeId: 1
        }
        if(schedule.id==0){
            delete deviceSchedule.id;
        }
        this
            .deviceService
            .addDeviceType('/rsb-iot/device/schedule/', deviceSchedule)
            .subscribe(res => {
                let x = JSON.parse(res._body);
                schedule.id=x;

            }, (error: any) => {
                this.translate.get('error-messages.device-type-add-failed', this.appService.currentLang).subscribe(
                    (messageText) => {
                        this.appService.showFail(messageText);
                    }
                );

            });
    }

    /**
     @Desc add a new device type frequency
     @Param
     @return
     */
    addNewSchedule(){
        let schedule:Schedule=new Schedule({});
        this.device.schedules.push(schedule);
    }

    /**
     @Desc open modal to delete device
     @Param device object
     @return
     */
    deleteSchedule(scheduleId,index) {
        console.log(scheduleId);
            if(scheduleId!=0){
                return this
                    .deviceService
                    .deleteDeviceSchedule("/rsb-iot/device/schedule/"+scheduleId)
                    .subscribe(res => {
                        this.device.schedules.splice(index,1);
                        //this.closeModal();
                        this.translate.get('error-messages.device-type-delete-success', this.appService.currentLang).subscribe(
                            (messageText) => {
                                this.appService.showSuccess(messageText);
                            }
                        );


                        this
                            .dialogRef
                            .close(true);

                    }, (error: any) => {
                        this
                            .dialogRef
                            .close(false);
                        this.translate.get('error-messages.device-type-delete-failed', this.appService.currentLang).subscribe(
                            (messageText) => {
                                this.appService.showFail(messageText);
                            }
                        );

                    });
            }else{
                this.device.schedules.splice(index,1);
            }


    }
    /**
     @Desc close modal
     @Param
     @return
     */
    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }

}
