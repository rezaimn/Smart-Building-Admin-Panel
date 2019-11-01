import { Component, OnInit } from '@angular/core';
import { SessionStorage } from 'ngx-webstorage';
import { AppService } from '../../../../../../app.service';
import { PagerComponent } from '../../../pager/pager.component';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-manage-specific-area',
  templateUrl: './manage-specific-area.component.html',
  styleUrls: ['./manage-specific-area.component.scss']
})
export class ManageSpecificAreaComponent implements OnInit {
  @SessionStorage('designation')
  public designation;
  public commonAresGroupsArray: Array<any> = ['one', 'two'];
  constructor(public translate:TranslateService,private appService: AppService,
    private pagerComponent: PagerComponent, private router: Router ) { }

  ngOnInit() {
    this.sendHeaderWithLogo();
    this.pagerComponent.changeState('pager', true, '', '');
    this.pagerComponent.changeState('create', false, '', '');
    this.pagerComponent.changeState('close', true, '', '');
    this.pagerComponent.changeState('edit', true, '', '/rsb-modules/organization/dept/policies/specific-area/prepare');
    this.pagerComponent.changeState('step', true, 'next policy', '/rsb-modules/organization/dept/policies/grade/manage');
    // /rsb-modules/organization/dept/policies/specific-area/prepare
  }

  // sendHeader(): void {
  //   // send message to subscribers via observable subject
  //   if (this.designation) {
  //     this
  //       .appService
  //       .sendHeader(this.designation.designation, 'Dept specific access policy', 'Manage dept specific Policy', '');
  //   }
  // }
  sendHeaderWithLogo(): void {
    // Send message to subscribers via observable subject
    if (this.designation) {
      this
        .appService
        .sendHeaderWithLogo(this.designation.designation, 'Dept specific access policy', 'Manage dept specific Policy', '','../../../../../assets/images/dashboard/OMS.png');
    }
  }
}
