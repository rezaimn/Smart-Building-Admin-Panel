import {AppService} from './../../../../app.service';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {HvacService} from '../hvac.service';
import {HvacVehicle, PolicyViewObject} from '../hvac';
import {Router} from '@angular/router';

import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-view-hvac',
    templateUrl: './view-hvac.component.html',
    styleUrls: ['./view-hvac.component.scss']
})
export class ViewHvacComponent implements OnInit {

    public hvac: any =null;
    public index: any;
    public point: any = '';
    public selectedMode: any = '';

    public mode: any;
    public vehicles: HvacVehicle[] = [];
    public hvacData: any;
    public now = moment();

    public cardNumber: string;
    public policyObject: PolicyViewObject = new PolicyViewObject({}, this.now.format('YYYY-MM-DD'));

    constructor(public translate: TranslateService,
                public dialogRef: MatDialogRef<ViewHvacComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private storage: LocalStorageService,
                private hvacService: HvacService,
                public appService: AppService,
                private sessionStorageService: SessionStorageService,
                private router: Router) {
        if(data.hvac!=null){
            this.hvac = data.hvac;
            this.getHVACDeviceData(this.hvac.serialnumber);
        }

        dialogRef.disableClose = true;
    }

    ngOnInit() {


        // this.sendHeader();
    }

    sendHeader(): void {
        // Send message to subscribers via observable subject

        this
            .appService
            .sendHeader('header', 'sems management', 'hello', '');

    }

    ngAfterViewInit() {
    }

    getHVACDeviceData(serialnumber) {
        this.hvacService.getHVACDeviceData(serialnumber).subscribe((res) => {
            this.hvacData = JSON.parse(res._body);
            console.log(this.hvacData);
            this.point = this.hvacData.comforrtsetpoint;
            this.selectedMode = this.hvacData.mode||0;
        }, (err) => {

        });

    }

    closeModal(state) {
        this
            .dialogRef
            .close(state);
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }

    //backenddeviceid chnaged to serialnumber
    execute() {
        let setHvac;
        if(this.hvac!=null){
            setHvac = {
                operationType: 3,
                endPointUniqueId: this.hvac.deviceid,
                expectedValue: this.point,
                state: this.selectedMode
            };
        }else{
            setHvac = {
                type:'TRM',
                operationType: 3,
                endPointUniqueId: null,
                expectedValue: this.point,
                state: this.selectedMode
            };
        }


        this.hvacService
            .setHvac('device/command', setHvac)
            .subscribe(data => {
                },
                (error) => {

                }
            );
        if(this.hvac!=null) {
            this.closeModal(true);
        }else{
            this.closeModal(false);
        }


    }
}
