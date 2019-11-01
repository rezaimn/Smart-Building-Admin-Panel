import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {PrepareDepartment} from '../department';
import {DepartmentService} from '../department.service';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-prepare-department',
    templateUrl: './prepare-department.component.html',
    styleUrls: ['./prepare-department.component.scss']
})
export class PrepareDepartmentComponent implements OnInit, OnDestroy {
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

    @SessionStorage('prepareDepartmentComponentOpenCount')
    public prepareDepartmentComponentOpenCount;

    public addAreClicked: Boolean = false;
    public subDeptFlag: Boolean = true;
    public selectedAreas: any = [];
    public mode: string;
    public index: number;
    public prepareDepartment: PrepareDepartment;
    public submitted: Boolean = false;

    constructor(public dialogRef: MatDialogRef<PrepareDepartmentComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private storage: LocalStorageService,
                private departmentService: DepartmentService,
                private eavWrapperService: EavWrapperService,
                public appService:AppService,
                public translate:TranslateService
    ) {
        this.mode = data.message;
        this.index = data.index;
        console.log("eeeeeeeeeeeeeeeeeeeeeeeee",data.department);
        this.prepareDepartment = new PrepareDepartment(data.department);
        console.log("ddddddddddddddddddddddddd",this.prepareDepartment);
        dialogRef.disableClose = true;
    }

    onSubmit() {
        this.submitted = true;
        this.prepareDepartment.subsidiaryId = this.subdiaryid;
        this.prepareDepartment.departmentName=this.prepareDepartment.deptnameMultiLingual.map.en;
        if ((this.mode === 'new') && (this.submitted)) {
            delete this.prepareDepartment.id;
            this.prepareDepartment.areaIds = [];
            this.selectedAreas.forEach(element => {
                this.prepareDepartment.areaIds.push(element.id);
            });
            this
                .departmentService
                .createUpdateDepartment(`/rsb-oms/oms/dept/createDept?Accept-Language=`+this.appService.currentLang, this.prepareDepartment)
                .subscribe((data) => {

                    this
                        .dialogRef
                        .close(true);
                }, (error) => {

                });
        } else if (this.mode === 'edit') {
            this.prepareDepartment.areaIds = [];
            this.selectedAreas.forEach(element => {
            this.prepareDepartment.areaIds.push(element.id);
            });
            this
                .departmentService
                .createUpdateDepartment(`/rsb-oms/oms/dept/updateDept?Accept-Language=`+this.appService.currentLang, this.prepareDepartment)
                .subscribe((data) => {
                    data = JSON.parse(data._body);
                    this.dialogRef.close(true);
                    // let snackref = this.snackBar.open('Department updated successfully', 'Okay', {duration: 3000});
                }, (error) => {
                    // let snackref = this.snackBar.open('There was an error while updating Department', 'Okay', {duration: 3000});
                });
        }
    }

    ngOnInit() {
        if (this.mode === 'edit') {
            this.passSelectedAreaData(this.prepareDepartment.areaIds);
        }
    }

    ngOnDestroy() {
        this.prepareDepartmentComponentOpenCount = 0;
        this.storage.store('addClicked', false);
    }

    expandAddArea() {
        $('#left-elements').addClass('after-slide');
        this.addAreClicked = true;
    }

    closeModal() {
        this
            .dialogRef
            .close();
        this.dialogRef = null;
        this.storage.store('addClicked', false);
    }

    isAreaChoosen(areaId) {
        let areaSelected: boolean = false;
// console.log("llllllllllllllllllllll",this.selectedAreas);
        this.selectedAreas.forEach(element => {
            if (element.id === areaId && areaSelected === false) {
                areaSelected = true;
            }
        });
        return areaSelected;
    }

    passSelectedAreaData(event) {
        Object.keys(event).forEach((key) => {
            let areaSelected = this.isAreaChoosen(event[key].id);
            console.log("seeeeeeeeeeeeeeeeeeeeelecte",event);
            if (!areaSelected) {
                let value = event[key];
                if (value.name === undefined) {
                    event[key].areaNameMultiLingual = event[key].areaNameMultiLingual;
                }
                this.selectedAreas.push(event[key]);
            }
        });
        //console.log("seeeeeeeeeeeeeeeeeeeeelecte",this.selectedAreas);
    }

    //  remove area's on change of area's list
    removeAreas(event, areas, area) {
        this.selectedAreas.splice(areas, 1);
    }

}
