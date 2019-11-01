import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {SessionStorage} from 'ngx-webstorage';
import {HttpService} from '../utils/services/http.service';
import {Http, Response} from '@angular/http';


import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../app.service';

/**
 * @class AuthenticationService
 * @classdesc AuthenticationService is mainly concentrated on the various API call which is related to dashboard
 * component. This contains Get,Post method calling through a common HttpService file for API Interaction.
 * @return Returns the API response obtained from server based upon the status ( Success or failure)
 * @author senthil.kumaran
 **/

@Injectable()
export class AuthenticationService {
    @SessionStorage('userPermissions')
    public userPermissions;

    @SessionStorage('user')
    public loggedInUser;
    @SessionStorage('subsidiary')
    public subsidiary;
    @SessionStorage('subdiaryId')
    public subdiaryId;

    LNRStaff = '';
    LNRJobs = '';
    LNRReport = '';
    LNRAttendance = '';
    LNRDeviceTemper = '';
    LNRAlerts = '';
    LNRSystemLog = '';
    ALMSAlertDashboard = '';
    ALMSAlertManagement = '';
    ALMSTicketManagement = '';
    ALMSNotifications = '';
    EMSDeviceManagement = '';
    EMSConfiguration = '';
    EMSStatusView = '';
    OMSSpaceManagement = '';
    OMSDeptManagement = '';
    OMSStaffManagement = '';
    OMSRoleManagement = '';
    OMSAdminManagement = '';
    SPASAccessCardManagement = '';
    SPASWorkManagement='';
    SPASZoneAccessManagement='';
    SPASAreaAccessManagement='';
    SPASVisitorManagement = '';
    SKContentManagement = '';
    SPMSSmartParkingManagement = '';
    SEMSSmartHVACManagement = '';
    SEMSSmartLightningManagement = '';
    SEMSSmartPlugManagement = '';
    SEMSSmartMeterManagement = '';
    SFMSSafetyDeviceManagement = '';
    SFMSEmergencyManagement = '';
    SSMSSurveillanceManagement = '';
    SSMSSecurityPatrolManagement = '';
    AMSWorkPolicyManagement = '';
    AMSTimeSheetManagement = '';
    AMSLeaveManagement = '';
    AMSHolidayManagement = '';
    HOMSVoucherManagement = '';
    HOMSOrderManagement = '';
    HOMSPlannerManagement = '';
    SPDatabaseConfiguration = '';
    SPDeviceConfiguration = '';
    SPResourceConfiguration = '';
    SPScenarioConfiguration = '';

    constructor(private httpService: HttpService, private http: Http, private translate: TranslateService, public appService: AppService) {
    }

