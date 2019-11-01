import {AppService} from './../../../../app.service';
import {Component, Inject, OnInit} from '@angular/core';
import {NgModel} from '@angular/forms';
import {Http} from '@angular/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {WorkPolicyService} from '../work-policy.service';
import {WorkTime} from '../work-time';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {shiftType} from '../work-policy';

declare let $: any;

@Component({
    selector: 'app-add-work',
    templateUrl: './add-work.component.html',
    styleUrls: ['./add-work.component.scss']
})
export class AddWorkComponent implements OnInit {

    @SessionStorage('workTime')
    public workTimePolicyTemp: Array<any>;
    public workTime: WorkTime = new WorkTime({});

    @SessionStorage('designation')
    public designation;

    @SessionStorage('subsidiary')
    public subsidiary;
    public shiftTypes:shiftType[]=[];
    public isUpdate: boolean;
    public wrongWorkTime: boolean;
    public wrongMealTime: boolean;
    public dayList = [
        {'value': '1', 'name': 'Saturday', 'faName': 'شنبه'},
        {'value': '2', 'name': 'Sunday', 'faName': 'یکشنبه'},
        {'value': '3', 'name': 'Monday', 'faName': 'دوشنبه'},
        {'value': '4', 'name': 'Tuesday', 'faName': 'سه شنبه'},
        {'value': '5', 'name': 'Wednesday', 'faName': 'چهارشنبه'},
        {'value': '6', 'name': 'Thursday', 'faName': 'پنجشنبه'},
        {'value': '7', 'name': 'Friday', 'faName': 'جمعه'}

    ];

    public day: any = [];
    public days: any = [];
    public selectedShift: any;
    public dayslist: any;
    public selectedType: any = 'any';
    public isselectedType: Boolean;
    public policyvalidate: Boolean;
    public index: number;
    public policyList = [];


    constructor(
        public dialogRef: MatDialogRef<AddWorkComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private storage: LocalStorageService,
        public appService: AppService,
        private sessionStorageService: SessionStorageService,
        private workPolicyService: WorkPolicyService,
        public translate: TranslateService,
        private http: Http,
        private router: Router) {
        dialogRef.disableClose = true;
        if (data.policy) {
            this.workTime.id = data.policy.id
            this.workTime.policyName = data.policy.name;
            this.workTime.shifttype = data.policy.shifttype.id;
            this.workTime.mealStartTime = data.policy.mealtime.starttime;
            this.workTime.mealEndTime = data.policy.mealtime.endtime;
            this.selectedType = data.type;
            this.policyvalidate = true;
            let listdays = data.policy.day;
            for (let i = 0; i < listdays.length; i++) {
                this.days.push({
                    'id': listdays[i].id,
                    'dayfrom': listdays[i].dayfrom,
                    'dayto': listdays[i].dayto,
                    'time': {
                        'starttime': listdays[i].time.starttime,
                        'endtime': listdays[i].time.endtime
                    }
                });
            }
            console.log(this.days)
        }
    }

    ngOnInit() {
        this.getShiftTypes();
        this.selectType();
    }

    selectType() {
        if (this.selectedType == 'update') {
            this.isselectedType = true;
        }
        else {
            this.isselectedType = false;
        }
    }

    getDayTime(day) {
        this.policyvalidate = false;
        this.workTime.dayfrom = day.dayfrom;
        this.workTime.dayto = day.dayto;
        this.workTime.workStartTime = day.time.starttime;
        this.workTime.workEndTime = day.time.endtime;
        this.index = day.id;
    }

