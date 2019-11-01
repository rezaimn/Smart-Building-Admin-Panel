import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';

import { PrepareLevel } from '../level';
import { LevelService } from '../level.service';
import { EavWrapperService } from '../../../../utils/services';
import {ManageLevelComponent} from '../manage-level/manage-level.component';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-prepare-level',
  templateUrl: './prepare-level.component.html',
  styleUrls: ['./prepare-level.component.scss']
})
export class PrepareLevelComponent implements OnInit, OnChanges {
  @Input() prepareComponent; // Check type whether add or edit
  @Input() fileData; // getfileName of file uploaded
  @ViewChild('prepareLevelForm') public prepareLevelForm;

  public index: number;

  public mode = '';

  public formData = new FormData();

  public fileUploaded = false;
    public fileTypeError = false;
  public fileName : string;
  public fileChanged = false;
  public prepareLevel = new PrepareLevel({});

  public scrollbarOptions = {
    axis: 'yx',
    theme: 'minimal-dark',
    mouseWheel: {
      enable: true
    },
    contentTouchScroll: 50
  };

  constructor(private storage : LocalStorageService,
              private levelService : LevelService,
              private eavWrapperService : EavWrapperService,
              public manageLevel:ManageLevelComponent,
              public appService:AppService,
              public translate:TranslateService) {}

  uploadSvgFile(event) {
    this.formData = new FormData();
    const file = event.target.files[0];
    if (event.target.files && file) {
      this
        .formData
        .append('fileUpload', file);
      console.log(this.formData);
        if (file.type !== "image/svg+xml") {
            this.fileTypeError = true;
        }
        else{
            this.fileTypeError = false;
            this.fileName = file.name;
            this.fileUploaded = true;
            this.fileChanged = true;
            this.prepareLevel.levelMap = this.fileName;
        }
    }

  }

  uploadFileServer(levelData, url, prepareLevelForm) {
    if (this.fileChanged == true) {
      this
        .levelService
        .uploadFile('/rsb-oms/oms/fileUpload ', this.formData)
        .subscribe(res => {
          levelData.levelMap = res
            .json()
            .response;
          this.createUpdateLevel(levelData, url, prepareLevelForm);
        }, (error : any) => {
          // this
          //   .snackBar
          //   .open('Error occured while Uploading file', 'Ok', {
          //     duration: 5000,
          //     extraClasses: ['error-snackbar']
          //   });
        });
    } else {
      this.createUpdateLevel(levelData, url, prepareLevelForm);
    }
  }

  createUpdateLevel(levelData, url, prepareLevelForm) {
    const levelObject = this
      .eavWrapperService
      .jsonToEav(levelData, 'LEVEL', this.prepareComponent.parentId);
    this
      .levelService
      .createUpdateLevel(url, levelObject)
      .subscribe(res => {
          this.evictcache();
          prepareLevelForm.resetForm();
        // this
        //   .snackBar
        //   .open('Successfully updated the Level list', 'Ok', {
        //     duration: 5000,
        //     extraClasses: ['success-snackbar']
        //   });
        //prepareLevelForm.reset();

        this
          .storage
          .store('addClicked', false);
      }, (error : any) => {
        // this
        //   .snackBar
        //   .open('Error updating the Level list', 'Ok', {
        //     duration: 5000,
        //     extraClasses: ['error-snackbar']
        //   });
      });
    $("#saveButton").prop('disabled', false);
  }
    evictcache(){

        this.levelService.evictcache(`/rsb-oms/oms/cacheEvict`)
            .subscribe(res => {
                this.manageLevel.getLevelList();
            }, (error: any) => {

            });

    }
  // Function to be  called upon clicking the cancel button
  cancelButton() {
      this.prepareLevelForm.resetForm();
      this.resetFile();
    this
      .storage
      .store('addClicked', false);
      this
          .manageLevel
          .getLevelList();
  }

  onSubmit(levelData, prepareLevelForm) {

    $("#saveButton").prop('disabled', true);
    let url;
    if (this.prepareComponent.type == 'add') {
      delete levelData.id;
      url = '/rsb-oms/oms/createFloor?Accept-Language='+this.appService.currentLang;
    } else {
      this.prepareLevel.levelMap = (this.prepareLevel.levelMap == null)
        ? this.prepareComponent.levelMap
        : this.prepareLevel.levelMap;
      url = '/rsb-oms/oms/updateEntity?Accept-Language='+this.appService.currentLang;
    }

    this.uploadFileServer(levelData, url, prepareLevelForm);
  }

  resetFile() {
    $("#uploadFloorMap").val("");
    this.fileName = '';
    this.fileUploaded = false;
    this.prepareLevel.levelMap = '';

  }

  ngOnInit() {}

  ngOnChanges() {
    //console.log(this.prepareComponent);
    this.resetFile();
    if (this.prepareComponent) {
      this.prepareLevel = new PrepareLevel(this.prepareComponent.object);
      this.index = this.prepareComponent.index;
      this.mode = this.prepareComponent.type;
      if (this.mode == 'edit') {
        this.fileName = this.fileData;
        this.fileUploaded = true;
      } else {
        this.fileName = '';
        this.fileUploaded = false;
      }
    } else {
      this.index = 1;
    }
  }

}