    login(data: any): Observable<any> {
        return this
            .httpService
            .post('/rsb-security/login', data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
    getSubsidiaryList(url: any): Observable<any> {
        return this
            .httpService
            .get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getUserPermissions(url): Observable<any> {

        return this
            .httpService
            .get(url)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getleave(data: any): Observable<any> {
        return this
            .httpService
            .postPe('/AMS/GetEmployeLeavesByDate', data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getTimesheet(data: any): Observable<any> {
        return this
            .httpService
            .postPe('/AMS/GetEmployeTimeSheetsByDate', data)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    storeSubsidiary(subsidiary) {
        this.subdiaryId = subsidiary.id;
        this.subsidiary = subsidiary;
    }

    getOrganizationData(): Observable<any> {
        return this
            .httpService
            .get(`/rsb-oms/oms/getOrg?orgId=${this.loggedInUser.org_id}`)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getCount(url: any): Observable<any> {
        return this
            .httpService
            .getPe(url)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    getMyRoute() {
        if (this.loggedInUser === null) {
            return '/login';
        } else {
            return '/dashboard';
        }
        //     if (this.loggedInUser && this.loggedInUser.user_role === 'SUPER_ADMIN') {
        //     return '/super-role-management/otp';
        // } else if (this.loggedInUser && (this.loggedInUser.user_role === 'GUARD')) {
        //
        //     return '/checklist';
        // }
        // else if (this.loggedInUser && this.loggedInUser.user_role !== 'SUPER_ADMIN') {
        //     return '/dashboard';
        // }
    }

    checkIfGuard() {
        if (this.loggedInUser.roles[0].roleName === 'GUARD') {
            return true;
        }
        else
            return false;
    }


    isEMSScreen(whichScreen) {
        if (whichScreen === 'device-status' || whichScreen === 'deviceZone' || whichScreen === 'ems-manage' || whichScreen === 'ems-devices') {
            return true;
        }
        return false;
    }

    getSideBarContent(type, lang) {
        let sideBarJson = [];

        if (type == 'organization') {
            if (this.hasAccessToScreen(1, 1)) {
                this.translate.get('screens.Space Management', lang).subscribe(
                    (res) => {

                        this.OMSSpaceManagement = res;
                        let element = {
                            'name': this.OMSSpaceManagement,
                            'route': '/rsb-modules/organization/space/campus/manage',
                            'keyCode': 'space'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            // if (this.hasAccessToScreen(1, 2)) {
            //     this.translate.get('screens.Dept Management', lang).subscribe(
            //         (res) => {
            //
            //             this.OMSDeptManagement = res;
            //             let element = {
            //                 'name': this.OMSDeptManagement,
            //                 'route': '/rsb-modules/organization/dept/department/manage',
            //                 'keyCode': 'dept'
            //             }
            //             sideBarJson.push(element);
            //         }
            //     );
            // }
            if (this.hasAccessToScreen(1, 3)) {
                this.translate.get('screens.User Management', lang).subscribe(
                    (res) => {

                        this.OMSStaffManagement = res;
                        let element = {
                            'name': this.OMSStaffManagement,
                            'route': '/rsb-modules/organization/staff/managestaff/manage',
                            'keyCode': 'staff'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(1, 4)) {
                this.translate.get('screens.Role Management', lang).subscribe(
                    (res) => {

                        this.OMSAdminManagement = res;
                        let element = {
                            'name': this.OMSAdminManagement,
                            'route': '/rsb-modules/organization/subsadmin/admins/manage',
                            'keyCode': 'subsadmin'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
        } else if (type == 'elements') {
            //TODO : Changes required in intial route after Device Management  is setup
            if (this.hasAccessToScreen(2, 5)) {
                this.translate.get('screens.Device Management', lang).subscribe(
                    (res) => {

                        this.EMSDeviceManagement = res;
                        let element = {
                            'name': this.EMSDeviceManagement,
                            'route': '/rsb-modules/elements/device/ems-devices/filter',
                            'keyCode': 'device'
                        }
                        sideBarJson.push(element);
                    }
                );
            }

            if (this.hasAccessToScreen(2, 6)) {
                this.translate.get('screens.Configuration', lang).subscribe(
                    (res) => {

                        this.EMSConfiguration = res;
                        let element = {
                            'name': this.EMSConfiguration,
                            'route': 'rsb-modules/elements/config/ems-manage/list',
                            'keyCode': 'config'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(2, 7)) {
                this.translate.get('screens.Status View', lang).subscribe(
                    (res) => {

                        this.EMSStatusView = res;
                        let element = {
                            'name': this.EMSStatusView,
                            'route': '/rsb-modules/elements/status/device-status/manage',
                            'keyCode': 'status'
                        }
                        sideBarJson.push(element);
                    }
                );
            }

        }
        else if (type == 'spas') {
            if (this.hasAccessToScreen(3,  47)) {
                this.translate.get('screens.Access Level Management', lang).subscribe(
                    (res) => {

                        this.SPASAreaAccessManagement = res;
                        let element = {
                            'name': this.SPASAreaAccessManagement,
                            'route': '/rsb-modules/spas/level/level-list/view-all',
                            'keyCode': 'level'
                        }
                        sideBarJson.push(element);
                    }
                );
            }

            if (this.hasAccessToScreen(3,  46)) {
                this.translate.get('screens.Access Group Management', lang).subscribe(
                    (res) => {

                        this.SPASZoneAccessManagement = res;
                        let element = {
                            'name': this.SPASZoneAccessManagement,
                            'route': '/rsb-modules/spas/group/group-list/view-all',
                            'keyCode': 'group'
                        }
                        sideBarJson.push(element);
                    }
                );
            }

            if (this.hasAccessToScreen(3,  10)) {
                this.translate.get('screens.Work Group Management', lang).subscribe(
                    (res) => {

                        this.SPASWorkManagement = res;
                        let element = {
                            'name': this.SPASWorkManagement,
                            'route': '/rsb-modules/spas/work/work-list/view-all',
                            'keyCode': 'work'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(3, 9)) {
                this.translate.get('screens.Visitor Management', lang).subscribe(
                    (res) => {

                        this.SPASVisitorManagement = res;
                        let element = {
                            'name': this.SPASVisitorManagement,
                            'route': '/rsb-modules/spas/visitor/visitor-list/view-all',
                            'keyCode': 'visitor'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(3, 8)) {
                this.translate.get('screens.Card Holder Management', lang).subscribe(
                    (res) => {

                        this.SPASAccessCardManagement = res;
                        let element = {
                            'name': this.SPASAccessCardManagement,
                            'route': '/rsb-modules/spas/staff/staff-list/view-all',
                            'keyCode': 'staff'
                        }
                        sideBarJson.push(element);
                    }
                );
            }

        }
        else if (type == 'sk') {
            if (this.hasAccessToScreen(12, 43)) {
                this.translate.get('side-bar.CONTENT MANAGEMENT', lang).subscribe(
                    (res) => {
                        this.SKContentManagement = res;
                        let element = {
                            'name': this.SKContentManagement,
                            'route': '/rsb-modules/sk/content/content-list/view-all',
                            'keyCode': 'content'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(12, 48)) {
                this.translate.get('side-bar.CONTENT PROGRAMING', lang).subscribe(
                    (res) => {
                        this.SKContentManagement = res;
                        let element = {
                            'name': this.SKContentManagement,
                            'route': '/rsb-modules/sk/programing/programing-list/view-all',
                            'keyCode': 'programing'
                        }
                        sideBarJson.push(element);
                    }
                );
            }

        }
        else if (type == 'spms') {
            if (this.hasAccessToScreen(6, 44)) {
                this.translate.get('side-bar.smart-parking-management', lang).subscribe(
                    (res) => {

                        this.SPMSSmartParkingManagement = res;
                        let element = {
                            'name': this.SPMSSmartParkingManagement,
                            'route': '/rsb-modules/spms/parking/manage-parking/list',
                            'keyCode': 'parking'
                        }
                        sideBarJson.push(element);
                    }
                );
            }

        }
        else if (type == 'sems') {
            if (this.hasAccessToScreen(9, 24)) {
                this.translate.get('screens.Smart HVAC Management', lang).subscribe(
                    (res) => {

                        this.SEMSSmartHVACManagement = res;
                        let element = {
                            'name': this.SEMSSmartHVACManagement,
                            'route': '/rsb-modules/sems/hvac/hvac-list/view-all',
                            'keyCode': 'hvac'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(9, 25)) {
                this.translate.get('screens.Smart Lighting Management', lang).subscribe(
                    (res) => {

                        this.SEMSSmartLightningManagement = res;
                        let element = {
                            'name': this.SEMSSmartLightningManagement,
                            'route': '/rsb-modules/sems/lightning/lightning-list/view-all',
                            'keyCode': 'lightning'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(9, 26)) {
                this.translate.get('screens.Smart Plug Management', lang).subscribe(
                    (res) => {

                        this.SEMSSmartPlugManagement = res;
                        let element = {
                            'name': this.SEMSSmartPlugManagement,
                            'route': '/rsb-modules/sems/plug/plug-list/view-all',
                            'keyCode': 'plug'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            // if (this.hasAccessToScreen(9, 27)) {
            //     this.translate.get('screens.Smart Meter Management', lang).subscribe(
            //         (res) => {
            //             this.SEMSSmartMeterManagement = res;
            //             let element = {
            //                 'name': this.SEMSSmartMeterManagement,
            //                 'route': '/rsb-modules/sems/meter/meter-list/view-all',
            //                 'keyCode': 'meter'
            //             }
            //             sideBarJson.push(element);
            //         }
            //     );
            // }


        } else if (type == 'sfms') {
            if (this.hasAccessToScreen(8, 22)) {
                this.translate.get('screens.Safety Device Management', lang).subscribe(
                    (res) => {

                        this.SFMSSafetyDeviceManagement = res;
                        let element = {
                            'name': this.SFMSSafetyDeviceManagement,
                            'route': '/rsb-modules/sfms/safety/safety-list/view-all',
                            'keyCode': 'safety'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            //if (this.hasAccessToScreen(8, 23)) {
            // this.translate.get('screens.Emergency Management', lang).subscribe(
            //     (res) => {
            //
            //         this.SFMSEmergencyManagement = res;
            //         let element= {
            //             'name': this.SFMSEmergencyManagement,
            //             'route': '/rsb-modules/sfms/emergency/emergency-list/view-all',
            //             'keyCode': 'emergency'
            //         }
            //         sideBarJson.push(element);
            //     }
            // );
            //}

        }
        else if (type == 'alms') {

            // if (this.hasAccessToScreen(4, 11)) {
            //     this.translate.get('screens.Alert Dashboard', lang).subscribe(
            //         (res) => {
            //
            //             this.ALMSAlertDashboard = res;
            //             let element = {
            //                 'name': this.ALMSAlertDashboard,
            //                 'route': '/rsb-modules/alms/alert-dashboard/alert-list/view-all',
            //                 'keyCode': 'alert-dashboard'
            //             }
            //             sideBarJson.push(element);
            //         }
            //     );
            // }
            if (this.hasAccessToScreen(4, 12)) {
                this.translate.get('screens.Alert Management', lang).subscribe(
                    (res) => {

                        this.ALMSAlertManagement = res;
                        let element = {
                            'name': this.ALMSAlertManagement,
                            'route': '/rsb-modules/alms/alert-management/alert-list/manage',
                            'keyCode': 'alert-management'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            // if (this.hasAccessToScreen(4, 13)) {
            //     this.translate.get('screens.Ticket Management', lang).subscribe(
            //         (res) => {
            //
            //             this.ALMSTicketManagement = res;
            //             let element = {
            //                 'name': this.ALMSTicketManagement,
            //                 'route': '/rsb-modules/alms/ticket-management/ticket-list/manage',
            //                 'keyCode': 'ticket-management'
            //             }
            //             sideBarJson.push(element);
            //         }
            //     );
            // }
            // if (this.hasAccessToScreen(4, 14)) {
            //     this.translate.get('screens.Notifications', lang).subscribe(
            //         (res) => {
            //
            //             this.ALMSNotifications = res;
            //             let element = {
            //                 'name': this.ALMSNotifications,
            //                 'route': '/rsb-modules/alms/notification-management/notification-list/manage',
            //                 'keyCode': 'notification-management'
            //             }
            //             sideBarJson.push(element);
            //         }
            //     );
            // }
            if (this.hasAccessToScreen(4, 34)) {
                this.translate.get('screens.Scenario Configuration', lang).subscribe(
                    (res) => {

                        this.SPScenarioConfiguration = res;
                        let element = {
                            'name': this.SPScenarioConfiguration,
                            'route': '/rsb-modules/alms/scenario/device-list/view-all',
                            'keyCode': 'scenario'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(4, 32)) {
                this.translate.get('screens.Device Scheduling', lang).subscribe(
                    (res) => {

                        this.SPDeviceConfiguration = res;
                        let element = {
                            'name': this.SPDeviceConfiguration,
                            'route': '/rsb-modules/alms/device/device-list/view-all',
                            'keyCode': 'device'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
        }
        else if (type == 'ssms') {
            if (this.hasAccessToScreen(7, 19)) {
                this.translate.get('screens.Surveillance Management', lang).subscribe(
                    (res) => {

                        this.SSMSSurveillanceManagement = res;
                        let element = {
                            'name': this.SSMSSurveillanceManagement,
                            'route': '/rsb-modules/ssms/surveillance/surveillance-list/view-all',
                            'keyCode': 'surveillance'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(7, 20)) {
                this.translate.get('screens.Security Patrol Management', lang).subscribe(
                    (res) => {

                        this.SSMSSecurityPatrolManagement = res;
                        let element = {
                            'name': this.SSMSSecurityPatrolManagement,
                            'route': '/rsb-modules/ssms/security/security-list/view-all',
                            'keyCode': 'security'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
        }
        else if (type == 'ams') {
            if (this.hasAccessToScreen(5, 15)) {
                this.translate.get('screens.Work Policy Management', lang).subscribe(
                    (res) => {

                        this.AMSWorkPolicyManagement = res;
                        let element = {
                            'name': this.AMSWorkPolicyManagement,
                            'route': '/rsb-modules/ams/work-policy/work-list/view-all',
                            'keyCode': 'work-policy'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(5, 16)) {
                this.translate.get('screens.Time Sheet Management', lang).subscribe(
                    (res) => {

                        this.AMSTimeSheetManagement = res;
                        let element = {
                            'name': this.AMSTimeSheetManagement,
                            'route': '/rsb-modules/ams/time-sheet/sheet-list/manage',
                            'keyCode': 'time-sheet'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(5, 17)) {
                this.translate.get('screens.Leave Management', lang).subscribe(
                    (res) => {

                        this.AMSLeaveManagement = res;
                        let element = {
                            'name': this.AMSLeaveManagement,
                            'route': '/rsb-modules/ams/leave/leave-list/manage',
                            'keyCode': 'leave'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(5, 18)) {
                this.translate.get('screens.Holiday Management', lang).subscribe(
                    (res) => {

                        this.AMSHolidayManagement = res;
                        let element = {
                            'name': this.AMSHolidayManagement,
                            'route': '/rsb-modules/ams/holiday/holiday-list/view-all',
                            'keyCode': 'holiday'
                        }
                        sideBarJson.push(element);
                    }
                );
            }


        }
        else if (type == 'homs') {
            if (this.hasAccessToScreen(11, 28)) {
                this.translate.get('screens.Voucher Management', lang).subscribe(
                    (res) => {

                        this.HOMSVoucherManagement = res;
                        let element = {
                            'name': this.HOMSVoucherManagement,
                            'route': '/rsb-modules/homs/voucher/voucher-list/view-all',
                            'keyCode': 'voucher'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(11, 29)) {
                this.translate.get('screens.Order Management', lang).subscribe(
                    (res) => {

                        this.HOMSOrderManagement = res;
                        let element = {
                            'name': this.HOMSOrderManagement,
                            'route': '/rsb-modules/homs/order/order-list/view-all',
                            'keyCode': 'order'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(11, 30)) {
                this.translate.get('screens.Planner Management', lang).subscribe(
                    (res) => {

                        this.HOMSPlannerManagement = res;
                        let element = {
                            'name': this.HOMSPlannerManagement,
                            'route': '/rsb-modules/homs/planner/planner-list/view-all',
                            'keyCode': 'planner'
                        }
                        sideBarJson.push(element);
                    }
                );
            }


        }

        else if (type == 'sp') {
            // if (this.hasAccessToScreen(13, 31)) {
            //     this.translate.get('screens.Database Configuration', lang).subscribe(
            //         (res) => {
            //
            //             this.SPDatabaseConfiguration = res;
            //             let element = {
            //                 'name': this.SPDatabaseConfiguration,
            //                 'route': '/rsb-modules/sp/database/database-list/view-all',
            //                 'keyCode': 'database'
            //             }
            //             sideBarJson.push(element);
            //         }
            //     );
            // }

            // if (this.hasAccessToScreen(13, 33)) {
            //     this.translate.get('screens.Resource Configuration', lang).subscribe(
            //         (res) => {
            //
            //             this.SPResourceConfiguration = res;
            //             let element = {
            //                 'name': this.SPResourceConfiguration,
            //                 'route': '/rsb-modules/sp/url/url-list/view-all',
            //                 'keyCode': 'url'
            //             }
            //             sideBarJson.push(element);
            //         }
            //     );
            // }

            if (this.hasAccessToScreen(13, 41)) {
                this.translate.get('screens.Role Settings', lang).subscribe(
                    (res) => {

                        this.OMSRoleManagement = res;
                        let element = {
                            'name': this.OMSRoleManagement,
                            'route': '/rsb-modules/sp/role/role-list/settings',
                            'keyCode': 'role'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(13, 49)) {


                this.translate.get('screens.Space Settings', lang).subscribe(
                    (res) => {

                        this.OMSRoleManagement = res;
                        let element = {
                            'name': this.OMSRoleManagement,
                            'route': '/rsb-modules/sp/space/space-list/settings',
                            'keyCode': 'space'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
            if (this.hasAccessToScreen(13, 50)) {


                this.translate.get('screens.Type Settings', lang).subscribe(
                    (res) => {

                        this.OMSRoleManagement = res;
                        let element = {
                            'name': this.OMSRoleManagement,
                            'route': '/rsb-modules/sp/type/type-list/settings',
                            'keyCode': 'type'
                        }
                        sideBarJson.push(element);
                    }
                );
            }
        } else if (type == 'lnr') {

            if (this.hasAccessToScreen(14, 36)) {
                this.translate.get('screens.Report Management', lang).subscribe(
                    (res) => {
                        this.LNRReport = res;
                        let report = {
                            'name': this.LNRReport,
                            'route': '/rsb-modules/lnr/report-lnr/manage-report/view-all',
                            'keyCode': 'report-lnr'
                        }
                        sideBarJson.push(report);
                    }
                )
            }
            if (this.hasAccessToScreen(14, 2612)) {
                this.translate.get('screens.JOB MANAGEMENT', lang).subscribe(
                    (res) => {
                        this.LNRJobs = res;
                        let job = {
                            'name': this.LNRJobs,
                            'route': '/rsb-modules/lnr/jobs-lnr/jobs-table/view-all',
                            'keyCode': 'jobs-lnr'
                        }
                        sideBarJson.push(job);
                    }
                )
            }
            // if (this.hasAccessToScreen(14, 35)) {
            //     this.translate.get('screens.Staff', lang).subscribe(
            //         (res) => {
            //
            //             this.LNRStaff = res;
            //             let staff = {
            //                 'name': this.LNRStaff,
            //                 'route': '/rsb-modules/lnr/staff-lnr/staff-table/view-all',
            //                 'keyCode': 'staff-lnr'
            //             }
            //             sideBarJson.push(staff);
            //         }
            //     )
            // }
            // if (this.hasAccessToScreen(14, 36)) {
            //     this.translate.get('screens.Leaves', lang).subscribe(
            //         (res) => {
            //             this.LNRLeaves = res;
            //             let leaves = {
            //                 'name': this.LNRLeaves,
            //                 'route': '/rsb-modules/lnr/leaves-lnr/leaves-table/view-all',
            //                 'keyCode': 'leaves-lnr'
            //             }
            //             sideBarJson.push(leaves);
            //         }
            //     )
            // }
            //
            //
            // if (this.hasAccessToScreen(14, 37)) {
            //     this.translate.get('screens.Attendance', lang).subscribe(
            //         (res) => {
            //             this.LNRAttendance = res;
            //             let attendance = {
            //                 'name': this.LNRAttendance,
            //                 'route': '/rsb-modules/lnr/attendance-lnr/attendance-table/view-all',
            //                 'keyCode': 'attendance-lnr'
            //             }
            //             sideBarJson.push(attendance);
            //         }
            //     )
            // }
            // if (this.hasAccessToScreen(14, 38)) {
            //     this.translate.get('screens.Device Temperature', lang).subscribe(
            //         (res) => {
            //             this.LNRDeviceTemper = res;
            //             let device = {
            //                 'name': this.LNRDeviceTemper,
            //                 'route': '/rsb-modules/lnr/device-lnr/device-table/view-all',
            //                 'keyCode': 'device-lnr'
            //             }
            //             sideBarJson.push(device);
            //         }
            //     )
            // }
            // if (this.hasAccessToScreen(14, 39)) {
            //     this.translate.get('screens.Alerts', lang).subscribe(
            //         (res) => {
            //             this.LNRAlerts = res;
            //             let alerts = {
            //                 'name': this.LNRAlerts,
            //                 'route': '/rsb-modules/lnr/report/staff-table/view-all',
            //                 'keyCode': 'report'
            //             }
            //             sideBarJson.push(alerts);
            //         }
            //     )
            // }
            // if (this.hasAccessToScreen(14, 40)) {
            //     this.translate.get('screens.System Log', lang).subscribe(
            //         (res) => {
            //             this.LNRSystemLog = res;
            //             let alerts = {
            //                 'name': this.LNRSystemLog,
            //                 'route': '/rsb-modules/lnr/system-log-lnr/system-log-table/view-all',
            //                 'keyCode': 'system-log-lnr'
            //             }
            //             sideBarJson.push(alerts);
            //         }
            //     )
            // }

        }
        return sideBarJson;
    }

    authenticateSuperAdminOTP(url: string): Observable<any> {
        return this
            .httpService
            .post(url, {})
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    getPolicyDetails(staffId: number) {
        console.log('090909090909090909090');
        return this
            .httpService
            .get(`/rsb-oms/oms/staff/getStaffPolicy?staffId=` + staffId)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    getProfilePicture(pictureId) {
        return this
            .httpService
            .get(`/rsb-oms/oms/getFile/` + pictureId)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }


    // Service function to call Login API
    loginApp(url: any, data: any): Observable<any> {
        return this
            .httpService
            .post(url, data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // Service function to get the Notification count from API
    getNotificationCount(url: any): Observable<any> {
        return this
            .httpService
            .get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // Service function to get the Module detail from API
    getModuleDetail(url: any): Observable<any> {
        return this
            .httpService
            .get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }


    // Service function to send the access token to Server upon logout
    logout(url: any): Observable<any> {
        let data: any;

        return this
            .httpService
            .post('/rsb-security/logout', data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    deleteItem(url: any): Observable<any> {
        return this
            .httpService
            .delete(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    deleteItemPe(url: any): Observable<any> {
        return this
            .httpService
            .deletePe(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    // email Authentication
    emailAuthentication(data: any): Observable<any> {
        return this
            .httpService
            .post(`/rsb-security/security/passCodecheck?passCode=${data.passCode}&email=${data.email}`, {})
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json() || 'Server error'));
    }

    // reset mail token
    resetMailToken(data: any): Observable<any> {
        return this
            .httpService
            .post(`/rsb-security/resetPasswordMailToken?username=${data.username}`, data.requestParam)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    // reset password
    resetPassword(data: any): Observable<any> {
        return this
            .httpService
            .post(`/rsb-security/resetPassword`, data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    //get sensors data
    getSensors(url = '../../../../../assets/data/Floor1.json'): Observable<any> {
        return this
            .http.get(url)
            .map((res) => res.json())
    }


    //get camera data
    getCamera() {
        return this.http.get('../../../../../assets/data/camera.json')
            .map(response => response.json());

    }

    //vics for dashboard
    getAllIncoming(userid: number) {
        // let pager = '';
        // if (size !== 0 && page >= 0) {
        //    pager = `&size=`+size+`&page=`+page
        // }

        return this
            .httpService
            .get(`/rsb-vics/vics/staff/getCalledByMe?userId=` + userid)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    acceptVideoReq(data: any): Observable<any> {
        return this
            .httpService
            .post(`/rsb-vics/vics/staff/acceptVideoRequest`, data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    ///rsb-vics/vics/staff/rejectVideoRequest

    rejectVideoReq(data: any): Observable<any> {
        return this
            .httpService
            .post(`/rsb-vics/vics/staff/rejectVideoRequest`, data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    getOutgoinReq(userid: number) {
        // let pager = '';
        // if (size !== 0 && page >= 0) {
        //    pager = `&size=`+size+`&page=`+page
        // }

        return this
            .httpService
            .get(`/rsb-vics/vics/staff/getCallsByMe?userId=` + userid)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    hasAccessToScreen(moduleId, screenId) {
        for(let module of this.userPermissions){
            if(module.module.id==moduleId){
                for(let screen of module.module.screens){
                    if(screen.screen.id==screenId && screen.permission.access!=2){
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
