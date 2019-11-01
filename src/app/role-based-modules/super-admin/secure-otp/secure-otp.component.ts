import {Component, OnInit, ViewChild, ViewChildren, ElementRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {MatDialog, MatDialogRef} from '@angular/material';
import {AuthenticationService} from '../../../common/authentication.service';
import {SessionStorage, LocalStorage} from 'ngx-webstorage';
import {User} from '../../../common/common.interface';
@Component({selector: 'app-secure-otp', templateUrl: './secure-otp.component.html', styleUrls: ['./secure-otp.component.scss']})
export class SecureOtpComponent implements OnInit {

  @ViewChild("otpToVerify")
  private _otpToVerify : ElementRef;

  @SessionStorage('user')
  public loggedInUser;

  @SessionStorage('username')
  public username;

  public one_time_password : string = '';
  public disabled : boolean;

  public otpErrorDisplay : boolean = false;

  constructor(private router : Router, private activatedRoute : ActivatedRoute, private authenticationService : AuthenticationService) {
    this.disabled = true;
  }

  ngOnInit() {}

  ngAfterViewInit() : void {
    this
      ._otpToVerify
      .nativeElement
      .focus();
  }

  checkOTP(newValue, event) {
    this.one_time_password = newValue;
    if (this.one_time_password !== '' && this.one_time_password.length === 4) {
      event.blur()
      this.disabled = true;
      let url = `/rsb-security/security/passCodecheck?passCode=${this
        .one_time_password}&email=${this
        .username
        .toUpperCase()}`;
      this
        .authenticationService
        .authenticateSuperAdminOTP(url)
        .subscribe((data) => {
          if (data !== null) {
            //Success Store the details of the user in session storage
            this.loggedInUser = new User(JSON.parse(data._body));
            this
              .router
              .navigate(['/super-admin/manage']);
          } else {
            // Error

          }
        }, (error) => {
          //Error
          this.otpErrorDisplay = true;
          this.one_time_password = '';
        });
    }
  }

}
