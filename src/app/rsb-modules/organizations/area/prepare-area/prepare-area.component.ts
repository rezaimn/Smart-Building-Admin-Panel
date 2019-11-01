import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-prepare-area',
  templateUrl: './prepare-area.component.html',
  styleUrls: ['./prepare-area.component.scss']
})
export class PrepareAreaComponent implements OnInit {

  scrollbarOptions = { axis: 'yx', theme: 'minimal-dark', mouseWheel: { enable: true }, contentTouchScroll: 50 };
  constructor( public translate:TranslateService,public appService: AppService) { }

  // sendHeader(): void {
  //   // send message to subscribers via observable subject
  //   this.appService.sendHeader('Floor 1', 'area', 'Add area');
  // }

  ngOnInit() {
    // this.sendHeader();
  }

}
