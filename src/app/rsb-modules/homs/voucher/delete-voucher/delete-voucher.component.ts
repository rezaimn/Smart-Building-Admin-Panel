import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { VoucherService } from '../voucher.service';
import { Router } from '@angular/router';

import * as moment from 'jalali-moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-delete-voucher',
  templateUrl: './delete-voucher.component.html',
  styleUrls: ['./delete-voucher.component.scss']
})
export class DeleteVoucherComponent implements OnInit {

  public staff: any = {};

 

  public now = moment();
  
  public cardNumber:string;
  
  constructor(
    public dialogRef: MatDialogRef<DeleteVoucherComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: LocalStorageService,
    private staffService: VoucherService,
    public appService: AppService,
    public translate:TranslateService,
    private voucherService: VoucherService,
    private sessionStorageService: SessionStorageService,
    private router: Router) {
    this.staff = data.staff;
      dialogRef.disableClose = true;
   
  }
  @SessionStorage('voucher')
  public voucher;

  ngOnInit() {
    
   // this.sendHeader();
  }

  sendHeader(): void {
    // Send message to subscribers via observable subject
    
      this
        .appService
        .sendHeader("header", 'alms management', 'hello', '');
    
  }

  ngAfterViewInit() {
  }
  

  deleteVoucher(){ 
    
    
     
      this
        .voucherService
        .deleteVoucher('/HOMS/DeleteVoucher?id=' + this.voucher.id)
        .subscribe(res => {
            if (res._body === 1) {
                this.router.navigate(['/rsb-modules/homs/voucher/voucher-list/view-all']);
                this.closeModal();
                this.translate.get('error-messages.voucher-delete-success', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showSuccess(subHeaderT);
                    }
                );
            }
            if (res._body === 0) {
                this.closeModal();
                this.translate.get('error-messages.voucher-delete-failed', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );
            }
        }, (error: any) => {
            this.translate.get('error-messages.voucher-delete-failed', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    this.appService.showFail(subHeaderT);
                }
            );
        });
    }

  

  closeModal() {
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
  }
  
  
  }
