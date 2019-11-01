import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {AuthenticationService} from '../authentication.service';
import {Login} from './login';
import {User} from '../common.interface';
import {EavWrapperService} from '../../utils/services/eav-wrapper.service';
//import Stomp from 'stompjs';
//import SockJS from 'sockjs-client';
import {environment} from '../../../environments/environment';
import {AppService} from '../../app.service';
import {HttpService} from '../../utils/services/http.service';
import {SpacesModel} from '../../rsb-modules/sp/space-management/space-settings/spaces.model';

@Component({selector: 'app-login', templateUrl: './login.component.html', styleUrls: ['./login.component.scss']})
export class LoginComponent implements OnInit {

    public loadURL: string; // Loading the source file path for the background image
    public loginData: Login = new Login({}); // Creating an instance of Login Model to store the value
    public loader: boolean; // variable to check the current status of the background image loader animation
    public msg: string;

    public loginClicked: boolean = false;

    @SessionStorage('user')
    public loggedInUser;
    @SessionStorage('spacesAvailability')
    public spacesAvailability;
    @SessionStorage('userPermissions')
    public userPermissions;

    @SessionStorage('organization')
    public organization;

    @SessionStorage('username')
    public username;
    @SessionStorage('roleName')
    public roleName;
    public progressBar: any;
    public elem: any;
    public width: any;
    public id: any;

    public stompClient: any;
    private serverUrl = environment.wsUrl; //'https://appdev.mitoconnect.com/gs-guide-websocket';

    @ViewChild('alertBox') private alertElement: ElementRef;

    constructor(public appService: AppService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private authenticationService: AuthenticationService,
                public eavWrapperService: EavWrapperService,
                private localStorageService: LocalStorageService,
                private sessionStorageService: SessionStorageService,
                private http: HttpService
    ) {
        // this.loggedInUser = null; this.organization = null;
        this
            .localStorageService
            .clear();
        this
            .sessionStorageService
            .clear();
        //   window.onpopstate = function (e) {
        //     console.log(router.url);
        //     if (router.url == '/login'){
        //      // console.log("hellloooomam");
        //     }else{
        //      // console.log('came here');
        //       window.history.go(-1);
        //     }
        //
        //   }
    }

    ngOnInit() {



        this.loadURL = '../../assets/images/bg.png';
    }

    // Function for changing the backgroung image src path dynamically using time
    // interval call
    loadImg() {
        this.loader = true;
        this.myFunction();
        // this.loadURL = "../../assets/images/loader/bg_img_0.png"; let i = 0; const
        // self = this; const setIntervalPointer = setInterval(function () {   if (i <=
        // 10) {     self.loadURL = '../../assets/images/loader/bg_img_' + i + '.png';
        // i++;   } else {     let defaultRoute = self       .authenticationService
        // .getMyRoute();     self       .router       .navigate([defaultRoute]);
        // clearInterval(setIntervalPointer);   } }, 1000);
    }

    loginUser() {
        let loginData = {
            'loginUsername': this
                .loginData
                .username
                .trim()
                .toUpperCase(),
            'loginPassword': this.loginData.password
        }
        this.username = this
            .loginData
            .username
            .trim();

        this.loginClicked = true;
        this
            .authenticationService
            .login(loginData)
            .subscribe((data) => {

                this.loginClicked = false;
                if (data !== null) { //Success Store the details of the user in session storage
                    this.loggedInUser = new
                    User(data);
                    this.getUserPermissions();

                    if (this.loggedInUser.org_id !== 0) {
                       this.getOrganization();
                    }
                    this.loadImg();
                }
            }, (error) => {
                this.loginClicked = false;
                this.userPermissions = [];

                if (error === 'Http Status 442') {
                    this
                        .router
                        .navigate(['/reset-password']);
                } else {
                    this.msg = 'Invalid Crendentials';
                    $('#errorBox')
                        .fadeIn(200)
                        .delay(3000)
                        .fadeOut(1000);
                }
            });
    }
    getOrganization(){
        this
            .authenticationService
            .getOrganizationData()
            .subscribe((data) => {
                let jsonObject = this
                    .eavWrapperService
                    .eavToJson(data, 'ORGANIZATION');
                this.organization = jsonObject;
                this.getSpaces();
            });
    }
    getUserPermissions(){
        this
            .authenticationService
            .getUserPermissions('/rsb-security/security/authz/permission/permissionForUser?userId=' + this.loggedInUser.user_id)
            .subscribe((res) => {
                    let permissionsT = res;
                    let modules = [];
                    if (permissionsT != []) {
                        this.roleName = permissionsT[0].role.roleName;
                        for (let module of permissionsT[0].modules) {
                            let screens = [];
                            for (let screen of module.module.screens) {
                                if (screen.permission.access != 2) {
                                    screens.push(screen);
                                }
                            }
                            module.module.screens = screens;
                            modules.push(module);
                        }
                    }
                    this.userPermissions = modules;
                }
            );
    }
    getSpaces() {
        this.http.get('/rsb-oms/oms/space/' + this.organization.id + '/settings/')
            .subscribe(res => {

                    let spaceTemp=JSON.parse(res._body);
                    this.spacesAvailability=spaceTemp;
                    console.log(this.spacesAvailability);
                }
            )
    }
    sendEmail() {
        if (this.loginData.username.length > 0) {
            this.http.post('/rsb-security/forgotpassword?loginUsername=' + this.loginData.username, '').subscribe(res => {
            });
        } else {
          //  alert('please insert username to get an email !')
        }
    }

    myFunction() {
        const self = this;
        setTimeout(function () {
            self.progressBar = document.getElementById('myProgress');
            self.progressBar.style.display = 'block';
            self.elem = document.getElementById('myBar');
            self.width = 1;
            self.id = setInterval(function () {
                if (self.width >= 100) {
                    clearInterval(self.id);
                } else {
                    self.width += Math.floor((Math.random() * 15) + 1);
                    let percentage = document.getElementById('percentage');
                    if (self.width >= 100) {
                        self.width = 100;
                        let defaultRoute = self
                            .authenticationService
                            .getMyRoute();
                        self
                            .router
                            .navigate([defaultRoute]);
                    }
                    percentage.innerHTML = self.width + '%';
                    self.elem.style.width = self.width + '%';
                }

            }, 1000);
        }, 1000);
    }
}