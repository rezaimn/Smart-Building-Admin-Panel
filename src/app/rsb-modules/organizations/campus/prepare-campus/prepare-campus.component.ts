import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { SessionStorage } from 'ngx-webstorage';
import { PrepareCampus } from '../campus';
import { CampusService } from '../campus.service';
import { AppService } from '../../../../app.service';
import { EavWrapperService } from '../../../../utils/services';
import { ManageCampusComponent } from '../manage-campus/manage-campus.component'
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-prepare-campus',
  templateUrl: './prepare-campus.component.html',
  styleUrls: ['./prepare-campus.component.scss']
})
export class PrepareCampusComponent implements OnInit, OnChanges {
  @Input() prepareComponent; // Check type whether add or edit
  @Input() fileData; // get the file name of updated file
  @ViewChild('prepareCampusForm') prepareCampusForm;

  public formData = new FormData(); // Create a formdata variable to send the uploaded svg file

  public fileUploaded = false; // Maintaining a flag to show the transition and file name according to the file uploaded

  public fileName: string; // Variable to the file name of the uploaded file
  public fileChanged = false;
  public index: number;
  public fileTypeError = false;
  public mode = '';

  // Setting up the config for the custom scroll bar
  public scrollbarOptions = { axis: 'yx', theme: 'minimal-dark', mouseWheel: { enable: true }, contentTouchScroll: 50 };

  // Time being (changed upon API integration)
  public prepareCampus: PrepareCampus = new PrepareCampus({});
  @SessionStorage('subsidiary')
  public subsidiary;

  constructor(
    private storage: LocalStorageService,
    public appService: AppService,
    private campusService: CampusService,
    public eavWrapperService: EavWrapperService,
    public manageCampusComponent: ManageCampusComponent,
    public translate:TranslateService
  ) { }

  // Function to upload the file to formdata and setup variable for API call
  uploadSvgFile(event) {
    this.formData = new FormData();
    const file = event.target.files[0];
    if (event.target.files && file) {
      this.formData.append('fileUpload', file);
      if (file.type !== "image/svg+xml") {
        this.fileTypeError = true;
      }
      else {
        this.fileTypeError = false;
        this.fileName = file.name;
        this.fileUploaded = true;
        this.fileChanged = true;
        this.prepareCampus.campusMap = file.name;
      }
    }
  }

  uploadFileServer(campusData, url) {
    if (this.fileChanged == true) {
      this.campusService.uploadFile('/rsb-oms/oms/fileUpload', this.formData).subscribe(res => {
        campusData.campusMap = res.json().response;
        console.log("campusData2:    ",campusData);
        this.createUpdateCampus(campusData, url);
      },
        (error: any) => {
          // this.snackBar.open('Error occured while Uploading file', 'Ok', {
          //   duration: 5000,
          //   extraClasses: ['error-snackbar']
          // });
        }
      );
    }
    else {
      this.createUpdateCampus(campusData, url);
    }
  }

  evictcache(){

    this.campusService.evictcache(`/rsb-oms/oms/cacheEvict`)
      .subscribe(res => {
        this.manageCampusComponent.getCampusList();
      }, (error: any) => {
       
      });

  }
  createUpdateCampus(campusData, url) {
    // console.log(campusData , "11111111111111111111");
    const campusObject = this.eavWrapperService.jsonToEav(campusData, 'CAMPUS', this.prepareComponent.parentId);
    this.campusService.createUpdateCampus(url, campusObject).subscribe(res => {
      
      this.evictcache();

      this.storage.store('addClicked', false);
     // this.manageCampusComponent.getCampusList();
    },
      (error: any) => {
        // this.snackBar.open(error.message, '', {
        //   duration: 5000,
        //   extraClasses: ['error-snackbar']
        // });
      }
    );
    $("#saveButton").prop('disabled', false);
    $("#cancelButton").prop('disabled', false);
  }

  onSubmit(campusData, prepareCampusForm) {
    $("#saveButton").prop('disabled', true);
    $("#cancelButton").prop('disabled', true);
    let url;
    if (this.prepareComponent.type === 'add') {
      delete campusData.id;
      url = '/rsb-oms/oms/createCampus?Accept-Language='+this.appService.currentLang;
    } else {
      url = '/rsb-oms/oms/updateEntity?Accept-Language='+this.appService.currentLang;

      this.prepareCampus.campusMap = (this.prepareCampus.campusMap == null) ? this.prepareComponent.campusMap : this.prepareCampus.campusMap;
    }
    console.log("campusData:    ",campusData);
    this.uploadFileServer(campusData, url);
  }

  // Function to be  called upon clicking the cancel button
  cancelButton() {
    this.storage.store('addClicked', false);
    this
      .manageCampusComponent
      .getCampusList();
  }

  resetFile() {
    $("#uploadcampusMap").val("");
    this.fileName = '';
    this.fileUploaded = false;
    this.prepareCampus.campusMap = '';
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.prepareComponent) {
      this.prepareCampus = new PrepareCampus(this.prepareComponent.object);
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