    getShiftTypes() {
        this
            .workPolicyService
            .getShiftType('/AMS/GetShiftTypes?Accept-Language='+this.appService.currentLang)
            .subscribe(res => {
                if (res.status === 200) {
                    this.shiftTypes = JSON.parse(res._body);
                }
            }, (error: any) => {
                this.translate.get('error-messages.no-shift-type-available', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showSuccess(subHeaderT);
                    }
                );

            });
    }

    updatePolicy(item) {
        if (this.selectedType == 'update') {
            this.isselectedType = true;
            let obj = {
                'id': item.id,
                'name': item.policyName,
                'shifttype': {'id': Number(item.shifttype)},
                'day': this.days,
                'mealtime': {'starttime': item.mealStartTime, 'endtime': item.mealEndTime}
            }
            this
                .workPolicyService
                .updatePolicy('/AMS/UpdateWorkPolicy', obj)
                .subscribe(res => {
                    if (res._body == 1) {
                        this.translate.get('error-messages.work-policy-updated-success', this.appService.currentLang).subscribe(
                            (subHeaderT) => {
                                this.appService.showSuccess(subHeaderT);
                            }
                        );

                        this.closeModal();
                    }
                    if (res._body == 0) {
                        this.translate.get('error-messages.work-policy-failed-to-update', this.appService.currentLang).subscribe(
                            (subHeaderT) => {
                                this.appService.showFail(subHeaderT);
                            }
                        )

                    }
                    if (res._body >= 2) {
                        this.appService.generalExceptions(res._body);
                    }
                }, (error: any) => {
                    this.translate.get('error-messages.work-policy-failed-to-update', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    )
                })
        } else {
            this.isselectedType = false;
            let obj = {
                'subsidiaryid': this.subsidiary.id,
                'name': item.policyName,
                'shifttype': {'id': Number(item.shifttype)},
                'day': this.days,
                'mealtime': {'starttime': item.mealStartTime, 'endtime': item.mealEndTime}
            }
            this.workPolicyService.addPolicy('/AMS/InsertWorkPolicy', obj)
                .subscribe(res => {
                    if (res._body == 1) {
                        this.translate.get('error-messages.work-policy-updated-success', this.appService.currentLang).subscribe(
                            (subHeaderT) => {
                                this.appService.showSuccess(subHeaderT);
                            }
                        );

                        this.closeModal();
                    }
                    if (res._body == 0) {
                        this.translate.get('error-messages.work-policy-failed-to-create', this.appService.currentLang).subscribe(
                            (subHeaderT) => {
                                this.appService.showFail(subHeaderT);
                            }
                        )
                    }
                    if (res._body >= 2) {
                        this.appService.generalExceptions(res._body);
                    }
                }, (error: any) => {
                    this.translate.get('error-messages.work-policy-failed-to-create', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    )
                })
        }

    }

    addTime(item) {
        if (this.days.length < 2) {
            this.days.push({
                'dayfrom': item.dayfrom,
                'dayto': item.dayto,
                'time': {
                    'starttime': item.workStartTime,
                    'endtime': item.workEndTime
                }
            });
        }
        else {
            this.translate.get('error-messages.you-can-not-add-more-than-two-days', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    this.appService.showFail(subHeaderT);
                }
            )

        }

    }

    updateTime(item, id) {
        for (var i in this.days) {
            if (this.days[i].id == id) {
                this.days[i].dayfrom = item.dayfrom;
                this.days[i].dayto = item.dayto;
                this.days[i].time.starttime = item.workStartTime;
                this.days[i].time.endtime = item.workEndTime;
                break;
            }
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
                self.workTime[eve.name] = e.time;
                if (eve.name === 'workEndTime') {
                    self.checkDuration(self.workTime.workStartTime, self.workTime.workEndTime, 'workend');
                    self.checkTime(self.workTime.workStartTime, self.workTime.workEndTime, 'work')
                }
                if (eve.name === 'mealEndTime') {
                    self.checkDuration(self.workTime.mealStartTime, self.workTime.mealEndTime, 'mealend');
                    self.checkTime(self.workTime.mealStartTime, self.workTime.mealEndTime, 'meal');
                }
            });
    }

    checkTime(strTime, endTime, field) {
        if (strTime >= endTime) {
            if (field == 'work') {
                this.wrongWorkTime = true;
            } else if (field == 'meal') {
                this.wrongMealTime = true;
                this.wrongWorkTime = false;
            } else {
                this.wrongMealTime = false;
            }
        }
    }

    formatTime(event, model, field) {
        if (event.length == 2) {
            this.workTime[model.name] = event + ':';
        } else if (event.length == 5) {
            this.workTime[model.name] = event + ':';
        } else {
            this.workTime[model.name] = event
        }
        if (event.length == 8 && field == 'workend') {
            this.checkDuration(this.workTime.workStartTime, this.workTime.workEndTime, field)
        } else if (event.length == 8 && field == 'mealend') {
            this.checkDuration(this.workTime.mealStartTime, this.workTime.mealEndTime, field)
        }

        if (field == 'workend' && field == 'workstart') {
            this.checkDuration(this.workTime.workStartTime, this.workTime.workEndTime, field)
        } else if (field == 'mealend' && field == 'mealstart') {
            this.checkDuration(this.workTime.mealStartTime, this.workTime.mealEndTime, field)
        }
    }

    checkDuration(strtime, endtime, fieldObj) {
        let self = this.workTime;
        let hrs,
            absolueteMin, start, end;
        if (strtime != '' && endtime != '') {
            start = strtime.split(':');
            end = endtime.split(':');
        }
        const startTime = (+start[0]) * 60 * 60 + (+start[1]) * 60 + (+start[2]);
        const endTime = (+end[0]) * 60 * 60 + (+end[1]) * 60 + (+end[2]);
        const totSeconds = endTime - startTime;
        const durHrs = totSeconds / 3600;
        const absolueteHrs = Math.floor(durHrs);
        const durMin = (durHrs - absolueteHrs) * 60;
        absolueteMin = Math.floor(durMin);
        absolueteMin = absolueteMin > 10 ? absolueteMin : '0' + absolueteMin;
        hrs = absolueteHrs > 9
            ? absolueteHrs
            : '0' + absolueteHrs;
        if (fieldObj == 'workend') {
            self.workDuration = parseFloat(hrs + ':' + absolueteMin);
        } else {
            self.mealDuration = parseFloat(hrs + ':' + absolueteMin);
        }
    }

    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);

    }


}

