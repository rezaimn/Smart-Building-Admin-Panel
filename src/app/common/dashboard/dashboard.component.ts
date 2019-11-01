import {DatePipe} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {AppService} from '../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {EavWrapperService} from '../../utils/services/eav-wrapper.service';
declare var jquery: any;
declare var $: any;

/**
 * @class DashboardComponent
 * @classdesc
 * DashboardComponent is mainly concentrated on the Dashboard page which user come across after successfull login.
 * The user is able to select the various modules which he wants work on (For ex: OMS, EMS etc.,)
 * @var dashboard is a model which contains the various module that need to shown to the user based upon the
 * role.
 * @author senthil.kumaran
 **/

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [
        trigger('depthSlide', [
            transition('void => *', [
                query('.new-anim', style({
                    opacity: 0,
                    transform: 'translateX(-40px) scale3d(0,0,0) rotate3d(0, 1, 0, 2turn) ',
                    filter: 'blur(50px)'
                })),

                query('.new-anim', stagger('100ms',
                    animate('400ms 1s ease-out', style({
                        opacity: 1,
                        transform: 'translateX(0) scale3d(1,1,1) rotate3d(0, 0, 0, 1turn) ',
                        filter: 'blur(0)'
                    }))))


            ])
        ])
    ]
})
export class DashboardComponent implements OnInit {
    public loadURL: string;
    public winHeight: any;
    public headerHeight: any;
    public footerHeight: any;
    public wrapperHeight: any;
    public notHover: boolean = true;
    public selectedModule = '';
    public modulePng: any;
    public moduleHeader: any;
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
    @SessionStorage('isLoading')
    public isLoading: boolean = false;
    @SessionStorage('spacesAvailability')
    public spacesAvailability;
    public id: any = '';
    public name: any = '';
    public manager: any = '';
    public dept: any = '';
    public super: any = '';
    public external: any = '';
    public starttime: any = '';
    public endtime: any = '';
    public proImage: any = '';
    public atten: any = '';
    public leav: any = '';

    public lsdate: any = '';
    public ledate: any = '';
    public ldays: any = '';
    public ltype: any = '';
    public lstatus: any = '';

    public dayu: any = '';
    public dayl: any = '';

    public leavObj: any =[];
    public timesheetObj: any = '';
    @SessionStorage('subsidiary')
    public subsidiary;
    @SessionStorage('subdiaryId')
    public subdiaryId;
    public subsidiaries: any;
    @SessionStorage('organization')
    public organization;
    @SessionStorage('user')
    public loggedInUser;

    @SessionStorage('userPermissions')
    public userPermissions;

    @ViewChild('dashboardWrap') public dashboardWrap: ElementRef;
    public designationName: any;

    constructor(private authenticationService: AuthenticationService, public appService: AppService, public translate: TranslateService,
                private sanitizer: DomSanitizer,
                private datePipe: DatePipe,
                private router: Router,
                private evaWrapper: EavWrapperService,
                private sessionStorageService: SessionStorageService) {
        this.designationName = this.loggedInUser.designationName;
        console.log('09829890214710957215', this.loggedInUser);

    }

