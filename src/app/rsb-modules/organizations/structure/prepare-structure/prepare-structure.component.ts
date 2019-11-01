import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SessionStorage } from 'ngx-webstorage';
import { StructureService } from '../structure.service';
import { EavWrapperService } from '../../../../utils/services/eav-wrapper.service';
import { ManageStructure, PrepareStructure } from '../structure'
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';

@Component({ selector: 'app-prepare-structure', templateUrl: './prepare-structure.component.html', styleUrls: ['./prepare-structure.component.scss'] })

export class PrepareStructureComponent implements OnInit {
  public prepareStructure: PrepareStructure;
  public mode: string;
  public index: number;
  public subsidiary: any;
  public parentID: any
  public Commercial: string;
  public saveButton: string;
  constructor(public dialogRef: MatDialogRef<PrepareStructureComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private eavWrapperService: EavWrapperService,
              public appService:AppService,
              private structureService: StructureService,
              public translate:TranslateService) {

    this.mode = data.message;
    this.index = data.index;
    // this.prepareStructure = new ManageStructure(data.structure);
    this.prepareStructure = new PrepareStructure(data.structure);
    this.parentID = data.parentId;
      dialogRef.disableClose = true;
  console.log(data);
  }

  onSubmit() {
    console.log("ssssssssssssssss",this.prepareStructure);
    if (this.mode === 'new') {
      delete this.prepareStructure.id;
      let structureObject = this.eavWrapperService.jsonToEav(this.prepareStructure, 'STRUCTURE', this.parentID);//this.loggedInUser.org_id);
      this
        .structureService
        .createUpdateStructure(`/rsb-oms/oms/createStructure?Accept-Language=` + this.appService.currentLang, structureObject)
        .subscribe((data) => {
          this.dialogRef.close(true);
          // this.snackBar.open("Structure Created successfully", "okay", { duration: 3000 })
        }, (error) => {
          // this
          //   .snackBar
          //   .open('Structure Already exists', '', { duration: 2000 })
        });
    } else if (this.mode === 'edit') {
      let structureObject = this
        .eavWrapperService
        .jsonToEav(this.prepareStructure, 'STRUCTURE', this.parentID);//this.loggedInUser.org_id);
      this
        .structureService
        .createUpdateStructure(`/rsb-oms/oms/updateEntity?Accept-Language=` + this.appService.currentLang, structureObject).subscribe((data) => {
          // this.snackBar.open("Structure Edited successfully", "okay", { duration: 3000 })
          this.dialogRef.close(true);
        }, (error) => {
          // this
          //   .snackBar
          //   .open('Structure Already exists', '', { duration: 2000 })
        });
    }
  }
  closeModal() {
      this.dialogRef.close();
      this.dialogRef = null;
  }
  ngOnInit() {
    if (this.mode === 'edit') {
      this.saveButton = 'Save Changes';
    }
    else if (this.mode === 'new') {
      this.saveButton = 'Save to List';
    }
  }

}
