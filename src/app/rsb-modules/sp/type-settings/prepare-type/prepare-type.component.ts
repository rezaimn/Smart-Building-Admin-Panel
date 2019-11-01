import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {TypeSettingsService} from '../type-settings.service';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {TypeModel, TypeModelList} from '../type-settings';


@Component({
    selector: 'app-prepare-role',
    templateUrl: './prepare-type.component.html',
    styleUrls: ['./prepare-type.component.scss']
})
export class PrepareTypeComponent implements OnInit, OnDestroy {
    public scrollbarOptions = {
        axis: 'y',
        theme: 'light-3',
        mouseWheel: {
            enable: true
        },
        contentTouchScroll: 200,
        scrollInertia: 0,
        mouseWheelPixels: 100
    };

    @SessionStorage('subdiaryid')
    public subdiaryid;
    @SessionStorage('prepareTypeComponentOpenCount')
    public prepareTypeComponentOpenCount;
    public mode: string;
    public index: number;
    public entityType;
    public typeList: TypeModelList;
    public submitted: Boolean = false;
    constructor(
        public dialogRef: MatDialogRef<PrepareTypeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private storage: LocalStorageService,
        private typeSettingsService: TypeSettingsService,

        public appService: AppService,
        public translate: TranslateService) {
        this.mode = data.message;
        this.index = data.index;
        this.entityType = data.type;
        dialogRef.disableClose = true;
        this.typeList=new TypeModelList({});
    }

    ngOnInit() {
        this.getAllTypes();
    }


    addNewType() {
        let type:TypeModel=new TypeModel({});
        this.typeList.typeList.push(type);
    }
    getAllTypes(){
        this
            .typeSettingsService
            .getAllTypes('/rsb-oms/oms/'+this.entityType+'/all')
            .subscribe(res => {
                this.typeList.typeList=JSON.parse(res._body);
            }
            )
    }
    addUpdateType(type,index){
        if(type.id==0){
            delete type.id;
        }
        this
            .typeSettingsService
            .addUpdateType('/rsb-oms/oms/'+this.entityType+'/',type)
            .subscribe(res => {
                console.log(this.typeList.typeList[index].id);
                    this.typeList.typeList[index].id=JSON.parse(res._body).id;
                console.log(this.typeList.typeList[index].id);
                }
            )
    }
    ngOnDestroy() {
        this.prepareTypeComponentOpenCount = 0;
        this.storage.store('addClicked', false);
    }

    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }
    deleteType(typeId,index){
        if(typeId==0){
            this.typeList.typeList.splice(index,1);
        }else{
            this
                .typeSettingsService
                .deleteType('/rsb-oms/oms/'+this.entityType+'/'+typeId)
                .subscribe(res => {
                        this.typeList.typeList.splice(index,1);
                    }
                )
        }


    }



}
