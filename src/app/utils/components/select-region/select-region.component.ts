import {AfterContentChecked, AfterContentInit, AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../../app.service';
import {Router} from '@angular/router';

import * as moment from 'jalali-moment';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Database} from '../../../rsb-modules/sp/database/shared/database';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-device-point',
    templateUrl: './select-region.component.html',
    styleUrls: ['./select-region.component.scss']
})
export class SelectRegionComponent implements OnInit,AfterViewInit  {
    flag=true;
    public database: any = {};
    public model: Database;
    public now = moment();
    public cardNumber: string;
    public startPoint = {
        x1: 0,
        y1: 0
    }
    public endPoint = {
        x2: 0,
        y2: 0
    }
    public baseImageSize = {
        x: 0,
        y: 0
    }
    public rectLocation = {
        x1: 0.00,
        y1: 0,
        x2: 0,
        y2: 0
    }
    public installationLabel: string;
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
    public interval=null;
    constructor(
        public dialogRef: MatDialogRef<SelectRegionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private storage: LocalStorageService,
        public appService: AppService,
        public translate: TranslateService) {
        this.installationLabel = data.installationL;
        dialogRef.disableClose = true;

    }
    ngOnInit() {

    }
    ngAfterViewInit(){
            if (this.interval != null) {
                this.interval.unsubscribe();
            }
            this.interval = Observable.interval(500).subscribe(x => {
                let baseImgElement = document.getElementById('image-size');
                this.baseImageSize.x = baseImgElement.offsetWidth;
                this.baseImageSize.y = baseImgElement.offsetHeight;
                this.mapTheCurrentRegion();
                this.interval.unsubscribe();
                }
            )
    }

    mapTheCurrentRegion() {

        if (this.char_count(this.installationLabel) == 3) {
            let arr=this.installationLabel.split(',');
            this.startPoint.x1=(parseFloat(arr[0])*this.baseImageSize.x)/100;
            this.startPoint.y1=(parseFloat(arr[1])*this.baseImageSize.y)/100;
            this.endPoint.x2=(parseFloat(arr[2])*this.baseImageSize.x)/100;
            this.endPoint.y2=(parseFloat(arr[3])*this.baseImageSize.y)/100;
            this.drawRec();
        }
    }

    char_count(str) {
        var letter_Count = 0;
        for (var position = 0; position < str.length; position++) {
            if (str.charAt(position) == ',') {
                letter_Count += 1;
            }
        }
        return letter_Count;
    }

    mouseDownEvent(e) {
        this.flag=false;
        let currentRegion = <HTMLDivElement> document.getElementById('region');
        if (currentRegion) {
            currentRegion.remove();
        }
        this.startPoint.x1 = e.offsetX;
        this.startPoint.y1 = e.offsetY;
        if(this.startPoint.x1<0){
            this.startPoint.x1=0;
        }
        if(this.startPoint.y1<0){
            this.startPoint.y1=0;
        }
       // console.log(e.offsetX,".....................",e);
    }

    mouseUpEvent(e) {
        if(!this.flag){
            this.endPoint.x2 = e.offsetX;
            this.endPoint.y2 = e.offsetY;
            if(this.endPoint.x2<0){
                this.endPoint.x2=0;
            }
            if(this.endPoint.y2<0){
                this.endPoint.y2=0;
            }
            this.drawRec();
        }
       this.flag=true;
    }
    drawRec(){
        let baseImgElement = document.getElementById('baseImage');
        this.baseImageSize.x = baseImgElement.offsetWidth;
        this.baseImageSize.y = baseImgElement.offsetHeight;

        let region = document.createElement('div');
        region.style.border = 'solid 2px red';
        region.setAttribute('id', 'region');
        if (this.startPoint.y1 < this.endPoint.y2) {
            region.style.top = this.startPoint.y1 + 70 + 'px';
        }
        if (this.startPoint.y1 > this.endPoint.y2) {
            region.style.top = this.endPoint.y2 + 70 + 'px';
        }
        if (this.startPoint.x1 < this.endPoint.x2) {
            region.style.left = this.startPoint.x1 + 70 + 'px';
        }
        if (this.startPoint.x1 > this.endPoint.x2) {
            region.style.left = this.endPoint.x2 + 70 + 'px';
        }
        region.style.width = Math.abs(this.startPoint.x1 - this.endPoint.x2) + 'px';
        region.style.height = Math.abs(this.startPoint.y1 - this.endPoint.y2) + 'px';
        region.style.background = 'transparent';
        region.style.position = 'absolute';
        baseImgElement.appendChild(region);
    }
    execute() {
        let x1=parseFloat(((this.startPoint.x1 * 100) / this.baseImageSize.x).toFixed(2));
        let y1=parseFloat(((this.startPoint.y1 * 100) / this.baseImageSize.y).toFixed(2));
        let x2= parseFloat(((this.endPoint.x2 * 100) / this.baseImageSize.x).toFixed(2));
        let y2=parseFloat(((this.endPoint.y2 * 100) / this.baseImageSize.y).toFixed(2));
        if(x1>x2){
            this.rectLocation.x1 =x2;
            this.rectLocation.x2 =x1;
        }else{
            this.rectLocation.x1 =x1;
            this.rectLocation.x2 =x2;
        }
        if(y1>y2){
            this.rectLocation.y1 =y2;
            this.rectLocation.y2 =y1;
        }else{
            this.rectLocation.y1 =y1;
            this.rectLocation.y2 =y2;
        }
        this.installationLabel = this.rectLocation.x1 + ',' + this.rectLocation.y1 + ',' + this.rectLocation.x2 + ',' + this.rectLocation.y2;
        this.closeModal();
    }

    /**
     @Desc close the edit modal
     @Param
     @return
     */
    closeModal() {

        this
            .dialogRef
            .close(this.installationLabel);
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }
}
