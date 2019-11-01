import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import {AppService} from '../../app.service';


@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  public activeRoute: string;
  public activeClass: string;
  public sideBarData: Array<any> = [];
  constructor(
    private route: ActivatedRoute,
    public router:Router,
    public authenticationService: AuthenticationService,
    public appService:AppService
  ) {
    this.activeRoute = this.route.snapshot.url[0].path;
  }
  getSideBarParam(lang:any) {
    const currentModule = this.route.snapshot.parent.url[1].path;
    this.sideBarData = this.authenticationService.getSideBarContent(currentModule,lang);
  }
  ngOnInit() {
    this.getSideBarParam('en');
    this.appService.currentLangEmit.subscribe(
        (res:any)=>{
            this.getSideBarParam(res);
      }
    )
    switch (this.activeRoute) {
      case 'space':
        this.activeClass = this.activeRoute;
        break;
      case 'dept':
        this.activeClass = this.activeRoute;
        break;
      case 'staff':
        this.activeClass = this.activeRoute;
        break;
      case 'subsadmin':
        this.activeClass=this.activeRoute;
        break;
      default:
        this.activeClass = this.activeRoute;
        break;
    }
  }
  naviagte(data){
    this.router.navigate([data.route])
  }
}
