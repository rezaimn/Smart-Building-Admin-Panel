import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {SessionStorage, LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { PrepareDevice } from '../device';
import { DeviceService } from '../device.service';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';

@Component({ selector: 'app-delete-device', templateUrl: './delete-device.component.html', styleUrls: ['./delete-device.component.scss'] })
export class DeleteDeviceComponent implements OnInit {
  public id: number;
  public count: number;
  public url: string;
  constructor(public dialogRef: MatDialogRef<DeleteDeviceComponent>,
              public sessionStorageService: SessionStorageService,
              public appService:AppService,public translate:TranslateService,
              @Inject(MAT_DIALOG_DATA

                  ) public data: any, public deviceService: DeviceService) {
    this.id = data.id;
    this.count = data.count;
    this.url = data.url;
    dialogRef.disableClose = true;
  }
    /**
     @Desc close modal
     @Param
     @return
     */
  closeModal() {
        this.dialogRef.close();
        this.dialogRef = null;
  }
    /**
     @Desc open delete device modal
     @Param
     @return
     */
  deleteDevice(id) {
    if (this.count > 1) {
      this.deviceService.saveDevice(this.url, this.id).subscribe((data) => {
        // this.snackBar.open('Successfully deleted the Device', 'Ok', {
        //   duration: 5000,
        //   extraClasses: ['success-snackbar']
        // });
        this
          .dialogRef
          .close(true);
      }, (error) => {
        // this
        //   .snackBar
        //   .open('Error occured while deleting device', 'Ok', {
        //     duration: 5000,
        //     extraClasses: ['error-snackbar']
        //   });
      });
    }
    else{
      console.log(this.id)
      this.deviceService.deleteDevice(`/rsb-oms/oms/deleteDevice?id=`, this.id).subscribe((data) => {
          this.sessionStorageService.store('deviceSliderclicked', false);
        // this.snackBar.open('Successfully deleted the Device', 'Ok', {
        //   duration: 5000,
        //   extraClasses: ['success-snackbar']
        // });
        this
          .dialogRef
          .close(true);
      }, (error) => {
        // this
        //   .snackBar
        //   .open('Error occured while deleting device', 'Ok', {
        //     duration: 5000,
        //     extraClasses: ['error-snackbar']
        //   });
      });
    }
  }
  ngOnInit() {
  }

}
