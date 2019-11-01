import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router'
import { AuthenticationService } from '../authentication.service';
import { SessionStorage } from 'ngx-webstorage';
import {AppService} from '../../app.service';

@Component({ selector: 'app-layout', templateUrl: './layout.component.html', styleUrls: ['./layout.component.scss'] })
export class LayoutComponent implements OnInit {

  public toggleMenu:boolean; 
  public loadURL : string;
  public winHeight : any;
  public headerHeight : any;
  public subHeaderHeight : any;
  public footerHeight: any;
  public componentHeight : any;
  public removeLayoutFrame:boolean=false;

  @SessionStorage('user')
  public loggedInUser;


  public scrollbarOptions = {
    axis: 'y',
    theme: 'minimal-dark',
    mouseWheel: {
      enable: true
    },
    contentTouchScroll: 200,
    scrollInertia: 0,
    mouseWheelPixels: 300
  };
  @ViewChild('pageWrapper') public pageWrapper: ElementRef;
@ViewChild('mainPanel') public mainPanel : ElementRef;

  // public hideFooter: boolean = false;

  constructor(
    public elementRef: ElementRef,
    private route: ActivatedRoute,
    public authenticationService: AuthenticationService,
    private appService:AppService) { }

  ngOnInit() {
    this.setHeight();
    // Load Background URL
    this.loadURL = '../../assets/images/loader/bg_img_10.png';
    if (this.route.snapshot.url[1].path === 'subsidiary' ||
      this.route.snapshot.url[1].path === 'subsidiary-list') {
      this.toggleMenu = false;
    } else {
      this.toggleMenu = true;
    }

    // if(this.route.snapshot.url[0].path==='config' || this.route.snapshot.url[0].path=='status'){
    //   this.removeLayoutFrame=true;
    // }
    // this.hideFooter = this.authenticationService.isEMSScreen(this.route.snapshot.url[1].path);
  }

  // Function to add the class to blur the background upon popup
  public addClass(): void {
    this.pageWrapper.nativeElement.className += ' blur-bg';
  }

  // Function to remove the class upon closing of the Popup window
  public removeClass(): void {
    this.pageWrapper.nativeElement.className = 'page-wrapper';
  }
  setHeight() {
    
    this.winHeight = window.innerHeight;
    this.headerHeight = document.getElementsByClassName('logo-wrapper')[0].clientHeight;
    this.subHeaderHeight = document.getElementsByClassName('sub-header-wrapper')[0].clientHeight;
    this.footerHeight = document.getElementsByClassName('footer')[0].clientHeight;
    this.componentHeight = this.winHeight - (this.headerHeight + this.subHeaderHeight + this.footerHeight);
    // let finalHeight = (this.componentHeight) + 'px';
    let finalComponentHeight = (this.componentHeight-36) + 'px';
    // let screenHeight = `--screen-height: ${finalHeight};
                        //--component-height: ${finalComponentHeight};`;
      this.appService.layout_height=this.componentHeight-40;
    this
.mainPanel
      .nativeElement
.setAttribute('style', 'height:' + finalComponentHeight);
    

  }
  @HostListener('window:resize')
    onResize() {
      this.setHeight();
    }
}
