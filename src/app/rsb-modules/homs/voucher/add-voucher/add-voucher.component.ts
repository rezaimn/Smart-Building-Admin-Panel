import {DatePipe} from '@angular/common';
import {AppService} from './../../../../app.service';
import {Component, Inject, OnInit} from '@angular/core';
import {DateAdapter, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {Router} from '@angular/router';

import {Voucher} from '../voucher';
import {VoucherService} from 'app/rsb-modules/homs/voucher/voucher.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-add-voucher',
    templateUrl: './add-voucher.component.html',
    styleUrls: ['./add-voucher.component.scss'],
    providers: [DatePipe]
})
export class AddVoucherComponent implements OnInit {
    public vouchers: any[];

    public voucher: Voucher = new Voucher();

    public staff: any;
    public date: Date;
    public shiftTypes: any;
    public selectedType: any = 'any';

    //public staff: any;
    @SessionStorage('addVoucherCount')
    public addVoucherCount;

    constructor(
        public dialogRef: MatDialogRef<AddVoucherComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private storage: LocalStorageService,
        public appService: AppService,
        public translate:TranslateService,
        private sessionStorageService: SessionStorageService,
        private voucherService: VoucherService,
        public dateAdapter: DateAdapter<Date>,
        private datePipe: DatePipe,
        private router: Router) {
        this.dateAdapter.setLocale('en-In');
        if (data.voucher) {
            this.voucher = data.voucher;
            this.selectedType = this.data.type;
            console.log(data.voucher);
        }
        dialogRef.disableClose = true;
    }

    ngOnInit() {

        // this.sendHeader();
    }

    sendHeader(): void {
        // Send message to subscribers via observable subject

        this
            .appService
            .sendHeader('header', 'homs management', 'hello', '');

    }

    ngAfterViewInit() {
    }


    updateVoucher(item) {
        console.log(item);
        if (this.addVoucherCount == 0) {

            let obj = {
                'id': item.id,
                'number': item.number,
                'amount': item.amount,
                'employeeid': item.employeeid
            }
            this
                .voucherService
                .updateVoucher('/HOMS/UpdateVoucher', obj)
                .subscribe(res => {
                    if (res._body === 1) {
                        this.closeModal();
                        this.translate.get('error-messages.voucher-update-success', this.appService.currentLang).subscribe(
                            (subHeaderT) => {
                                this.appService.showSuccess(subHeaderT);
                            }
                        );
                    }
                    if (res._body === 0) {
                        this.translate.get('error-messages.voucher-update-failed', this.appService.currentLang).subscribe(
                            (subHeaderT) => {
                                this.appService.showFail(subHeaderT);
                            }
                        );
                    }
                    if(res._body>=2){
                        this.appService.generalExceptions(res._body);
                    }
                }, (error: any) => {
                    this.translate.get('error-messages.voucher-update-failed', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                });
        } else {

            //let obj = {
            //"number": item.number,
            //"amount": item.amount,
            //"employeeid": item.employeeid
            //}

            this.voucherService.addVoucher('/HOMS/InsertVoucher', this.voucher)
                .subscribe(res => {
                    if (res._body === 1) {
                        this.router.navigate(['/rsb-modules/homs/voucher/voucher-list/view-all']);
                        this.closeModal();
                        this.translate.get('error-messages.voucher-add-success', this.appService.currentLang).subscribe(
                            (subHeaderT) => {
                                this.appService.showSuccess(subHeaderT);
                            }
                        );
                    }
                    if (res._body === 0) {
                        this.translate.get('error-messages.voucher-add-failed', this.appService.currentLang).subscribe(
                            (subHeaderT) => {
                                this.appService.showFail(subHeaderT);
                            }
                        );
                    }
                    if(res._body>=2){
                        this.appService.generalExceptions(res._body);
                    }
                }, (error: any) => {
                    this.translate.get('error-messages.voucher-add-failed', this.appService.currentLang).subscribe(
                        (subHeaderT) => {
                            this.appService.showFail(subHeaderT);
                        }
                    );
                });
        }

    }

    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }

    updateScreen(date) {

        let vouchers = [];
        let obj = {
            'date': date = this.datePipe.transform(date.voucherDate, 'dd/MM/yyyy'),

            // "pagination":{"page":1,"records":5}
        }
        this
            .voucherService
            .getVoucherList('/HOMS/GetVoucherByDate', obj)
            .subscribe(res => {
                if (res.status === 200) {
                    this.vouchers = JSON.parse(res._body);
                    console.log(vouchers);
                    // this.vouchers = Array.of(this.vouchers);
                }
            }, (error: any) => {
                this.appService.showFail('SCREEN FAILD TO UPDATE.');
            });


    }

}

