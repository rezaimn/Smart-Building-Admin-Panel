import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import {SessionStorage, LocalStorageService, LocalStorage, SessionStorageService} from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../app.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @SessionStorage('user')
  public loggedInUser;
    @SessionStorage('roleName')
    public roleName;
  public lightTheme=false;
    profileImage:any;
  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService : LocalStorageService,
    private sessionStorageService : SessionStorageService,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
    public appService:AppService
  ) {
    console.log("++++++++++++++++++++++++++++++++");
    console.log(this.loggedInUser);
  }
  changeLang(lang:any){
      // let currentURL=this.router.url;
      // if(currentURL.includes("lnr")){
          this.translate.use(lang);
          this.appService.currentLang=lang;
          this.appService.currentLangEmit.emit(lang);
          this.translate.get('dir',lang).subscribe(
              (res)=>{
                  const dom: any = document.querySelector('body');
                  if(res=="rtl" &&!dom.classList.contains('rtl-style')){
                      dom.classList.toggle('rtl-style');
                  }
                  if(res=="ltr" &&dom.classList.contains('rtl-style')){
                      dom.classList.toggle('rtl-style');

                  }
              }
          );
      this.translate.get('cal',lang).subscribe(
          (res)=>{
              this.appService.currentCalendar=res;
          }
      )
      // }

  }
  changeTheme(){
      // let currentURL=this.router.url;
      // if(currentURL.includes("lnr")){
          this.appService.lightThemeC=!this.appService.lightThemeC;
          this.appService.lightTheme.emit(this.lightTheme);
          const dom: any = document.querySelector('body');
          dom.classList.toggle('light');
      // }


  }
  // Function to logout the user from the applicaton by clearing his all the session details
  logOut() {
    this.authenticationService.logout('').subscribe(res => {
      if (res.status === 200) {
        this
        .localStorageService
        .clear();
      this
        .sessionStorageService
        .clear();
        this.router.navigate(['/login']);
      }
    },
      (error: any) => {
        // console.log(error);
      }
    );
  }
  ngOnInit() {
    // if (this.loggedInUser.first_name === "" || this.loggedInUser.first_name === null ){
    //   this.router.navigate(['/login']);
    // }
      this.getUserProfilPic();
  }
getUserProfilPic(){
    if (this.loggedInUser.photoUrl!== ''&& this.loggedInUser.photoUrl!== null) {
        this
            .authenticationService
            .getProfilePicture(this.loggedInUser.photoUrl)
            .subscribe(res => {
                const imageData = JSON.parse(res._body).data;
                const contentType = JSON.parse(res._body).contentType;
                const profilePicture = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + imageData);
                this.profileImage = profilePicture;
            }, (error: any) => {
            });
    } else {
        this.profileImage = '../../assets/images/common/avatar.png';
    }
}
}
