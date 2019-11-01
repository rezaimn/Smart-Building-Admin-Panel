import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../authentication.service';

@Component({selector: 'app-verification', templateUrl: './verification.component.html', styleUrls: ['./verification.component.scss']})
export class VerificationComponent implements OnInit {
  public accessToken : string;
  public username : string;
  public showMsg:boolean;
  public errorMsg:boolean;
  public Msg:string;
  public code:string;
  constructor(private router : Router, private activatedRoute : ActivatedRoute, private authenticationService : AuthenticationService) {}

  ngOnInit() {
    this.accessToken = this.activatedRoute.queryParams['value'].passCode;
    this.username = this.activatedRoute.queryParams['value'].email;
    let securityCheck : any = {
    'passCode' : this.accessToken,
    'email' : this.username
    }
    this
      .authenticationService
      .emailAuthentication(securityCheck)
      .subscribe((data) => {
        if(data !== null){
          this.errorMsg = false;
          this.showMsg = true;
        }
      }, (error) => {
        //Error
        this.showMsg = false;
        this.errorMsg=true;
        this.Msg = error.message;
this.code = error.status;
      });
  }

}
