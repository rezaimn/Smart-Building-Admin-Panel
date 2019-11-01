import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges
} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AppService} from '../../../../../app.service';
import {SessionStorage} from 'ngx-webstorage';
import {PagerComponent} from '../../pager/pager.component';
import {WorkTime, WorkTimeGroup, PolicyGroup} from '../worktime';
import {PoliciesService} from '../../policies.service'
import {elementAt} from 'rxjs/operator/elementAt';
import {TranslateService} from '@ngx-translate/core';
@Component({selector: 'app-manage-work-time', templateUrl: './manage-work-time.component.html', styleUrls: ['./manage-work-time.component.scss']})
export class ManageWorkTimeComponent implements OnInit {
  @SessionStorage('organization')
  public organization;
  @SessionStorage('subsidiary')
  public subsidiary;
  @SessionStorage('designation')
  public designation;
  public firstTimeArray : WorkTime[] = [];
  public manageWorkTime : WorkTime[] = [];
  public workTime : WorkTime = new WorkTime({});
  public workTimeGroup : WorkTimeGroup = new WorkTimeGroup({});
  public policyGroup : any;
  constructor(public translate:TranslateService,private appService : AppService, private pagerComponent : PagerComponent, private policiesService : PoliciesService) {}

  // sendHeader() : void {
  //   // Send message to subscribers via observable subject
  //   if(this.designation) {
  //     this
  //       .appService
  //       .sendHeader(this.designation.designation, 'work time policy', 'manage work time policy', '');
  //   }
  // }
  sendHeaderWithLogo(): void {
    // Send message to subscribers via observable subject
    if (this.designation) {
      this
        .appService
        .sendHeaderWithLogo(this.designation.designation, 'work time policy', 'manage work time policy', '','../../../../../assets/images/dashboard/OMS.png');
    }
  }
updateBreadCrums() {
  this
    .appService
    .updateBreadCrums('WORKTIME');
}

