import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {AppService} from '../../app.service';
import {BreadCrum, SearchData} from '../common.interface';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {environment} from '../../../environments/environment';


import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs'
import {Observable} from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';
import {StompService} from '@stomp/ng2-stompjs';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

    public allCrums: BreadCrum[] = [];
    public searchElements: SearchData[] = [];
    public parentUrl: string = '';
    public notificationCount: any;
    public ticketCount: any;

    @SessionStorage('search-module')
    public searchModule;
    timeStamp = new Date().toISOString();

    form: FormGroup;
    types = ['alert', 'error', 'info', 'warn', 'success'];
    animationTypes = ['fromRight', 'fromLeft', 'scale', 'rotate'];

    @SessionStorage('user')
    public user;
    private shownToasts: any = [];
    private serverUrl = environment.wsUrl;//'https://appdev.mitoconnect.com/gs-guide-websocket';
    private stompClient;

    constructor(public appService: AppService,
                private _location: Location,
                private localStorageService: LocalStorageService,
                private _stompService: StompService,
                private _notifications: NotificationsService,
                public translate: TranslateService,
                private _fb: FormBuilder
    ) {
        console.log('2222');
    }

    ngOnInit() {
        Observable.interval(1000).subscribe(x => {
            let date = new Date();
            let temp = date.toISOString();
            temp = temp.substr(0, 19);
            temp = temp.replace('-', '');
            temp = temp.replace('-', '');
            temp = temp.replace(temp.substr(9, 8), date.toLocaleTimeString('it-IT'));
            temp = temp.replace(':', '');
            temp = temp.replace(':', '');
            this.timeStamp = temp;
        });
        // this.getTicketCount();
        // this.getNotificationCounter();

        this.form = this._fb.group({
            type: 'error',
            title: 'Alert',
            content: '',
            timeOut: 50000,
            showProgressBar: true,
            pauseOnHover: true,
            clickToClose: true,
            animate: 'fromLeft',
            preventDuplicates: true,
            preventOpenDuplicates: true
        });

        this.initializeWebSocketConnection();


        this.appService.breadCrums.subscribe(response => {
            this.allCrums = response.crums;
        });

        this.appService.parentUrl.subscribe(response => {
            this.parentUrl = response.url;
        });

        this.appService.globalSearchSubject.subscribe(response => {
            // this.searchElements = response.data;
        });
    }

    performGlobalSearch(event) {
        if (event.target[0].value > 3) {
            this.localStorageService.store('search-text', event.target[0].value);
        }
    }

    goBack() {
        this._location.back();
    }

    async initializeWebSocketConnection() {

        const temp = this.form.getRawValue();
        const title = temp.title;
        let content = temp.content;
        let type = temp.type;

        delete temp.title;
        delete temp.content;
        delete temp.type;

        if (content != '') {
            type = 'error';
            this._notifications.create(title, content, type, temp);
        }
        let ws = new WebSocket(this.serverUrl);
        this.stompClient = Stomp.over(ws);
        let that = this;
        this.stompClient.connect({}, function (frame) {
            that.stompClient.subscribe('/topic/notify1', (message) => {
                if (message.body) {
                    let devicestatus = JSON.parse(message.body);
                    console.log(devicestatus);
                    let staffId = that.user.staff_id;
                    // let devicesJ = devicestatus[staffId];

                    if (staffId == devicestatus.staffId || staffId == 0) {
                        let devicesJ = devicestatus.message;
                        // let openalertfound = false;
                        // that.shownToasts.forEach((item, index) => {
                        //     if (item == devicestatus.id) {
                        //         openalertfound = true;
                        //     }
                        // });
                        // if (openalertfound == false) {
                            let toast = that._notifications.create(title, devicesJ, type, temp);
                            toast.id = devicestatus.id;
                            that.shownToasts.push(toast.id);
                            toast.click.subscribe((event) => {
                              //  alert(toast.id);
                                let id: number;
                                that.shownToasts.forEach((item, index) => {
                                    if (item === toast.id) that.shownToasts.splice(index, 1);
                                });
                            });
                        // }
                    }
                }
            });
        });
    }

    ngOnDestroy() {
        try {
            this.stompClient.disconnect();
        } catch (e) {
        }
    }

}
