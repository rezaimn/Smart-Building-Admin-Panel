import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {CreateDevice, PrepareDevice} from '../device';
import {MasterDataService} from '../../../../utils';
import {DeviceService} from '../device.service';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';

@Component({selector: 'app-prepare-device', templateUrl: './error-table.component.html', styleUrls: ['./error-table.component.scss']})
export class ErrorTableComponent implements OnInit {
    public index: number;
    public mode: string;

    public errorData;
    @SessionStorage('prepareDeviceOpenCount')
    public prepareDeviceOpenCount;


    constructor(public localStorageService: LocalStorageService,
                public dialogRef: MatDialogRef<ErrorTableComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public masterDataService: MasterDataService,
                public deviceService: DeviceService,
                public appService: AppService,
                public translate: TranslateService) {
        this.mode = data.message;
        this.index = data.index;
        this.errorData= data.data;

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

    }

    ngOnDestroy() {
        this.prepareDeviceOpenCount = 0;
        this.localStorageService.store('addClicked', false);
    }


    /**
     @Desc get device file details
     @Param event
     @return
     */


    onSubmit() {

    }

    closeModal() {
        this
            .localStorageService
            .store('addClicked', false);
        this.dialogRef.close();
        this.dialogRef = null;
    }
}
