import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AppService } from '../../../../app.service';
import {MatDialog} from '@angular/material';
import { LayoutComponent } from '../../../../common';
import { ConfirmModalComponent } from '../../../../common';
import { SubsidiaryListService } from '../subsidiary-list.service';
import { EavWrapperService } from '../../../../utils/services/eav-wrapper.service';
import { SessionStorage } from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-view-subsidiary',
  templateUrl: './view-subsidiary.component.html',
  styleUrls: ['./view-subsidiary.component.scss']
})
export class ViewSubsidiaryComponent implements OnInit {

  @SessionStorage('organization')
  public organization;

  @SessionStorage('subsidiary')
  public subsidiary;

  @SessionStorage('subdiaryId')
  public subdiaryId;

  //public subsidiaries: ManageSubsidiary[] = [];
  public subsidiaries: any;

  constructor(
    public dialog: MatDialog,
    public appService: AppService,
    public layoutComponent: LayoutComponent,
    private subsidiaryListService: SubsidiaryListService,
    private evaWrapper: EavWrapperService,
    public translate:TranslateService
    ) { }

  getSubsidiary() {
    this.subsidiaries = [];
    this
      .subsidiaryListService
      .getSubsidiaryList(`/rsb-oms/oms/getChildEntities?parentId=` + this.organization.id)
      .subscribe(res => {
        if (res.status === 200) {
          let allSubsidiaries = JSON.parse(res._body);
          allSubsidiaries.forEach(subsidiary => {
            let subsidiaryJson = this
              .evaWrapper
              .eavToJson(subsidiary, 'SUBSIDIARY');
            if (subsidiaryJson !== null) {
              this
                .subsidiaries
                .push(subsidiaryJson);
            }
          });
        }
      }, (error: any) => {
        // this
        //   .snackBar
        //   .open('Error occured', 'Ok', {
        //     duration: 5000,
        //     // extraClasses: ['error-snackbar']
        //   });
      });
  }

  // sendHeader(): void {
  //   // Send message to subscribers via observable subject
  //   if (this.organization !== null) {
  //     this
  //       .appService
  //       .sendHeader(this.organization.name, 'subsidairies', 'select Subsidairy', '');
  //   }
  // }
  sendHeaderWithLogo(): void {
    // Send message to subscribers via observable subject
    if (this.organization !== null) {
      this
        .appService
        .sendHeaderWithLogo(this.organization.name, 'subsidairies', 'select Subsidairy', '','../../../../../assets/images/dashboard/VIDEO-CALL-SYSTEM.png');
    }
  }

  storeSubsidiary(subsidiary) {
    this.subdiaryId = subsidiary.id;
    this.subsidiary = subsidiary;
  }

  ngOnInit() {
    this.getSubsidiary();
    this.sendHeaderWithLogo();
    this.updateBreadCrums();
  }

  updateBreadCrums() {
    this.appService.updateBreadCrums('VICS-SUBSIDIARY');
  }

}