  ngOnInit() {
    this.sendHeaderWithLogo();
this.updateBreadCrums();
    this
      .pagerComponent
      .changeState('pager', true, '', '')
    this
      .pagerComponent
      .changeState('create', true, '', '/rsb-modules/organization/dept/policies/work-time/prepare')
    this
      .pagerComponent
      .changeState('close', true, '', '')
    this
      .pagerComponent
      .changeState('step', true, 'next policy', '/rsb-modules/organization/dept/policies/grade/manage');
    this
      .policiesService
      .getAllWorkTimePolicy(`/rsb-oms/oms/getAllWorkTimePoliciesBySubsidairyId?subsidairyId=` + this.subsidiary.id)
      .subscribe((data) => {
        data = JSON.parse(data._body);
        // console.log(data)
        data.forEach(element => {
          this
            .manageWorkTime
            .push(element)
        })
        console.log(this.manageWorkTime)
        this
          .policiesService
          .getAllWorkTimePolicy(`/rsb-oms/oms/getWorkTimePolicyGroup?subsidairyId=` + this.subsidiary.id + '&designationId=' + this.designation.id)
          .subscribe((data) => {
            let res = JSON.parse(data._body);
            if (res !== null && res !== '') {
              //  this.manageWorkTime =[]; this.manageWorkTime.push(new WorkTime({}));
              console.log(res);

              res
                .workTimeGroupRelation
                .forEach((element, index) => {
                  this
                    .manageWorkTime
                    .forEach((ele, ind) => {
                      if (ele.id == element.workTimePolicy.id) {
                        // this   .manageWorkTime   .push(element.workTimePolicy);
                        this.manageWorkTime[ind] = element.workTimePolicy;
                        this.manageWorkTime[ind].isFirstDefault = element.isDefault;
                        this.manageWorkTime[ind].isFirstAssisgned = element.isAssisgned;
                      }
                    })

                  // this.manageWorkTime[index].isFirstDefault = element.isDefault;
                  // this.manageWorkTime[index].id = element.id;
                });
              console.log(this.manageWorkTime);

            }
          }, (error) => {
            // this
            //   .snackBar
            //   .open('error occured in get policy group', '', {duration: 1000})
          })
      });
  }
  assignWorkTimePolicy(obj : WorkTime, event) {
    let msg;
    if (event.currentTarget.checked) {
      obj.isFirstAssisgned = 1;
      msg = 'staff assgined successfully';
    } else {
      obj.isFirstAssisgned = 0;
      msg = 'staff unassgined successfully';
    }
    this.workTimeGroup.subsidairyId = this.subsidiary.id;
    this.workTimeGroup.designationId = this.designation.id;

    this
      .manageWorkTime
      .forEach((ele, index) => {
        this.policyGroup = new PolicyGroup({});
        if (ele.isFirstAssisgned === 1) {
          if (ele.isFirstDefault === 1) {
            this.policyGroup.isDefault = 1;
          } else {
            this.policyGroup.isDefault = 0;
          }
          this.policyGroup.isAssisgned = 1;
          this.policyGroup.workTimePolicy = ele;
          this
            .workTimeGroup
            .workTimePolicyGroupRelation
            .push(this.policyGroup);
        }
      })
    this
      .policiesService
      .createWorkTimePolicy('/rsb-oms/oms/createWorkTimePolicyGroup', this.workTimeGroup)
      .subscribe((data) => {
        // this
        //   .snackBar
        //   .open(msg, '', {duration: 2000})
      }, (error) => {
        // this
        //   .snackBar
        //   .open('Error occured', '', {duration: 1000})
      })

      this.workTimeGroup=new WorkTimeGroup({});
     // this.workTimeGroup.workTimePolicyGroupRelation.push(new PolicyGroup({}));
  }
  makeDefaultWorkTimePolicy(obj : WorkTime, event) {
    this.workTimeGroup.subsidairyId = this.subsidiary.id;
    this.workTimeGroup.designationId = this.designation.id;
    this.workTimeGroup.workTimePolicyGroupRelation = [];
    this
      .manageWorkTime
      .forEach((ele,ind) => {
        if(obj.id == ele.id){
          ele.isFirstDefault =1;
        }else{
          ele.isFirstDefault =0;
        }
        this.policyGroup = new PolicyGroup({});
        // if (ele.isFirstDefault) {
        //   ele.isFirstDefault = 0;
        // } else {
        //   ele.isFirstDefault = 1;
        // }
        this.policyGroup.isDefault = ele.isFirstDefault;
        this.policyGroup.isAssisgned = ele.isFirstAssisgned;
        this.policyGroup.workTimePolicy = ele;
        this
          .workTimeGroup
          .workTimePolicyGroupRelation
          .push(this.policyGroup);
        // // debugger
      })
    this
      .policiesService
      .createWorkTimePolicy('/rsb-oms/oms/createWorkTimePolicyGroup', this.workTimeGroup)
      .subscribe((data) => {
        // this
        //   .snackBar
        //   .open('marked as default', '', {duration: 2000})
      }, (error) => {
        // this
        //   .snackBar
        //   .open('Error occured', '', {duration: 1000})
      })
this.workTimeGroup = new WorkTimeGroup({});
  }
}

// this.policyGroup = new PolicyGroup({}); if (ele.isFirstDefault) {   if
// (ele.isFirstAssisgned) {     ele.isFirstAssisgned = 1;   } else {
// ele.isFirstAssisgned = 0;   }   ele.isFirstDefault = 0;
// this.policyGroup.isDefault = ele.isFirstDefault; this.policyGroup.isAssisgned
// = ele.isFirstAssisgned; } else { ele.isFirstDefault = 1;
// this.policyGroup.isDefault = ele.isFirstDefault; }
// this.policyGroup.workTimePolicy = ele; this   .workTimeGroup
// .workTimePolicyGroupRelation   .push(this.policyGroup);