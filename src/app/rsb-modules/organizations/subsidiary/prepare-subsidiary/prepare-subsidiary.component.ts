import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { PrepareSubsidiary } from '../subsidiary';
import { SessionStorage } from 'ngx-webstorage';
import { SubsidiaryService } from '../subsidiary.service';
import { EavWrapperService } from '../../../../utils/services/eav-wrapper.service';
import {ManageSubsidiaryComponent} from '../manage-subsidiary/manage-subsidiary.component';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';

@Component({ selector: 'app-prepare-subsidiary', templateUrl: './prepare-subsidiary.component.html', styleUrls: ['./prepare-subsidiary.component.scss'] })
export class PrepareSubsidiaryComponent implements OnInit {

  public prepareSubsidairy: PrepareSubsidiary;

  public mode: string;
  public index: number;
  public subsidiary: any;
  // public emailPattern="/^[a-zA-Z]$/"
  @SessionStorage('user')
  public loggedInUser;

  constructor(public translate:TranslateService,public dialogRef: MatDialogRef<PrepareSubsidiaryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private eavWrapperService: EavWrapperService,
              private subsidiaryService: SubsidiaryService,
              public appService:AppService,
              ) {
    this.mode = data.message;
    this.index = data.index;
    //this.subsidiary = new ManageSubsidiary(data.subsidiary);
    this.prepareSubsidairy = new PrepareSubsidiary(data.subsidiary);
    dialogRef.disableClose = true;
  }

  onSubmit() {
    if (this.mode === 'new') {
        console.log("rrrrrrrrrrrrrrrrrrrrrr",this.prepareSubsidairy);
      delete this.prepareSubsidairy.id;
      let subsidairyObject = this
        .eavWrapperService
        .jsonToEav(this.prepareSubsidairy, 'SUBSIDIARY', 1); //this.loggedInUser.org_id);

      this
        .subsidiaryService
        .createUpdateSubsidiary(`/rsb-oms/oms/createSubsidiary?Accept-Language=`+this.appService.currentLang, subsidairyObject)
        .subscribe((data) => {
            this.evictcache();
          this
            .dialogRef
            .close(true);
        }, (error) => {
          console.log(error);
          // this
          //   .snackBar
          //   .open(error.message, '', {
          //     duration: 3000,
          //     extraClasses: ['error-snackbar']
          //   });
        });
    } else if (this.mode === 'edit') {
      let subsidairyObject = this
        .eavWrapperService
        .jsonToEav(this.prepareSubsidairy, 'SUBSIDIARY', 1); //this.loggedInUser.org_id);
      this
        .subsidiaryService
        .createUpdateSubsidiary(`/rsb-oms/oms/updateEntity?Accept-Language=`+this.appService.currentLang, subsidairyObject)
        .subscribe((data) => {
          data = JSON.parse(data._body);
          // let snackref = this
          //   // .snackBar
            // .open("updated successfully", 'okay', {
            //   duration: 3000,
            //   extraClasses: ['success-snackbar']
            // });
          this
            .dialogRef
            .close(true);
        }, (error) => {
          // this
          //   .snackBar
          //   .open(error.message, '', {
          //     duration: 3000,
          //     extraClasses: ['error-snackbar']
          //   });
        });
    }
  }
    evictcache(){

        this.subsidiaryService.evictcache(`/rsb-oms/oms/cacheEvict`)
            .subscribe(res => {
               // this.manageSubsidiary.getSubsidiary();
            }, (error: any) => {

            });
    }

  ngOnInit() {
    //this.prepareSubsidairy = new PrepareSubsidiary({});
  }
  closeModal() {
      this.dialogRef.close();
      this.dialogRef = null;
  }

}
