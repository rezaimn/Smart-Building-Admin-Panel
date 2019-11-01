import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../../../app.service';
import { PagerComponent } from '../../../pager/pager.component';
import { SessionStorage } from 'ngx-webstorage';
import { Router } from '@angular/router'
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-prepare-specific-area',
  templateUrl: './prepare-specific-area.component.html',
  styleUrls: ['./prepare-specific-area.component.scss']
})
export class PrepareSpecificAreaComponent implements OnInit {
  @SessionStorage('designation')
  public designation;
  public manageAreas: any[] = ['one', 'two'];
  public areaName:string;
  public index:any;
  public mode:any;
  
 
  constructor(public translate:TranslateService,private appService: AppService, private pagerComponent: PagerComponent, private router: Router) { }

  ngOnInit() {
    this.sendHeader();
    this.pagerComponent.changeState('pager', true, '', '');
    this.pagerComponent.changeState('create', false, '', '');
    this.pagerComponent.changeState('close', true, '', '');
    this.pagerComponent.changeState('edit', false, '', '');
    this.pagerComponent.changeState('step', false, 'next policy', '');
  }
  sendHeader(): void {
    // send message to subscribers via observable subject
    if (this.designation) {
      this
        .appService
        .sendHeader(this.designation.designation, 'Dept specific access policy', 'Manage dept specific Policy', '');
    }
  }
  pushSelectedAreasToSelectedGrades(){
//  alert("sucessful");
  }
  saveAreasForParticularDesig() {
 // alert("sucessful");
  }
  onSubmit(){
 // alert("sucessful");
  }
  cancelAssignArea() {
    this
    .router
    .navigate(['/rsb-modules/organization/dept/policies/specific-area/manage']);
  }
}