    ngOnInit() {
        this.loadURL = '../../assets/images/loader/bg_img_10.png';
        // Calling the function to get the various notification count
        // this.getNotificationCount();
        this.setHeight();
        this.getPolicy();
        this.getLeav();
        this.getTimesheet();
        this.getCount();
        this.translate.get('dashboard.main-dashboard', this.appService.currentLang).subscribe(
            (res) => {
                this.moduleHeader=res;
            }
        )
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.translate.get('dashboard.main-dashboard', res).subscribe(
                    (res) => {
                        this.moduleHeader=res;
                    }
                )
            }
        )
        this.modulePng = '../../../assets/images/mitologo.png';
        // this.resetThemeAndLang();
    }
    getSubsidiary() {
        this.subsidiaries = [];
        this
            .authenticationService
            .getSubsidiaryList(`/rsb-oms/oms/getChildEntities?parentId=` + this.organization.id+`&Accept-Language=`+this.appService.currentLang)
            .subscribe(res => {
                if (res.status === 200) {
                    let allSubsidiaries = JSON.parse(res._body);
                    allSubsidiaries.forEach(subsidiary => {
                        let subsidiaryJson = this
                            .evaWrapper
                            .eavToJson(subsidiary, 'SUBSIDIARY');
                        if (subsidiaryJson !== null) {
                            this
                                .subsidiaries
                                .push(subsidiaryJson);
                        }
                    });
                    this.subdiaryId = this.subsidiaries[0].id;
                    this.subsidiary = this.subsidiaries[0];
                }
            }, (error: any) => {

            });
    }
    //
    isSubsidiaryAvalable(){
        for(let space of this.spacesAvailability.spaceSettingsList){
            if(space.spaceType=='SUBSIDIARY'){
                return space.available;
            }
        }
    }
    dashboardClick(module:string){

        this.isLoading=true;
        if(!this.isSubsidiaryAvalable()) {
            this.getSubsidiary();
        }
        switch (module){
            case 'OMS':{
                this.router.navigate(["/rsb-modules/organization/space/subsidiary/manage"]);
                break;
            }
            case 'EMS':{
                if(this.isSubsidiaryAvalable()){
                    this.router.navigate(["/rsb-modules/elements/subsidiary/subsidiary-list/view-all"]);
                }else {
                    this.redirectToPage('elements');
                }

                break;
            }
            case 'SPAS':{
                if(this.isSubsidiaryAvalable()){
                    this.router.navigate(["/rsb-modules/spas/subsidiary/subsidiary-list/view-all"]);
                }else {
                    this.redirectToPage('spas');
                }

                break;
            }
            case 'ALMS':{
                if(this.isSubsidiaryAvalable()){
                    this.router.navigate(["/rsb-modules/alms/subsidiary/subsidiary-list/view-all"]);
                }else {
                    this.redirectToPage('alms');
                }

                break;
            }
            case 'AMS':{
                if(this.isSubsidiaryAvalable()){
                    this.router.navigate(["/rsb-modules/ams/subsidiary/subsidiary-list/view-all"]);
                }else {
                    this.redirectToPage('ams');
                }

                break;
            }
            case 'SPMS':{
                if(this.isSubsidiaryAvalable()){
                    this.router.navigate(["/rsb-modules/spms/subsidiary/subsidiary-list/view-all"]);
                }else {
                    this.redirectToPage('spms');
                }

                break;
            }
            case 'SSMS':{
                if(this.isSubsidiaryAvalable()){
                    this.router.navigate(["/rsb-modules/ssms/subsidiary/subsidiary-list/view-all"]);
                }else {
                    this.redirectToPage('ssms');
                }

                break;
            }
            case 'SFMS':{
                if(this.isSubsidiaryAvalable()){
                    this.router.navigate(["/rsb-modules/sfms/subsidiary/subsidiary-list/view-all"]);
                }else {
                    this.redirectToPage('sfms');
                }

                break;
            }
            case 'SEMS':{
                if(this.isSubsidiaryAvalable()){
                    this.router.navigate(["/rsb-modules/sems/subsidiary/subsidiary-list/view-all"]);
                }else {
                    this.redirectToPage('sems');
                }

                break;
            }
            case 'VICS':{

                this.router.navigate(["/rsb-modules/vics/video-call/call/view-all"]);
                break;
            }
            case 'HOMS':{
                if(this.isSubsidiaryAvalable()){
                    this.router.navigate(["/rsb-modules/homs/subsidiary/subsidiary-list/view-all"]);
                }else {
                    this.redirectToPage('homs');
                }

                break;
            }
            case 'SK':{
                if(this.isSubsidiaryAvalable()){
                    this.router.navigate(["/rsb-modules/sk/subsidiary/subsidiary-list/view-all"]);
                }else {
                    this.redirectToPage('sk');
                }

                break;
            }
            case 'LNR':{
                if(this.isSubsidiaryAvalable()){
                    this.router.navigate(["/rsb-modules/lnr/subsidiary/subsidiary-list/view-all"]);
                }else {
                    this.redirectToPage('lnr');
                }
                break;
            }
        }

    }
    getCount() {
        this
            .authenticationService
            .getCount('/AMS/GetLeaveEligibilityByType?employeeid=' + this.loggedInUser.employeeId + '&typeid=1')
            .subscribe(res => {
                // const imageData = JSON.parse(res._body);
                console.log(res);
                this.dayu = res;

            }, (error: any) => {
            });

        this
            .authenticationService
            .getCount('/AMS/GetLeaveEligibilityByType?employeeid=' + this.loggedInUser.staff_id + '&typeid=2')
            .subscribe(res => {
                // const imageData = JSON.parse(res._body);
                console.log(res);
                this.dayl = res;
            }, (error: any) => {
            });
    }

    getTimesheet() {

        var today = new Date();
        var firstday = new Date(today);
        var lastday = new Date(today);

        firstday.setDate(today.getDate() - 1);
        // firstday = this.datePipe.transform(firstday, "dd/MM/yyyy");
        lastday.setDate(today.getDate() - 6);
        //lastday = this.datePipe.transform(lastday, "dd/MM/yyyy");

        var dd = firstday.getDate();
        var mm = firstday.getMonth() + 1;
        var yyyy = firstday.getFullYear();
        var ddsr;
        var mmsr;
        if (dd < 10) {
            ddsr = '0' + dd;
        }
        if (mm < 10) {
            mmsr = '0' + mm;
        }

        var firstdaysr = ddsr + '/' + mmsr + '/' + yyyy;

        dd = lastday.getDate();
        mm = lastday.getMonth() + 1;
        yyyy = lastday.getFullYear();
        if (dd < 10) {
            ddsr = '0' + dd;
        }
        if (mm < 10) {
            mmsr = '0' + mm;
        }

        var lastdaysr = ddsr + '/' + mmsr + '/' + yyyy;


        let dat = {

            fromdate: '01/03/2018',
            todate: '07/03/2018',
            employeeid: this.loggedInUser.staff_id

        };

        this
            .authenticationService
            .getTimesheet(dat)
            .subscribe(res => {
                // const imageData = JSON.parse(res._body);
                console.log(res);
                let len = res.records.length;
                this.timesheetObj = res.records;
                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                for (let i = 0; i < this.timesheetObj.length; i++) {
                    var todayTime = this.timesheetObj[i].timesheetdate;
                    var res = todayTime.split('/');
                    var month = res[1];
                    var day = res[0];
                    var year = res[2];
                    var d = new Date(month + '/' + day + '/' + year);
                    var dayName = days[d.getDay()];
                    this.timesheetObj[i]['day'] = dayName;
                }


            }, (error: any) => {
            });

    }


    getLeav() {

        var curr = new Date;
        var first = curr.getDate() - curr.getDay();
        var last = first + 6;
        var firstday = new Date(curr.setDate(first)).toUTCString();
        firstday = this.datePipe.transform(firstday, 'dd/MM/yyyy');
        var lastday = new Date(curr.setDate(last)).toUTCString();
        lastday = this.datePipe.transform(lastday, 'dd/MM/yyyy');

        console.log(firstday);
        console.log(lastday);

        let dat = {

            fromdate: firstday,
            todate: lastday,
            employeeid: this.loggedInUser.staff_id,
            pagination: {page: 1, records: 5}

        };
        this
            .authenticationService
            .getleave(dat)
            .subscribe(res => {
                //const imageData = JSON.parse(res._body);
                console.log(res);
                //  const allStaffs = JSON.parse(res._body);

                let len = res.records.length;

                this.leavObj = res.records;

                console.log(this.leavObj);
                if(this.leavObj.length>0){
                    this.lsdate = this.leavObj[len - 1].leavefrom;
                    this.lsdate = this.lsdate.substr(0, this.lsdate.indexOf(' '));
                    this.ledate = this.leavObj[len - 1].leaveto;
                    this.ledate = this.ledate.substr(0, this.ledate.indexOf(' '));
                    this.ldays = this.leavObj[len - 1].leavedays;
                    this.ltype = this.leavObj[len - 1].leavetype;
                    this.lstatus = this.leavObj[len - 1].leavestatus;
                }

            }, (error: any) => {
            });
    }

    getPolicy() {
        if (this.loggedInUser.staff_id > 0) {
            this
                .authenticationService
                .getPolicyDetails(this.loggedInUser.staff_id)
                .subscribe(res => {

                    let bod = JSON.parse(res._body);
                    console.log(bod);
                    this.id = this.loggedInUser.staff_id;
                    this.dept = bod.department;
                    this.name = this.loggedInUser.first_name;
                    this.endtime = bod.workEndTime;
                    this.starttime = bod.workStartTime;
                    this.super = this.loggedInUser.supervisorName;
                    this.manager = this.loggedInUser.managerName;
                    console.log(this.id);
                    console.log(this.name);
                    if (this.loggedInUser.phtoId !== '') {
                        this
                            .authenticationService
                            .getProfilePicture(this.loggedInUser.photoUrl)
                            .subscribe(res => {
                                const imageData = JSON.parse(res._body).data;
                                const contentType = JSON.parse(res._body).contentType;
                                const profilePicture = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + imageData);
                                this.proImage = profilePicture;
                            }, (error: any) => {
                            });
                    } else {
                        this.proImage = '../../../../../assets/images/Profile_Pic.png';
                    }


                }, (error: any) => {
                    // console.log(error);
                });
        }


    }

    setHeight() {
        this.winHeight = window.innerHeight;
        this.headerHeight = document.getElementsByClassName('logo-wrapper')[0].clientHeight;
        this.footerHeight = document.getElementsByClassName('footer')[0].clientHeight;
        this.wrapperHeight = this.winHeight - (this.headerHeight + this.footerHeight)
        this.wrapperHeight = this.wrapperHeight-35 + 'px';
        this
            .dashboardWrap
            .nativeElement
            .setAttribute('style', 'height:' + this.wrapperHeight);
    }
    @HostListener('window:resize')
    onResize() {
        this.setHeight();
    }
    onHover(module: any) {
        this.translate.get('dashboard.'+module, this.appService.currentLang).subscribe(
            (res) => {
                this.moduleHeader=res;
            }
        )
        switch (module) {
            case 'ALMS': {
                this.modulePng = '../../../assets/images/dashboard/ALERT-MANAGEMENT-SYSTEM.png';
                break;
            }
            case 'AMS': {
                this.modulePng = '../../../assets/images/dashboard/AMS.png';
                break;
            }
            case 'EMS': {
                this.modulePng = '../../../assets/images/dashboard/INDOOR-SURVEILLANCE-SYSTEM.png';
                break;
            }
            case 'HOMS': {
                this.modulePng = '../../../assets/images/dashboard/HOSPITALITY-MANAGEMENT-SYSTEM.png';
                break;
            }
            case 'LNR': {
                this.modulePng = '../../../assets/images/dashboard/LOGGING-AND-REPORTING.png';
                break;
            }
            case 'OMS': {
                this.modulePng = '../../../assets/images/dashboard/OMS.png';
                break;
            }
            case 'SEMS': {
                this.modulePng = '../../../assets/images/dashboard/SMART-ENERGY-SAVING-SYSTEM.png';
                break;
            }
            case 'SFMS': {
                this.modulePng = '../../../assets/images/dashboard/EMS.png';
                break;
            }
            case 'SK': {
                this.modulePng = '../../../assets/images/dashboard/SIGNAGES-AND-KIOSKS.png';
                break;
            }
            case 'SP': {
                this.modulePng = '../../../assets/images/dashboard/SETTING-PANEL.png';
                break;
            }
            case 'SPAS': {
                this.modulePng = '../../../assets/images/dashboard/SMART_PHYSICAL_ACCESS_SYSTEM.png';
                break;
            }
            case 'SPMS': {
                this.modulePng = '../../../assets/images/dashboard/SMART-PARKING-SYSTEM.png';
                break;
            }
            case 'SSMS': {
                this.modulePng = '../../../assets/images/dashboard/SMART-SECURITY-SYSTEM.png';
                break;
            }
            case 'VICS': {
                this.modulePng = '../../../assets/images/dashboard/VIDEO-CALL-SYSTEM.png';
                break;
            }
        }
        this.selectedModule = module;
    }
    offHover() {
        this.modulePng = '../../../assets/images/mitologo.png';
        this.translate.get('dashboard.main-dashboard', this.appService.currentLang).subscribe(
            (res) => {
                this.moduleHeader=res;
            }
        )
        this.selectedModule = '';
    }
    redirectToPage(type){
        this.isLoading=true;
        let sideBarData = this.authenticationService.getSideBarContent(type,this.appService.currentLang);
        if(sideBarData.length>0){
            this.router.navigate([sideBarData[0].route])
        }
    }

    userHasAccessToModule(moduleId){
        for(let module of this.userPermissions){
            if(module.module.id==moduleId){
                for(let screen of module.module.screens){
                    if(screen.permission.access!=2){
                        return true;
                    }
                }

            }
        }

        return false;
    }
}
