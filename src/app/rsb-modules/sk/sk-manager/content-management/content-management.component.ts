import {Component} from '@angular/core';
import {AppService} from '../../../../app.service';

import {SessionStorage, SessionStorageService} from 'ngx-webstorage';

import {MasterDataService} from '../../../../utils/services/master-data.service';
import {ConfirmModalComponent, LayoutComponent} from '../../../../common';
import {MatDialog} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {SkService} from '../../sk.service';
import {ErrorMessageService} from '../../../../error-message-service';


@Component({
    selector: 'sk-content-management',
    templateUrl: './content-management.component.html',
    styleUrls: ['./content-management.component.scss']
})
export class ContentManagementComponent {
    public selectedCampusId: any = 0;
    public selectedBuildingId: any = 0;
    public selectedFloorId: any = 0;
    public addClicked = false;
    public fileName = '';
    public fileType = '';
    public fileSize: any;
    public isLoading: boolean = false;
    public fileTypeError = false;
    @SessionStorage('subdiaryId')
    public subdiaryId;
    @SessionStorage('subsidiary')
    public subsidiary;
    public filesList=[];
    constructor(
        public appService: AppService,
        public  dialog: MatDialog,
        public translate: TranslateService,
        public  layoutComponent: LayoutComponent,
        public sessionStorageService: SessionStorageService,
        public masterDataService: MasterDataService,
        public skService: SkService,
        public errorService:ErrorMessageService
    ) {
    }
    ngOnInit() {
        this.getAllSKFiles();
        this.sendHeaderWithLogo();
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )
    }
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        let subHeader = '';
        let pageDetails = '';
        let subsidiaryName: '';
        let routeName = '';
        if (this.appService.currentLang == 'en') {
            subsidiaryName = this.subsidiary.name.map.en;
        }
        if (this.appService.currentLang == 'fa') {
            subsidiaryName = this.subsidiary.name.map.fa;
        }
        this.translate.get('sub-header.sk-management', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.add-disable-enable-sk', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;
                        this
                            .appService
                            .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/SIGNAGES-AND-KIOSKS.png');
                    }
                );
            }
        );
    }
    downloadFile(file){
        this.skService.downloadFile('/rsb-oms/oms/downloadFile/'+file.id).subscribe(
            (res )=> {
                // let filename = file.filename;
                // // filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
                //
                // let fileBlob = res.blob();
                // let blob = new Blob([fileBlob], {
                //     type: 'application/pdf' // must match the Accept type
                // });
                //FileSaver.saveAs(blob, filename);
            }
        )
    }
    uploadSKFile(event) {

       let formData:FormData = new FormData();
        const file = event.target.files[0];
        if ( file) {
            formData.append('file',file );
            if (!file.type.includes('video/')&&!file.type.includes('audio/')&&!file.type.includes('image/') && !file.type.includes('ppt/')) {
                this.fileTypeError = true;
                this.errorService.translateErrors('999',null);
            }
            else {
                this.fileType = file.type;
                this.fileSize = file.size;
                this.fileTypeError = false;
                this.fileName = file.name;

                this.skService.uploadSKFile('/rsb-oms/oms/skFileUpload',formData).subscribe(
                    (res )=> {
                        console.log(res);
                        this.getAllSKFiles();
                    },
                    (error: any) => {
                        // this.snackBar.open('Error occured while Uploading file', 'Ok', {
                        //   duration: 5000,
                        //   extraClasses: ['error-snackbar']
                        // });
                    }
                );
            }
        }
    }
    getAllSKFiles(){
        this.skService.getAllSKFiles('/rsb-oms/oms/getFilesInfo?type=SkUploadFile').subscribe(
            (res )=> {
                this.filesList=JSON.parse(res._body).files;
            },
            (error: any) => {
                // this.snackBar.open('Error occured while Uploading file', 'Ok', {
                //   duration: 5000,
                //   extraClasses: ['error-snackbar']
                // });
            }
        );
    }
    deleteFile(fileId) {
        //   //console.log();
        let deleteUrl = "/rsb-oms/oms/deleteFile/"+fileId;

        this.layoutComponent.addClass();

        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '640px',
            height: 'auto',
            data: deleteUrl
        });

        dialogRef.afterClosed().subscribe(result => {
            this.layoutComponent.removeClass();
            // this.getZone();
            this.getAllSKFiles();
        });
    }
}
