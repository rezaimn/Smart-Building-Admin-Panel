 import {Component, OnInit} from '@angular/core';


import {environment} from '../environments/environment';
import {Observable} from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/share';
import {StompService , StompState } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    public maintenanceError = '';
    private serverUrl = environment.wsUrl;//'https://appdev.mitoconnect.com/gs-guide-websocket';
    private stompClient;
    public Hour='00';
    public Minute='00';
    public  Second='00';
    public timerOn=false;
    constructor( private translate: TranslateService , private _stompService: StompService,   private router: Router) {
        translate.addLangs(["en", "fa"]);
        this.translate.use("en");
        this.translate.get('dir','fa').subscribe(
            (res)=>{

                // const dom: any = document.querySelector('body');
                // if(res=="rtl" &&!dom.classList.contains('rtl')){
                //     dom.classList.toggle('rtl');
                // }
                // if(res=="ltr" &&dom.classList.contains('rtl')){
                //     dom.classList.toggle('rtl');
                //
                // }
            }
        );

    }



    ngOnInit() {

        // you can uncomment these lines to see the actual routes
//        this.router.events
//    .subscribe((event) => {
//      // example: NavigationStart, RoutesRecognized, NavigationEnd
//      console.log(event , "rsbroutes");
//    });
        

       // this.initializeWebSocketConnection();
    }

    async initializeWebSocketConnection() {

        this._stompService.initAndConnect();

        let stomp_subscription = this._stompService.subscribe('/topic/notificationCount');
        stomp_subscription.map((message: Message) => {
            console.log( message.body, 'AAAAAAAAAAAAAAAAAAA');
            if (message.body && this.timerOn == false) {
                this.timerOn = true;
                let date = new Date();
                let defer = Math.floor((date.getTime() - 1528537494931) / (1000 * 60));
                let hour = (Math.floor(defer / 60)).toString();
                let min = (defer % 60).toString();
                this.Hour = hour;
                if (parseInt(hour) < 10) {
                    if (parseInt(this.Hour) < 10 && parseInt(this.Hour) >= 0) { this.Hour = "0" + parseInt(this.Hour) };
                }
                this.Minute = min;
                if (parseInt(min) < 10) {
                    if (parseInt(this.Minute) < 10 && parseInt(this.Minute) >= 0) { this.Minute = "0" + parseInt(this.Minute) };
                }
                let errorMessage = JSON.parse(message.body);
                //return message.body;
            }
        });
        // }).subscribe((msg_body: string) => {
        // 	//console.log(`Received: ${msg_body}`);
        // });


    }

}
