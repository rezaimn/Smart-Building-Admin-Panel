import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import { WorkPolicyService } from '../work-policy.service';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  public urlData : string
  constructor( public appService:AppService,
               public translate:TranslateService,

               public dialogRef : MatDialogRef < ConfirmComponent >,
               @Inject(MAT_DIALOG_DATA) public data : any,  private workPolicyService:WorkPolicyService) {
    this.urlData = data;
      dialogRef.disableClose = true;
  }
  

  ngOnInit() {}

  deleteData() {
   this
      .workPolicyService
      .deletePolicy(this.urlData)
      .subscribe(res => {
          this.translate.get('error-messages.work-policy-deleted-success', this.appService.currentLang).subscribe(
              (subHeaderT) => {
                  this.appService.showSuccess(subHeaderT);
              }
          );
          ////this.appService.showSuccess('WORK POLICY DELETED SUCCESSFULLY.');

          this
          .dialogRef
          .close(true);
      }, (error: any) => {
          this.translate.get('error-messages.work-policy-delete-failed', this.appService.currentLang).subscribe(
              (subHeaderT) => {
                  this.appService.showFail(subHeaderT);
              }
          );

      });
  }
  closeModal() {
      this.dialogRef.close();
      this.dialogRef = null;
  }

}
