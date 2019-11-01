import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AppService } from '../../../../app.service';
import { SessionStorage } from 'ngx-webstorage';
import { ManageDepartment } from '../department';
import { DepartmentService } from '../department.service';
import { EavWrapperService } from '../../../../utils/services/eav-wrapper.service';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { LayoutComponent, ConfirmModalComponent } from '../../../../common';
import { PrepareDepartmentComponent } from '../prepare-department/prepare-department.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-manage-department',
  templateUrl: './manage-department.component.html',
  styleUrls: ['./manage-department.component.scss']
})
export class ManageDepartmentComponent implements OnInit, OnDestroy {

  @SessionStorage('organization')
  public organization;

  @SessionStorage('subsidiary')
  public subsidiary;

  @SessionStorage('subdiaryid')
  public subdiaryid;

  @SessionStorage('department')
  public departments;

  @SessionStorage('prepareDepartmentComponentOpenCount')
  public prepareDepartmentComponentOpenCount;

  @Output() passSelectedAreaData: EventEmitter<any> = new EventEmitter();
  public addClicked = false; // Flag for add/edit to manage navigation
  public manageDepartments: any[] = [];
  public observeClicked: any;
  constructor(
    public appService: AppService,
    private departmentService: DepartmentService,
    private evaWrapper: EavWrapperService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog,
    public layoutComponent: LayoutComponent,
    private activatedRoute: Router,
    public translate:TranslateService) { }

  ngOnDestroy() {
    this.observeClicked.unsubscribe();
  }

  ngOnInit() {
      this.appService.currentLangEmit.subscribe(
          (res: any) => {
              this.sendHeaderWithLogo();
          }
      );
    this.prepareDepartmentComponentOpenCount = 0;
    this.sendHeaderWithLogo();
    this.updateBreadCrums();

    // To change the view from svg to Add/edit screen
    this.getDepartments();

    this.observeClicked = this.localStorageService.observe('addClicked')
      .subscribe((newValueOfAddClicked) => {
        this.addClicked = newValueOfAddClicked;

        if (this.addClicked
          && (this.prepareDepartmentComponentOpenCount === 0 || this.prepareDepartmentComponentOpenCount === null)
          && this.activatedRoute.url === '/rsb-modules/organization/dept/department/manage') {

          if (this.prepareDepartmentComponentOpenCount === null) {
            this.prepareDepartmentComponentOpenCount = 0;
          } else {
            this.prepareDepartmentComponentOpenCount++;
          }
          // this.manageDepartments.length = 0;
          let prepareDepartmentComponentData = {
            "message": "new",
            "index": (this.manageDepartments.length + 1),
            "department": {}
          };
          $('.page-wrapper').addClass('blur-bg');
          const dialogRef = this
            .dialog
            .open(PrepareDepartmentComponent, {
              width: '920px',
              height: 'auto',
              data: prepareDepartmentComponentData
            });
          dialogRef
            .afterClosed()
            .subscribe(result => {
              this.addClicked = false;
              $('.page-wrapper').removeClass('blur-bg');
              if (result) {
                this.getDepartments();
              }
            });
        }
      });
  }

  // sendHeader(): void {
  //   // send message to subscribers via observable subject
  //   if (this.subsidiary !== null) {
  //     this
  //       .appService
  //       .sendHeader(this.subsidiary.name, 'departments', 'MANAGE department', 'add department');
  //   }
  // }
  sendHeaderWithLogo(): void {
    // Send message to subscribers via observable subject
      if (this.subsidiary !== null) {
          let subHeader = '';
          let pageDetails = '';
          let subsidiaryName: '';
          if (this.appService.currentLang == 'en') {
              subsidiaryName = this.subsidiary.name.map.en;
          }
          if (this.appService.currentLang == 'fa') {
              subsidiaryName = this.subsidiary.name.map.fa;
          }
          let routeName='';
          this.translate.get('sub-header.departments', this.appService.currentLang).subscribe(
              (subHeaderT) => {
                  subHeader = subHeaderT;
                  this.translate.get('page-details.manage-department', this.appService.currentLang).subscribe(
                      (pageDetailsT) => {
                          pageDetails = pageDetailsT;

                                  this.translate.get('route-name.add-department', this.appService.currentLang).subscribe(
                                      (routeNameT) => {
                                          routeName=routeNameT;
                                          this
                                              .appService
                                              .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/OMS.png');
                                      }
                                  )


                      }
                  );
              }
          );
      }

  }

  updateBreadCrums() {
    this
      .appService
      .updateBreadCrums('DEPARTMENT');
  }

  getDepartments() {
    this.manageDepartments = [];
    this
      .departmentService
      .getDepartmentList(`/rsb-oms/oms/dept/getDeptBySubsidiary?subsidiaryId=` + this.subdiaryid+`&Accept-Language=`+this.appService.currentLang )
      .subscribe(res => {
        if (res.status === 200) {
          this.manageDepartments = JSON.parse(res._body);
          console.log("PPPPPPPPPPPPPPPPPPPPP",this.manageDepartments);
        }
      }, (error: any) => {
      });
  }

  prepareDepartment(message, index, department) {
      console.log("PPPPPPPPPPPPPPPPPPPP2",this.manageDepartments);
    //this.passSelectedAreaData.emit(department.areas);
     console.log("+++++++++++++++++++++++++++=",this.manageDepartments[index-1]);
     // department.deptNameMultiLingual=department.deptnameMultiLingual;
    let prepareDepartmentComponentData = {
      'message': message,
      'index': index,
      'department': department,
      // 'deptId': deptId
    };

    this
      .layoutComponent
      .addClass();

    const dialogRef = this
      .dialog
      .open(PrepareDepartmentComponent, {
        width: '920px',
        height: 'auto',
        data: prepareDepartmentComponentData
      });
    dialogRef
      .afterClosed()
      .subscribe(result => {
        this
          .layoutComponent
          .removeClass();
        if (result)
          this.getDepartments();
      });
  }

  deleteDepartment(id) {
    let deleteUrl = '/rsb-oms/oms/dept/deleteDept?deptId=' + id;
    this
      .layoutComponent
      .addClass();
    const dialogRef = this
      .dialog
      .open(ConfirmModalComponent, {
        width: '640px',
        height: 'auto',
        data: deleteUrl
      });

    dialogRef
      .afterClosed()
      .subscribe(result => {
        this
          .layoutComponent
          .removeClass();
        this.getDepartments();
      });
  }

  // store Department
  storeDepartment(deptObj) {
    this.departments = deptObj;
  }

}
