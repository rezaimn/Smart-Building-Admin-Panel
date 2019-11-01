import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
//import Stomp from 'stompjs';
//import SockJS from 'sockjs-client';

@Component({
    selector: 'app-Maintenance-Error-page',
    templateUrl: './Maintenance-Error-page.component.html',
    styleUrls: ['./Maintenance-Error-page.component.scss']
})

export class MaintenanceErrorPageComponent implements OnInit {
    height=0;
    constructor(){
        this.height=window.innerHeight;
    }
    @Input() errorMessage="Error Message!";
    @Input() Hour='00';
    @Input() Minute='00';
    public  Second='00';
    ngOnInit() {

        Observable.interval(1000).subscribe(x => {
            this.checkSecond();
        });
    }
    checkSecond() {
        this.Second=(parseInt(this.Second)-1).toString();
        console.log( this.Second);
        if (parseInt(this.Second) < 10 && parseInt(this.Second) >= 0) {this.Second = "0" + parseInt(this.Second)}; // add zero in front of numbers < 10
        if (parseInt(this.Second) < 0) {
            this.Second = "59";
            this.checkMinute();
        };
    }
    checkMinute() {
        this.Minute=(parseInt(this.Minute)-1).toString();
        if (parseInt(this.Minute) < 10 && parseInt(this.Minute) >= 0) {this.Minute = "0" + parseInt(this.Minute)}; // add zero in front of numbers < 10
        if (parseInt(this.Minute) < 0) {
            this.Minute = "59";
            if(this.Hour=="00"){

            }else{
                this.checkHour();
            }

        };
    }
    checkHour() {
        this.Hour=(parseInt(this.Hour)-1).toString();
        if (parseInt(this.Hour) < 10 && parseInt(this.Hour) >= 0) {this.Hour = "0" + parseInt(this.Hour)}; // add zero in front of numbers < 10

    }
}