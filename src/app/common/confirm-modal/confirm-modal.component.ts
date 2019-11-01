import {Component, OnInit, Inject} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {AppService} from '../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.scss']})
export class ConfirmModalComponent implements OnInit {
  public urlData : string
  public checkUrl : boolean;
  constructor(public translate:TranslateService,public appService:AppService,
              public dialogRef : MatDialogRef <ConfirmModalComponent >,
              @Inject(MAT_DIALOG_DATA) public data : any, public authenticationService : AuthenticationService) {
      dialogRef.disableClose = true;
    this.urlData = data;
    var string = data,
    substring = "SSMS";
   if(string.indexOf(substring) !== -1)
    this.checkUrl = false ;
    else
    this.checkUrl = true;

  }

  ngOnInit() {}
  deleteData() {
    if (this.checkUrl){
      this
      .authenticationService
      .deleteItem(this.urlData)
      .subscribe(res => {
          console.log("delete :    ",res);

        this
          .dialogRef
          .close(true);
      }, (error: any) => {

      });
    }else{
        console.log("delete else:    ");
      this
      .authenticationService
      .deleteItemPe(this.urlData)
      .subscribe(res => {

        this
          .dialogRef
          .close(true);
      }, (error: any) => {

      });
    }
    
  }
  deleteDataPe() {
   
  }
  closeModal() {
    this
      .dialogRef
      .close(false);
  }

}