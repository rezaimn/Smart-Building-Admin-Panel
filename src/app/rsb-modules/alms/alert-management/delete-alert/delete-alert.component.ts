import {AppService} from './../../../../app.service';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';
import {AlertManagementService} from '../alert-management.service';
import {DatePipe} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';


@Component({
    selector: 'app-delete-alert',
    templateUrl: './delete-alert.component.html',
    styleUrls: ['./delete-alert.component.scss'],
    providers: [DatePipe]
})
export class DeleteAlertComponent implements OnInit {

    // @Output() notify: EventEmitter<any> = new EventEmitter();
    //@Output() myEvent = new EventEmitter();
    // @Input() ref: ManageAlertsComponent;
    public alertId: any = {};


    constructor(
        public dialogRef: MatDialogRef<DeleteAlertComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private storage: LocalStorageService,
        public appService: AppService,
        private sessionStorageService: SessionStorageService,
        private AlertManagementService: AlertManagementService,
        private router: Router,
        public translate:TranslateService
       ) {
        this.alertId = data;
        dialogRef.disableClose = true;

    }



    ngOnInit() {

        // this.sendHeader();
    }



    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);
        //this.myEvent.emit(null);
        //this.ref.execute(null);
        //  window.location.reload();
    }

    // close alert action
    closeAlertAction() {
        this.AlertManagementService.deleteAlertsList(this.alertId).subscribe(
            res => {
                if (res._body == 1) {
                    this.translate.get('error-messages.alert-delete-success', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showSuccess(subHeaderT);
                        }
                    );
                    this.closeModal();
                    // this.notify.emit('Click from nested component');
                }
                if (res._body == 0) {
                    this.translate.get('error-messages.alert-delete-failed', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                    this.closeModal();
                }
            }, (error: any) => {
                console.log(error);
            })
        //this.myEvent.emit(null);
        // this.route.navigate([''])
    }
}

