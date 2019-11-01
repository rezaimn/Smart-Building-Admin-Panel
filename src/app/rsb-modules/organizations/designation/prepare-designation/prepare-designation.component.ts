import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {SessionStorage, LocalStorageService} from 'ngx-webstorage';
import {DesignationService} from '../designation.service';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service';
import {PrepareDesignation} from '../designation';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';

@Component({selector: 'app-prepare-designation', templateUrl: './prepare-designation.component.html', styleUrls: ['./prepare-designation.component.scss']})
export class PrepareDesignationComponent implements OnInit {
  @SessionStorage('department')
  public departments;
  @SessionStorage('subdepartment')
  public subdepartments;
  public designationData;
  public mode : string;
  public index : number;
  public linkTo : string;
  public prepareDesgn : PrepareDesignation;
  constructor(public dialogRef : MatDialogRef < PrepareDesignationComponent >,
              @Inject(MAT_DIALOG_DATA)public data : any,
              private storage : LocalStorageService,
              public designationService : DesignationService,
              public appService:AppService,
              public translate:TranslateService) {

    this.mode = data.message;
    this.index = data.index;
    this.designationData = data.desgn;
      dialogRef.disableClose = true;
    this.linkTo = data.linkTo;
    this.prepareDesgn = new PrepareDesignation(this.designationData);
  }

  ngOnInit() {}
  onSubmit() {
    if (this.mode == 'new' && this.linkTo == 'department') {
      this.prepareDesgn.departmentId = this.departments.id;
      this
        .designationService
        .createUpdateDesignation(`/rsb-oms/oms/dept/desig/createDesignation`, this.prepareDesgn)
        .subscribe((res) => {
          // this
          //   .snackBar
          //   .open('Successfully created designation', '', {duration: 1000});
          this
            .dialogRef
            .close(true);
        }, (error) => {
          // this
          //   .snackBar
          //   .open('Error on creating designation', '', {duration: 1000});
        })
    } else if (this.mode == 'edit' && this.linkTo == 'department') {
      this.prepareDesgn.id = this.designationData.id;
      this.prepareDesgn.departmentId = this.departments.id;
      this
        .designationService
        .createUpdateDesignation(`/rsb-oms/oms/dept/desig/updateDesignation`, this.prepareDesgn)
        .subscribe((res) => {
          // this
          //   .snackBar
          //   .open('Successfully updated designation', '', {duration: 1000});
          this
            .dialogRef
            .close(true);
        }, (error) => {
          // this
          //   .snackBar
          //   .open('Error on creating designation', '', {duration: 1000});
        })
    } else if (this.mode == 'new' && this.linkTo == 'subdepartment') {
      this.prepareDesgn.departmentId = this.subdepartments.id;
      this
        .designationService
        .createUpdateDesignation(`/rsb-oms/oms/dept/desig/createDesignation`, this.prepareDesgn)
        .subscribe((res) => {
          // this
          //   .snackBar
          //   .open('Successfully created designation', '', {duration: 1000});
          this
            .dialogRef
            .close(true);
        }, (error) => {
          // this
          //   .snackBar
          //   .open('Error on creating designation', '', {duration: 1000});
        })
    } else {
this.prepareDesgn.id = this.designationData.id;
this.prepareDesgn.departmentId = this.subdepartments.id;
      this
        .designationService
        .createUpdateDesignation(`/rsb-oms/oms/dept/desig/updateDesignation`, this.prepareDesgn)
        .subscribe((res) => {
          // this
          //   .snackBar
          //   .open('Successfully updated designation', '', {duration: 1000});
          this
            .dialogRef
            .close(true);
        }, (error) => {
          // this
          //   .snackBar
          //   .open('Error on creating designation', '', {duration: 1000});
        })
    }
  }
  closeDialog() {
      this.dialogRef.close();
      this.dialogRef = null;
  }
}
