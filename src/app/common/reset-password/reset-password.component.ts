import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {SessionStorage} from 'ngx-webstorage';
import {AuthenticationService} from '../authentication.service';
import {EavWrapperService} from '../../utils/services/eav-wrapper.service';

import {ResetPassword} from './reset-password';
@Component({selector: 'app-reset-password', templateUrl: 'reset-password.component.html', styleUrls: ['./reset-password.component.scss']})

export class ResetPasswordComponent implements OnInit {

  loadURL : string; // Loading the source file path for the background image

  @SessionStorage('username')
  public loggedInUser;

  @SessionStorage('user')
  public loggedUser;

  @SessionStorage('organization')
  public organization;

  public resetPasswordData : ResetPassword;
  public passCodeCheck : boolean;

  constructor(private router : Router, private activatedRoute : ActivatedRoute, private authenticationService : AuthenticationService, public eavWrapperService : EavWrapperService) {
    this.resetPasswordData = new ResetPassword({});
  }

  ngOnInit() {
    this.loadURL = "../../assets/images/loader/bg_img_0.png";
    this.resetMailTokenOTP();
  }
  resetMailTokenOTP() {
    let securityObj = {
      "username": this.loggedInUser.trim(),
      "requestParam": {
        "request": "111"
      }
    }
    // reset mail token OTP call this .authenticationService
    // .resetMailToken(securityObj) .subscribe((data) => {   if (data) {     this
    //    .snackBar       .open('Reset OTP sent successfuly to your mail', '',
    // {duration: 2000});   } }, (error) => {   this     .snackBar     .open('OTP
    // not sent to your please check another time', '', {duration: 1000}) })
  }

  resetPassword() {
    let resetPassword = {
      "password": this.resetPasswordData.newPassword,
      "verifyToken": this.resetPasswordData.otp
    }
    this
      .authenticationService
      .resetPassword(resetPassword)
      .subscribe((data) => {
        if (data) {
          this.loggedUser = null;
          let defaultRoute = this
            .authenticationService
            .getMyRoute();
          this
            .router
            .navigate([defaultRoute]);
        }
      }, (error) => {
        $('#errorBox')
          .fadeIn(200)
          .delay(3000)
          .fadeOut(1000);
      })
  }
  // check passcode
  checkPasscode(newPasscode, confPasscode) {
    // debugger
    if (newPasscode !== confPasscode) {
      this.passCodeCheck = true;
    } else {
      this.passCodeCheck = false;
    }
  }
  checkOTPChar(char,ele:HTMLElement){
    if(char.length === 4 ){
      ele.blur()
    }
  }
}
