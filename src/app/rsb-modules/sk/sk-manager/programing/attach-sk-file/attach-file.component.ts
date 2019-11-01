import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {AppService} from '../../../../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {fileInfo, skFileAttach} from '../../../sk';
import {SkService} from '../../../sk.service';


@Component({
    selector: 'app-attach-file',
    templateUrl: './attach-file.component.html',
    styleUrls: ['./attach-file.component.scss']
})
export class AttachFileComponent implements OnInit {
    public skFiles: skFileAttach;
    public filesList = [];

    constructor(
        public dialogRef: MatDialogRef<AttachFileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private storage: LocalStorageService,
        public appService: AppService,
        public translate: TranslateService,
        public skService: SkService,) {
        this.skFiles = data.skFiles;
        dialogRef.disableClose = true;
        for(let file of this.skFiles.files){
            if(file.dailyScheduleTime==''){
                file.presence=true;
            }
        }
    }
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
    ngOnInit() {

        this.getAllSKFiles();
    }
    getAllSKFiles(){
        this.skService.getAllSKFiles('/rsb-oms/oms/getFilesInfo?type=SkUploadFile').subscribe(
            (res )=> {
                this.filesList=JSON.parse(res._body).files;
            },
            (error: any) => {
                // this.snackBar.open('Error occured while Uploading file', 'Ok', {
                //   duration: 5000,
                //   extraClasses: ['error-snackbar']
                // });
            }
        );
    }
    fileIsUpdated(index) {
        this.skFiles.files[index].isUpdated = true;
    }
    presenceChanged(status,index){
        if(status){
            this.skFiles.files[index].dailyScheduleTime='';
        }
    }
    attachFileToSK(file) {

        let body={
            type: "SkDeviceFile",
            fileId:file.fileId,
            deviceId: this.skFiles.deviceId,
            dailyScheduleTime:file.dailyScheduleTime,
            repeatAgain:file.repeatAgain
        }
        if(file.presence){
            body.dailyScheduleTime='';
        }
        this.skService.attachSKFile('/rsb-oms/oms/attachFileInfo', body).subscribe(
            (res) => {
                file.isUpdated=false;
                file.isSaved=true;

            },
            (error: any) => {
                // this.snackBar.open('Error occured while Uploading file', 'Ok', {
                //   duration: 5000,
                //   extraClasses: ['error-snackbar']
                // });
            }
        );
    }

    detachFileToSK(file,index) {
        if(file.isSaved==false){
            this.skFiles.files.splice(index,1);
        }
        else{
            let body = {
                fileId: file.fileId,
                deviceId: this.skFiles.deviceId,
                type: "SkDeviceFile"
            }
            console.log(body);
            this.skService.detachSKFile('/rsb-oms/oms/detachFileInfo', body).subscribe(
                (res) => {
                    this.skFiles.files.splice(index,1);
                },
                (error: any) => {
                    // this.snackBar.open('Error occured while Uploading file', 'Ok', {
                    //   duration: 5000,
                    //   extraClasses: ['error-snackbar']
                    // });
                }
            );
        }

    }
    addNewFileToSK(){
        let file:fileInfo=new fileInfo({});
        this.skFiles.files.push(file);
        console.log(this.skFiles);
    }
    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }

}
