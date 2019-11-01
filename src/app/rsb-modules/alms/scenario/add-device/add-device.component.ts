import {Device} from './../shared/device';
import {DeviceType} from './../../../organizations/area/area';
import {AppService} from './../../../../app.service';
import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    EventEmitter,
    Inject,
    OnInit,
    Output,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {DeviceConService} from '../device.service';
import {Router} from '@angular/router';
import * as moment from 'jalali-moment';
import {AddOutputdeviceComponent} from '../add-outputdevice/add-outputdevice/add-outputdevice.component'
import {DatePipe} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

declare var $: any;

@Component({
    selector: 'app-add-device',
    templateUrl: './add-device.component.html',
    styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent implements OnInit, AfterViewInit {

    @Output() OnUpdateList: EventEmitter<any> = new EventEmitter();
    @ViewChild('parent', {read: ViewContainerRef}) container: ViewContainerRef;
    @ViewChild(AddOutputdeviceComponent) child;
    public myDate: Date;
    public device: any = {};
    public devicetypes: DeviceType[];
    public now = moment();
    public model: Device;
    public name: any = '';
    public inputtype: any = [];
    public inputdevices: any = [];
    public inputdevice: any = '';
    public inputtypeid: any = '';
    public outputtype: any = [];
    public outputdevice: any = '';
    public outputdevices: any = [];
    public outputtypeid: any = '';
    public inputvalue: any = '';
    public weekday: any;
    public inputtextvalue: any = '';
    public showInputtext: boolean = false;
    public flag: number;
    public inputSelections: any = [{'id': 'Tripped', 'value': 'Tripped'}, {'id': 'Un Tripped', 'value': 'Un Tripped'}];
    public skStatus: any = [{'id': 'On', 'value': 'On'}, {'id': 'Off', 'value': 'Off'}, {'id': 'Play', 'value': 'Play'}];

    public inputHVACSelections: any = [{'id': '0', 'value': 'Auto'}, {'id': '1', 'value': 'Comfort'}, {
        'id': '2',
        'value': 'Precomfort'
    }, {'id': '3', 'value': 'Economy'}, {'id': '4', 'value': 'Protect'}];
    public frequency: any;
    public showweek: boolean;
    public showmonth: boolean;
    public frequencyDate: any = {
        'fromDate': '__/__/____'

    };
    public frequencyTime: any;
    public children1: any = [];

    constructor(public translate:TranslateService,
        private _cfr: ComponentFactoryResolver,
        public dialogRef: MatDialogRef<AddDeviceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private storage: LocalStorageService,
        private deviceService: DeviceConService,
        public appService: AppService,
        private sessionStorageService: SessionStorageService,
        private router: Router,
        private datePipe: DatePipe
    ) {
        this.device = data.device;
        this.model = new Device();
        dialogRef.disableClose = true;
    }

    ngAfterViewInit() {
        if (this.device) {
            this.frequency = this.device.frequency;
            if (this.frequency) {
                this.showday();
                if (this.showweek) {
                    this.weekday = this.device.executionday;
                }
                else if (this.showmonth) {
                    this.frequencyDate.fromDate = this.device.executionday;
                }
                this.frequencyTime = this.device.executiontime;
            }
            if (this.showInputtext == true) {
                this.flag = 1;
                if (this.device.sourcestate.length >= 2) {
                    this.inputtextvalue = this.device.sourcestate;
                }
                else
                    this.inputvalue = this.device.sourcestate;
            }
            else {
                this.inputvalue = this.device.sourcestate;
                this.flag = 0;
            }
        }
    }

    ngOnInit() {

        // this.sendHeader();
        try {
            if (!this.device) {
                this.getDeviceTypes();
                this.addComponent(null);

            }
            else {
                this.getDeviceTypes();
                this.name = this.device.name;
                this.inputtypeid = this.device.sourcedevicetypeid;

                //this.getDeviceTypes();
                this.getInputdevice();
                this.inputdevice = this.device.sourcedeviceid;

                if (this.frequency) {
                    this.showday();
                    if (this.showweek) {
                        this.weekday = this.device.executionday;
                    }
                    else if (this.showmonth) {
                        this.frequencyDate.fromDate = this.device.executionday;
                    }
                    this.frequencyTime = this.device.executiontime;
                }

                var childData = this.device.destinationdevices;
                for (let i = 0; i < childData.length; i++) {
                    var childDatai = childData[i];
                    if (childDatai)
                        this.addComponent(childDatai);
                }

            }
        } catch (ex) {
            console.log(ex);
        }

    }

    addComponent(data: any) {

        var comp = this._cfr.resolveComponentFactory(AddOutputdeviceComponent);
        var expComponent = this.container.createComponent(comp);

        if (data) {

            expComponent.instance.device = data;
            expComponent.instance.ngOnInit();
            expComponent.instance.ngOnInit();
            expComponent.instance.ngAfterViewInit();
        }
        expComponent.instance._ref = expComponent;


        this.children1.push(expComponent);

    }


    showday() {
        if (this.frequency === 'Weekly') {
            this.showweek = true;
            this.showmonth = false;

        }
        else if (this.frequency === 'Monthly') {
            this.showweek = false;
            this.showmonth = true;

        }
        else {
            this.showweek = false;
            this.showmonth = false;

        }
    }

    getDeviceTypes() {
        this
            .deviceService
            .getDevicetypes('/SP/GetSmartScenarioDeviceTypes')
            .subscribe(res => {
                if (res.status === 200) {
                    let items = JSON.parse(res._body);
                    this.inputtype = items;
                    var x = res._body

                    for (let i = 0; i < this.inputtype.length; i++) {
                        if (this.inputtype[i].id == this.inputtypeid) {
                            if (this.inputtype[i].name == 'Thermostat') {
                                this.showInputtext = true;
                                this.flag = 1;
                                if (this.device && this.device.sourcestate) {
                                    if (this.device.sourcestate.length >= 2) {
                                        this.inputtextvalue = this.device.sourcestate;
                                    } else
                                        this.inputvalue = this.device.sourcestate;
                                }
                            } else {
                                this.flag = 0;
                                this.showInputtext = false;
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


    getInputdevice() {
        for (let i = 0; i < this.inputtype.length; i++) {
            if (this.inputtype[i].id == this.inputtypeid) {
                if (this.inputtype[i].name == 'Thermostat') {
                    this.showInputtext = true;
                    // this.flag = 1;
                    if (this.device && this.device.sourcestate) {
                        if (this.device.sourcestate.length >= 2) {
                            this.inputtextvalue = this.device.sourcestate;

                        } else
                            this.inputvalue = this.device.sourcestate;
                    }


                } else {
                    // this.flag = 0;
                    this.showInputtext = false;
                }
            }
        }


        this
            .deviceService
            .getDevicetypes('/Common/GetDevices?devicetypeid=' + this.inputtypeid)
            .subscribe(res => {
                if (res.status === 200) {
                    let items = JSON.parse(res._body);
                    this.inputdevices = items;
                }
            }, (error: any) => {
                this.translate.get('error-messages.input-device-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );

            });
    }


    // addDeviceType() {
    //     let obj = {
    //         'devicetypeid': this.model.devicetypeid,
    //         'ontime': this.model.ontime,
    //         'offtime': this.model.offtime
    //     }
    //     this
    //         .deviceService
    //         .addDeviceType('/SP/InsertDeviceTypeSchedule', obj)
    //         .subscribe(res => {
    //             let x = res._body;
    //             //if (res.status === 200){// && res._body ===1) {
    //             if (x == 1) {
    //                 this.closeModal();
    //                 this
    //                     .snackBar
    //                     .open('Created Succesfully', 'Ok', {
    //                         duration: 5000,
    //                     });
    //             }
    //             //else if(res.status === 200 && res._body ===2){
    //             else if (x == 2) {
    //                 this.closeModal();
    //                 this
    //                     .snackBar
    //                     .open('Item already exist', 'Ok', {
    //                         duration: 5000,
    //                     });
    //
    //             }
    //         }, (error: any) => {
    //             this.translate.get('error-messages.device-type-delete-failed', this.appService.currentLang).subscribe(
    //                 (messageText) => {
    //                     this.appService.showFail(messageText);
    //                 }
    //             );
    //         });
    // }
    //
    // remove_duplicates(arr) {
    //     let obj = {};
    //     for (let i = 0; i < arr.length; i++) {
    //         obj[arr[i]] = true;
    //     }
    //     arr = [];
    //     for (let key in obj) {
    //         arr.push(key);
    //     }
    //     return arr;
    // }

    addscene() {
        //	console.log(this.datePipe.transform(this.frequencyDate.fromDate, 'dd'));
        var executionday;
        if (this.showweek) {
            executionday = this.weekday;
        }
        else if (this.showmonth) {
            executionday = this.frequencyDate.fromDate; //this.datePipe.transform(this.frequencyDate.fromDate, 'dd');
        }

        if (this.inputtextvalue)
            this.inputvalue = this.inputtextvalue;


        let outputdevices: any = [];
        let outputselected = false;


        for (let i = 0; i < this.children1.length; i++) {


            if (this.children1[i]) {
                if (this.children1[i].instance.removed) {
                    continue;
                }

                // if (this.children1[i].instance.outputtextvalue)
                // 	this.children1[i].instance.outputvalue = this.children1[i].instance.outputtextvalue;

                if (this.children1[i].instance.outputdevice && (this.children1[i].instance.outputvalue != '' || this.children1[i].instance.outputtextvalue != '')) {
                    outputselected = true;

                } else {
                    this.translate.get('error-messages.add-atleast-one-output-device', this.appService.currentLang).subscribe(
                        (messageText) => {
                            this.appService.showFail(messageText);
                        }
                    );
                    return;
                }
                let tempF = 0;
                //console.log("outputtextvalue:    "+this.children1[i].instance.outputtextvalue+"    outputvalue:   "+this.children1[i].instance.outputvalue);
                if (this.children1[i].instance.outputtextvalue != '' && this.children1[i].instance.outputvalue != '') {
                    tempF = 2;
                }
                if (this.children1[i].instance.outputtextvalue != '' && this.children1[i].instance.outputvalue == '') {
                    tempF = 0;
                }
                if (this.children1[i].instance.outputtextvalue == '' && this.children1[i].instance.outputvalue != '') {
                    tempF = 1;
                }
                let outputdevice;
                if (this.children1[i].instance.showOutputtext) {
                    outputdevice = {
                        'destinationdeviceid': this.children1[i].instance.outputdevice,
                        'destinationstate': this.children1[i].instance.outputtextvalue,
                        'destinationmode': this.children1[i].instance.outputvalue,
                        'flag': tempF,

                    };
                }else{
                    outputdevice = {
                        'destinationdeviceid': this.children1[i].instance.outputdevice,
                        'destinationstate': this.children1[i].instance.outputvalue,
                        'flag': null,

                    };
                }

                outputdevices.push(outputdevice);

            }
        }


        if (!outputselected) {
            this.translate.get('error-messages.add-atleast-one-output-device', this.appService.currentLang).subscribe(
                (messageText) => {
                    this.appService.showFail(messageText);
                }
            );
            return;
        }
        // console.log(outputdevices);
        // let filtereOutputs = this.remove_duplicates(outputdevices);
        // console.log(filtereOutputs);


        let obj;
        let url;
        if (this.device && this.device.coming) {
            if (this.device.coming == 'edit') {
                obj = {
                    'name': this.name,
                    'sourcedeviceid': this.inputdevice,
                    'sourcestate': this.inputvalue,
                    'destinationdevices': outputdevices,
                    'flag': this.flag,
                    'id': this.device.id,
                    'frequency': this.frequency,
                    'executiontime': this.frequencyTime,
                    'executionday': executionday
                };
                url = '/SP/UpdateSmartScenario';
            } else {
                obj = {
                    'name': this.name,
                    'sourcedeviceid': this.inputdevice,
                    'sourcestate': this.inputvalue,
                    'destinationdevices': outputdevices,
                    'flag': this.flag,
                    'frequency': this.frequency,
                    'executiontime': this.frequencyTime,
                    'executionday': executionday
                };
                url = '/SP/InsertSmartScenario';
            }

        } else {

            obj = {
                'name': this.name,
                'sourcedeviceid': this.inputdevice,
                'sourcestate': this.inputvalue,
                'destinationdevices': outputdevices,
                'flag': this.flag,
                'frequency': this.frequency,
                'executiontime': this.frequencyTime,
                'executionday': executionday
            };
            url = '/SP/InsertSmartScenario';

        }
        this
            .deviceService
            .addDeviceTypeFrequency(url, obj)
            .subscribe(res => {
                let x = res._body;
                //if (res.status === 200){// && res._body ===1) {
                if (url == '/SP/UpdateSmartScenario') {
                    if (x == 1) {
                        this.closeModal();
                        this.translate.get('error-messages.scenario-update-success', this.appService.currentLang).subscribe(
                            (messageText) => {
                                this.appService.showSuccess(messageText);
                            }
                        );
                    }
                    if (x == 0) {
                        this.translate.get('error-messages.scenario-update-failed', this.appService.currentLang).subscribe(
                            (messageText) => {
                                this.appService.showFail(messageText);
                            }
                        );

                    }
                    if (x >= 2) {
                        this.appService.generalExceptions(x);
                    }
                }

                if (url == '/SP/InsertSmartScenario') {
                    if (x == 1) {
                        this.closeModal();
                        this.translate.get('error-messages.scenario-add-success', this.appService.currentLang).subscribe(
                            (messageText) => {
                                this.appService.showSuccess(messageText);
                            }
                        );
                    }
                    if (x == 0) {
                        this.translate.get('error-messages.scenario-add-failed', this.appService.currentLang).subscribe(
                            (messageText) => {
                                this.appService.showFail(messageText);
                            }
                        );

                    }
                    if (x >= 2) {
                        this.appService.generalExceptions(x);
                    }

                }

            }, (error: any) => {
                if (url == '/SP/UpdateSmartScenario') {
                    this.translate.get('error-messages.scenario-update-failed', this.appService.currentLang).subscribe(
                        (messageText) => {
                            this.appService.showFail(messageText);
                        }
                    );
                }
                if (url == '/SP/InsertSmartScenario') {
                    this.translate.get('error-messages.scenario-add-failed', this.appService.currentLang).subscribe(
                        (messageText) => {
                            this.appService.showFail(messageText);
                        }
                    );
                }
            });
    }


    //openTimer(event : NgModel, id, data) {
    openTimer(id, field) {
        //let eve = event;
        let self = this;
        $('#' + id).mdtimepicker({
            timeFormat: 'hh:mm:ss',
            format: 'HH:mm tt',
            theme: 'blue',
            readOnly: false,
            hourPadding: false
        })
            .on('timechanged', function (e) {
                if (field == 'ontime') {
                    self.model.ontime = e.time;
                }

                if (field == 'offtime') {
                    self.model.offtime = e.time;
                }
            });
        ;
    }

    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }

}
