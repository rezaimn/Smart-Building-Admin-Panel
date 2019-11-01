
import { Device } from './../../shared/device';
import { DeviceType } from './../../../../organizations/area/area';
import { AppService } from './../../../../../app.service';
import { Component, OnInit, Inject, Input, Output, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { DeviceConService } from '../../device.service';
import { PersonalInfo, EmployementDetails, EmergencyVehicle, PolicyViewObject } from '../../device';
import { Router } from '@angular/router';
import * as moment from 'jalali-moment';
import { NgModel } from '@angular/forms';
import { Subject } from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
declare var $: any;
@Component({
	selector: 'app-add-outputdevice',
	templateUrl: './add-outputdevice.component.html',
	styleUrls: ['./add-outputdevice.component.scss']
})
export class AddOutputdeviceComponent implements OnInit {

	@Output() OnUpdateList: EventEmitter<any> = new EventEmitter();
	_ref: any;
	public removed: boolean = false;

	// Subject instead of an EventEmitter
	lowerIndex: Subject<boolean> = new Subject();
	public device: any = {};
	public devicetypes: DeviceType[];
	public now = moment();
	public model: Device;
	public name: any = "";
	public outputtype: any = [parent];
	public outputdevice: any = '';
	public outputdevices: any = [];
	public outputtypeid: any = "";
	public outputtextvalue: any = "";
	public outputvalue: any ;
	public showOutputtext: boolean = false;
	public flag: number = 0;
	public inputSelections: any = [{ "id": "Tripped", "value": "Tripped" }, { "id": "Un Tripped", "value": "Un Tripped" }];
    public skStatus: any = [{'id': 'On', 'value': 'On'}, {'id': 'Off', 'value': 'Off'}, {'id': 'Play', 'value': 'Play'}];
	public inputHVACSelections: any = [];


	public outputSelections: any = [];

	constructor(public translate:TranslateService,
		public dialogRef: MatDialogRef<AddOutputdeviceComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private storage: LocalStorageService,
		private deviceService: DeviceConService,
		public appService: AppService,
		private sessionStorageService: SessionStorageService,
		private router: Router,
	) {
		this.device = data.device;
		this.model = new Device();
        dialogRef.disableClose = true;
	}

	ngAfterViewInit() {

		if (this.device) {
			if (this.showOutputtext == true) {
				// this.flag = 1;
				if (this.device.destinationstate.length >= 2) {
					this.outputtextvalue = this.device.destinationstate;
				}
				else
					this.outputvalue = this.device.destinationstate;

			}
			else {
				// this.flag = 0;
				this.outputvalue = this.device.destinationstate;
			}
		}
	}

	ngOnInit() {
		try {
			if (!this.device) {
				this.getODeviceTypes();
			}
			else {
				this.name = this.device.name;

				this.outputtypeid = this.device.destinationdevicetypeid;
				this.getODeviceTypes();
				this.getOutputdevice();
				this.outputdevice = this.device.destinationdeviceid;
                this.getHVACModes();
			}
		} catch (ex) {
			console.log(ex);
		}

	}
	removeObject() {
		this.removed = true;
		this.lowerIndex.next(true);
		this._ref.destroy();

	}


	getHVACModes(){
        this
            .deviceService
            .getDevicetypes("/SEMS/GetHVACModes")
            .subscribe(res => {
                if (res.status === 200) {
                    this.inputHVACSelections = JSON.parse(res._body);
                }
            }
			);
	}
	getODeviceTypes() {
		this
			.deviceService
			.getDevicetypes("/SP/GetSmartScenarioDeviceTypes")
			.subscribe(res => {
				if (res.status === 200) {
					let items = JSON.parse(res._body);
					this.outputtype = items;

					for (let i = 0; i < this.outputtype.length; i++) {
						if (this.outputtype[i].id == this.outputtypeid) {
							if (this.outputtype[i].name == "Thermostat") {
								this.showOutputtext = true;
								// this.flag = 1;
								if (this.device && this.device.destinationstate) {
									if (this.device.destinationstate.length >= 2) {
										this.outputtextvalue = this.device.destinationstate;
									} else
										this.outputvalue = this.device.destinationstate;
								}

							} else {
								this.showOutputtext = false;
								// this.flag = 0;
							}
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
	getOutputdevice() {
		for (let i = 0; i < this.outputtype.length; i++) {
			if (this.outputtype[i].id == this.outputtypeid) {
				if (this.outputtype[i].name == "Thermostat") {
					this.showOutputtext = true;
                    this.getHVACModes();
					// this.flag = 1;
					if (this.device && this.device.destinationstate) {
						if (this.device.destinationstate.length >= 2) {
							this.outputtextvalue = this.device.destinationstate;
						} else
							this.outputvalue = this.device.destinationstate;
					}

				} else {
					// this.flag = 0;
					this.showOutputtext = false;
				}
			}
		}
		if (!this.outputtypeid) {
			return;
		}
		this
			.deviceService
			.getDevicetypes("/Common/GetDevices?devicetypeid=" + this.outputtypeid)
			.subscribe(res => {
				if (res.status === 200) {
					let items = JSON.parse(res._body);
					this.outputdevices = items;
				}
			}, (error: any) => {
                this.translate.get('error-messages.output-device-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );

            });
	}
}
