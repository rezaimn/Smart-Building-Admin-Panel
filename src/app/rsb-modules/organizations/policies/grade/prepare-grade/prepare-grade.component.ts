import { Component, OnInit, Inject } from '@angular/core';
import { PrepareGrade } from '../grade';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PoliciesService } from '../../policies.service';
import { SessionStorage } from 'ngx-webstorage';
import {AppService} from '../../../../../app.service';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-prepare-grade',
  templateUrl: './prepare-grade.component.html',
  styleUrls: ['./prepare-grade.component.scss']
})
export class PrepareGradeComponent implements OnInit {

  @SessionStorage('subdiaryid')
  public subdiaryid;

  @SessionStorage('designation')
  public designation;

  public prepareGrade: PrepareGrade;
  public mode: string;
  public index: number;

  constructor(public translate:TranslateService,
              public appService:AppService,
              private policiesService: PoliciesService,
              public dialogRef: MatDialogRef<PrepareGradeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mode = data.message;
    this.index = data.index;
    this.prepareGrade = new PrepareGrade(data.department);
      dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log(JSON.stringify(this.prepareGrade));
    if (this.mode === 'new') {
      this.prepareGrade.subsidairyId = this.subdiaryid;
      delete this.prepareGrade.id;
      this
        .policiesService
        .createUpdateGrade(`/rsb-oms/oms/createGradePolicy`, this.prepareGrade)
        .subscribe((data) => {
          this
            .dialogRef
            .close(true);
          // let snackref = this.snackBar.open('Grade created successfully', 'okay', { duration: 3000 });
        }, (error) => {
          if (error.status == 1006) {
            // this.snackBar.open('Grade name already exists', 'okay', { duration: 3000 });
          } else {
            // this.snackBar.open('Grade creation unsuccessfull', 'okay', { duration: 3000 });
          }

        });
    } else if (this.mode === 'edit') {
      this
        .policiesService
        .createUpdateGrade(`/rsb-oms/oms/dept/updateDept`, this.prepareGrade)
        .subscribe((data) => {
          data = JSON.parse(data._body);
          // let snackref = this.snackBar.open(data.response, 'okay', { duration: 3000 });
          this.dialogRef.close(true);
        }, (error) => {
          // this.snackBar.open('Grade creation unsuccessfull', 'okay', { duration: 3000 });
        });
    }
  }

  closeModal() {
    console.log('close modal');
    this
      .dialogRef
      .close();
    this.dialogRef = null;
  }
}
