import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
  public isClose: boolean;
  public isCreate: boolean;
  public createRoute: string;
  public isEdit: boolean;
  public editRoute: string;
  public isDelete: boolean;
  public isStep: boolean;
  public stepperTxt: string;
  public stepRoute: string;
  public isPager: boolean

  constructor(public translate:TranslateService,private router: Router) { }

  ngOnInit() {
  }
  addGrades() {
    console.log('triggered click');
  }
  changeState(flagName: string, flagState: boolean, flagMsg: string, flagRoute: string) {
    switch (flagName) {
      case 'pager':
        this.isPager = flagState;
        break;
      case 'create':
        this.isCreate = flagState;
        this.createRoute = flagRoute;
        break;
      case 'edit':
        this.isEdit = flagState;
        this.editRoute = flagRoute;
        // this.router.navigate([flagRoute]);
        break;
      case 'delete':
        this.isDelete = flagState;
        break;
      case 'step':
        this.isStep = flagState;
        this.stepperTxt = flagMsg;
        this.stepRoute = flagRoute;
        break;
      case 'close':
        this.isClose = flagState;
        break;
      default:
        this.isCreate = false;
        this.isEdit = false;
        this.isDelete = false;
        this.isStep = false;
        break;
    }
  }
}
