import {EventEmitter, Injectable} from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs/Subject';
import { HttpService } from './utils/services/http.service';
import { BreadCrum, SearchData } from './common/common.interface';
import { SessionStorage } from 'ngx-webstorage';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class AppService {
    @SessionStorage('spacesAvailability')
    public spacesAvailability;

    currentLang='en';
    currentCalendar="gregorian";
    public lightTheme=new EventEmitter<any>();
    public lightThemeC=false;
    public currentLangEmit=new EventEmitter<any>();
    showSuccess(message:any) {
        this.toastr.success(message);
    }
    showFail(message:any) {
        this.toastr.error(message);
    }
    spaceIsAvailable(spaceT){
        for(let space of this.spacesAvailability.spaceSettingsList){
            if(spaceT==space.spaceType){
               // console.log(space.available,"eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                return space.available;
            }
        }
    }

    generalExceptions(errorNO:any){
      switch(errorNO){
          case '2':{
              this.translate.get('PE-error-messages.name-already-exist',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )

            break;
          }
          case '3':{
              this.translate.get('PE-error-messages.data-does-not-exist',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '4':{
              this.translate.get('PE-error-messages.start-date-is-invalid',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '5':{
              this.translate.get('PE-error-messages.end-date-is-invalid',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '6':{
              this.translate.get('PE-error-messages.start-time-is-invalid',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '7':{
              this.translate.get('PE-error-messages.start-time-is-invalid',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '8':{
              this.translate.get('PE-error-messages.smart-scenario-already-configured-for-this-input-device',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '9':{
              this.translate.get('PE-error-messages.is-repeating-multiple-times-as-output-device',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '10':{
              this.translate.get('PE-error-messages.not-a-valid-input-device-type-is-selected',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '11':{
              this.translate.get('PE-error-messages.name-already-exist',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '12':{
              this.translate.get('PE-error-messages.input-and-output-device-should-not-be-same',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '13':{
              this.translate.get('PE-error-messages.voucher-number-should-be-unique',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '14':{
              this.translate.get('PE-error-messages.two-menus-should-be-possible-for-the-same-date',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '15':{
              this.translate.get('PE-error-messages.if-system-code-exists-while-inserting-recourse-configuration',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '16':{
              this.translate.get('PE-error-messages.device-frequency-and-schedule-is-for-device-type',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          // case 17:{
          //     this.toastr.error('"FILE NAME" DOES NOT EXIST AT "FULL PATH".');
          //     break;
          // }
          // case 18:{
          //     this.toastr.error('UNABLE TO CONNECT TO SERVICE "FULL URL"');
          //     break;
          // }
          case '19':{
              this.translate.get('PE-error-messages.unable-to-read-data-from-ozw-server',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '20':{
              this.translate.get('PE-error-messages.this-date-is-already-added-as-holiday',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
          case '21':{
              this.translate.get('PE-error-messages.alert-list-configuration-already-exist-for-this-device',this.currentLang).subscribe(
                  (message)=> {
                      this.toastr.error(message);
                  }
              )
              break;
          }
      }
    }
  @SessionStorage('userPermissions')
  public userPermissions;

  @SessionStorage('subsidiary')
  public subsidiary;

  @SessionStorage('campus')
  public campus;

  @SessionStorage('structure')
  public structure;

  @SessionStorage('level')
  public level;

  @SessionStorage('search-module')
  public searchModule;

  public subject = new Subject<any>();

  public deptSubject = new Subject<any>();

  public breadCrums = new Subject<any>();

  public parentUrl = new Subject<any>();

  public globalSearchSubject = new Subject<any>();
  public deviceData=new EventEmitter<any>();
  public layout_height=0;
  constructor( private toastr: ToastrService, private translate: TranslateService) {
      }

  // Common service function created to pass th header value to sub header
  // component
  sendHeaderH(header: string, subHeader: string, pageDetail: string, routeName: string,  secrouteName: string) {



    this
      .subject
      .next({ header: header, routeName: routeName, subHeader: subHeader, pageDetail: pageDetail, secpageDetail: secrouteName });
  }

  sendHeader(header: string, subHeader: string, pageDetail: string, routeName: string) {



    this
      .subject
      .next({ header: header, routeName: routeName, subHeader: subHeader, pageDetail: pageDetail });
  }

  sendHeaderWithLogo(header: any, subHeader: any, pageDetail: any, routeName: string, logoUrl: string) {



    this
      .subject
      .next({ header: header, routeName: routeName, subHeader: subHeader, pageDetail: pageDetail, logoUrl: logoUrl });
  }

  sendHeaderWithLogoH(header: string, subHeader: string, pageDetail: string, routeName: string,  secrouteName: string,logoUrl: string) {



    this
      .subject
      .next({ header: header, routeName: routeName, subHeader: subHeader, pageDetail: pageDetail, secpageDetail: secrouteName,logoUrl: logoUrl });
  }

  // getCounter(url: any): Observable<any> {
  //   return this
  //     .httpService
  //     .getPe(url)
  //     .map((res: Response) => res)
  //     .catch((error: any) => Observable.throw(error || 'Server error'));
  // }




  // sendHeader(header: string, subHeader: string, pageDetail: string, routeName: string, secrouteName: string) {



  //   this
  //     .subject
  //     .next({ header: header, routeName: routeName, subHeader: subHeader, pageDetail: pageDetail });
  // }


  // Method for updating the bread crums in th footer component
  updateBreadCrums(screen: string) {

    let crums: BreadCrum[] = [];

    let routeResponse: any = {};

    routeResponse = this.getRoutes(screen);
    routeResponse.crums[0].link="/dashboard";
    this
      .breadCrums
      .next({ crums: routeResponse.crums });

    this
      .parentUrl
      .next({ url: routeResponse.url });
  }

  reinitializeGlobalSearch(whichModule: string, searchData: any) {
    let searchList: SearchData[] = [];

    this.searchModule = whichModule;

    if (whichModule === 'CAMPUS') {
      searchData.forEach(data => {
        let droplet = {
          id: data['id'],
          content: data['campusName']
        };
        searchList.push(new SearchData(droplet));
      });
    } else if (whichModule === 'SUBSIDIARY') {
      searchData.forEach(data => {
        let droplet = {
          id: data['id'],
          content: data['name']
        };
        searchList.push(new SearchData(droplet));
      });
    }
    this
      .globalSearchSubject
      .next({ data: searchList });
  }

  getRoutes(whichScreen: string) {


    let crums: BreadCrum[] = [];
    let parentUrl = '/dashboard';
    if (whichScreen === 'SUBSIDIARY') {
      crums.push(new BreadCrum('oms', this.parentUrl)); // oms route link removed
    } else if (whichScreen === 'CAMPUS' || whichScreen === 'DEPARTMENT' || whichScreen === 'ADMIN' || whichScreen === 'STAFF') {
      crums.push(new BreadCrum('oms', this.parentUrl)); // oms route link removed
      crums.push(new BreadCrum('subsidiary', '/rsb-modules/organization/space/subsidiary/manage'));
      parentUrl = '/rsb-modules/organization/space/subsidiary/manage';
    } else if (whichScreen === 'STRUCTURE') {
      crums.push(new BreadCrum('oms', this.parentUrl)); // oms route link removed
      crums.push(new BreadCrum('subsidiary', '/rsb-modules/organization/space/subsidiary/manage'));
      crums.push(new BreadCrum('campus', '/rsb-modules/organization/space/campus/manage'));
      parentUrl = '/rsb-modules/organization/space/campus/manage';
    } else if (whichScreen === 'ROLE') {
        crums.push(new BreadCrum('oms', this.parentUrl)); // oms route link removed
        crums.push(new BreadCrum('subsidiary', '/rsb-modules/organization/space/subsidiary/manage'));
        parentUrl = '/rsb-modules/organization/space/subsidiary/manage';
    }else if (whichScreen === 'LEVEL') {
      crums.push(new BreadCrum('oms', this.parentUrl)); // oms route link removed
      crums.push(new BreadCrum('subsidiary', '/rsb-modules/organization/space/subsidiary/manage'));
      crums.push(new BreadCrum('campus', '/rsb-modules/organization/space/campus/manage'));
      crums.push(new BreadCrum('structure', '/rsb-modules/organization/space/structure/manage'));
      parentUrl = '/rsb-modules/organization/space/structure/manage';
    } else if (whichScreen === 'AREA') {
      crums.push(new BreadCrum('oms', this.parentUrl)); // oms route link removed
      crums.push(new BreadCrum('subsidiary', '/rsb-modules/organization/space/subsidiary/manage'));
      crums.push(new BreadCrum('campus', '/rsb-modules/organization/space/campus/manage'));
      crums.push(new BreadCrum('structure', '/rsb-modules/organization/space/structure/manage'));
      crums.push(new BreadCrum('level', '/rsb-modules/organization/space/level/manage'));
      parentUrl = '/rsb-modules/organization/space/level/manage';
    } else if (whichScreen === 'EMS-SUBSIDIARY-LIST') {
      crums.push(new BreadCrum('ELEMENT MANAGEMENT', this.parentUrl));
    } else if (whichScreen === 'EMS-SUBSIDIARY-IP' || whichScreen === 'EMS-STATUS-VIEW') {
      crums.push(new BreadCrum('ELEMENT MANAGEMENT', this.parentUrl));
      crums.push(new BreadCrum('SUBSIDIARY', '/rsb-modules/elements/subsidiary/subsidiary-list/view-all'));
      parentUrl = '/rsb-modules/elements/subsidiary/subsidiary-list/view-all';
    }
      else if (whichScreen === 'SIPAAS-SUBSIDIARY-LIST') {
      crums.push(new BreadCrum('SAM', ''));
    }


      else if (whichScreen === 'SUBDEPARTMENT') {
      crums.push(new BreadCrum('oms', this.parentUrl)); // oms route link removed
      crums.push(new BreadCrum('subsidiary', '/rsb-modules/organization/space/subsidiary/manage'));
      crums.push(new BreadCrum('department', '/rsb-modules/organization/dept/department/manage'));
      parentUrl = '/rsb-modules/organization/dept/department/manage';
    } else if (whichScreen === 'DESIGNATIONS') {
      crums.push(new BreadCrum('oms', this.parentUrl)); // oms route link removed
      crums.push(new BreadCrum('subsidiary', '/rsb-modules/organization/space/subsidiary/manage'));
      crums.push(new BreadCrum('department', '/rsb-modules/organization/dept/department/manage'));
      crums.push(new BreadCrum('sub-department', '/rsb-modules/organization/dept/subdepartment/manage'));
      parentUrl = '/rsb-modules/organization/dept/subdepartment/manage';
    } else if (whichScreen === 'POLICY') {
      crums.push(new BreadCrum('oms', this.parentUrl)); // oms route link removed
      crums.push(new BreadCrum('subsidiary', '/rsb-modules/organization/space/subsidiary/manage'));
      crums.push(new BreadCrum('department', '/rsb-modules/organization/dept/department/manage'));
      crums.push(new BreadCrum('sub-department', '/rsb-modules/organization/dept/subdepartment/manage'));
      crums.push(new BreadCrum('designation', '/rsb-modules/organization/dept/designation/manage'));
      parentUrl = '/rsb-modules/organization/dept/designation/manage';
    } else if (whichScreen === 'WORKTIME') {
      crums.push(new BreadCrum('oms', this.parentUrl)); // oms route link removed
      crums.push(new BreadCrum('subsidiary', '/rsb-modules/organization/space/subsidiary/manage'));
      crums.push(new BreadCrum('department', '/rsb-modules/organization/dept/department/manage'));
      crums.push(new BreadCrum('sub-department', '/rsb-modules/organization/dept/subdepartment/manage'));
      crums.push(new BreadCrum('designation', '/rsb-modules/organization/dept/designation/manage'));
      crums.push(new BreadCrum('policy', '/rsb-modules/organization/dept/policies/allpolicies'));
      parentUrl = '/rsb-modules/organization/dept/policies/work-time/manage';
    } else if (whichScreen === 'GRADES') {
      crums.push(new BreadCrum('oms', this.parentUrl)); // oms route link removed
      crums.push(new BreadCrum('subsidiary', '/rsb-modules/organization/space/subsidiary/manage'));
      crums.push(new BreadCrum('department', '/rsb-modules/organization/dept/department/manage'));
      crums.push(new BreadCrum('sub-department', '/rsb-modules/organization/dept/subdepartment/manage'));
      crums.push(new BreadCrum('designation', '/rsb-modules/organization/dept/designation/manage'));
      crums.push(new BreadCrum('policy', '/rsb-modules/organization/dept/policies/allpolicies'));
      parentUrl = '/rsb-modules/organization/dept/policies/grade/manage';
    } else if (whichScreen === 'ALLOWANCE') {
      crums.push(new BreadCrum('oms', this.parentUrl)); // oms route link removed
      crums.push(new BreadCrum('subsidiary', '/rsb-modules/organization/space/subsidiary/manage'));
      crums.push(new BreadCrum('department', '/rsb-modules/organization/dept/department/manage'));
      crums.push(new BreadCrum('sub-department', '/rsb-modules/organization/dept/subdepartment/manage'));
      crums.push(new BreadCrum('designation', '/rsb-modules/organization/dept/designation/manage'));
      crums.push(new BreadCrum('policy', '/rsb-modules/organization/dept/policies/allpolicies'));
      parentUrl = '/rsb-modules/organization/dept/policies/allowance/manage';
    }else if (whichScreen === 'SPMS-SUBSIDIARY') {
        crums.push(new BreadCrum('SPMS', this.parentUrl));
    } else if (whichScreen === 'SPMS-MANAGEMENT' || whichScreen === 'SPMS-VIEW') {
      crums.push(new BreadCrum('PARKING MANAGEMENT', this.parentUrl));
      crums.push(new BreadCrum('SUBSIDIARY', '/rsb-modules/spms/subsidiary/subsidiary-list/view-all'));
      parentUrl = '/rsb-modules/spms/subsidiary/subsidiary-list/view-all';
    }
    else if (whichScreen === 'SK-MANAGEMENT-LIST') {
      crums.push(new BreadCrum('SK MANAGEMENT', this.parentUrl));

    }
    else if (whichScreen === 'SK-MANAGEMENT') {
      crums.push(new BreadCrum('SK MANAGEMENT', this.parentUrl));
      crums.push(new BreadCrum('SUBSIDIARY', '/rsb-modules/sk/subsidiary/subsidiary-list/view-all'));
      parentUrl = '/rsb-modules/sk/subsidiary/subsidiary-list/view-all';

      parentUrl = '/rsb-modules/sk/subsidiary/subsidiary-list/view-all';
    }
    else if (whichScreen === 'SA-MANAGEMENT') {
      crums.push(new BreadCrum('SPAS', this.parentUrl));
      crums.push(new BreadCrum('SUBSIDIARY', '/rsb-modules/spas/subsidiary/subsidiary-list/view-all'));
      parentUrl = '/rsb-modules/spas/subsidiary/subsidiary-list/view-all';
    }
    else if (whichScreen === 'SA-MANAGEMENT-LIST') {
      crums.push(new BreadCrum('SPAS', this.parentUrl));


    }else if (whichScreen === 'SEMS-SUBSIDIARY') {
        crums.push(new BreadCrum('SMART ENERGY MANAGEMENT', this.parentUrl));
    } else if (whichScreen === 'SEMS-SUBSIDIARY-IP' || whichScreen === 'SEMS-VIEW') {
        crums.push(new BreadCrum('SMART ENERGY MANAGEMENT', this.parentUrl));
        crums.push(new BreadCrum('SUBSIDIARY', '/rsb-modules/sems/subsidiary/subsidiary-list/view-all'));
        parentUrl = '/rsb-modules/sems/subsidiary/subsidiary-list/view-all';
    }
    else if (whichScreen === 'SFMS-SUBSIDIARY') {
        crums.push(new BreadCrum('SMART SAFETY MANAGEMENT', this.parentUrl));
        parentUrl = '/rsb-modules/sfms/subsidiary/subsidiary-list/view-all';
    } else if (whichScreen === 'SFMS-SUBSIDIARY-IP' || whichScreen === 'SFMS-VIEW') {
        crums.push(new BreadCrum('SMART SAFETY MANAGEMENT',  this.parentUrl));
        crums.push(new BreadCrum('SUBSIDIARY', '/rsb-modules/sfms/subsidiary/subsidiary-list/view-all'));
        parentUrl = '/rsb-modules/sfms/subsidiary/subsidiary-list/view-all';
    }
    else if (whichScreen === 'ALMS-SUBSIDIARY') {
      crums.push(new BreadCrum('ALMS', this.parentUrl));
  } else if (whichScreen === 'ALMS-SUBSIDIARY-IP' || whichScreen === 'ALMS-VIEW') {
      crums.push(new BreadCrum('ALMS', this.parentUrl));
      crums.push(new BreadCrum('SUBSIDIARY', '/rsb-modules/alms/subsidiary/subsidiary-list/view-all'));
      parentUrl = '/rsb-modules/alms/subsidiary/subsidiary-list/view-all';
  }
    else if (whichScreen === 'SSMS-SUBSIDIARY') {
      crums.push(new BreadCrum('SSMS', this.parentUrl));
  } else if (whichScreen === 'SSMS-SUBSIDIARY-IP' || whichScreen === 'SSMS-VIEW') {
      crums.push(new BreadCrum('SSMS', this.parentUrl));
      crums.push(new BreadCrum('SUBSIDIARY', '/rsb-modules/ssms/subsidiary/subsidiary-list/view-all'));
      parentUrl = '/rsb-modules/ssms/subsidiary/subsidiary-list/view-all';
  }
    else if (whichScreen === 'AMS-SUBSIDIARY') {
      crums.push(new BreadCrum('AMS', this.parentUrl));
  } else if (whichScreen === 'AMS-SUBSIDIARY-IP' || whichScreen === 'AMS-VIEW') {
      crums.push(new BreadCrum('AMS', this.parentUrl));
      crums.push(new BreadCrum('SUBSIDIARY', '/rsb-modules/ams/subsidiary/subsidiary-list/view-all'));
      parentUrl = '/rsb-modules/ams/subsidiary/subsidiary-list/view-all';
  }
    else if (whichScreen === 'HOMS-SUBSIDIARY') {
      crums.push(new BreadCrum('HOMS', this.parentUrl));
  } else if (whichScreen === 'HOMS-SUBSIDIARY-IP' || whichScreen === 'HOMS-VIEW') {
      crums.push(new BreadCrum('HOMS', this.parentUrl));
      crums.push(new BreadCrum('SUBSIDIARY', '/rsb-modules/homs/subsidiary/subsidiary-list/view-all'));
      parentUrl = '/rsb-modules/homs/subsidiary/subsidiary-list/view-all';
  }
  else if (whichScreen === 'VICS-SUBSIDIARY') {
    crums.push(new BreadCrum('VICS', this.parentUrl));
} else if (whichScreen === 'VICS-SUBSIDIARY-IP' || whichScreen === 'VICS-VIEW') {
    crums.push(new BreadCrum('VICS', this.parentUrl));
   // crums.push(new BreadCrum('SUBSIDIARY', '/rsb-modules/vics/subsidiary/subsidiary-list/view-all'));
    //parentUrl = '/rsb-modules/vics/subsidiary/subsidiary-list/view-all';
}
else if (whichScreen === 'LNR-SUBSIDIARY') {
  crums.push(new BreadCrum('LNR', this.parentUrl));
} else if (whichScreen === 'LNR-SUBSIDIARY-IP' || whichScreen === 'LNR-VIEW') {
  crums.push(new BreadCrum('LNR', this.parentUrl));
  crums.push(new BreadCrum('SUBSIDIARY', '/rsb-modules/lnr/subsidiary/subsidiary-list/view-all'));
  parentUrl = '/rsb-modules/lnr/subsidiary/subsidiary-list/view-all';
}
  else if (whichScreen === 'SP-SUBSIDIARY') {
    crums.push(new BreadCrum('SP', this.parentUrl));
} else if (whichScreen === 'SP-SUBSIDIARY-IP' || whichScreen === 'SP-VIEW') {

    crums.push(new BreadCrum('SP', '/rsb-modules/sp/database/database-list/view-all'));
    parentUrl = '/rsb-modules/sp/database/database-list/view-all';
}


    else {
      crums.push(new BreadCrum('dashboard', this.parentUrl));
    }


    return { crums: crums, url: parentUrl };
  }



    hasAccessToWrite(moduleId, screenId) {
        for(let module of this.userPermissions){
            if(module.module.id==moduleId){
                for(let screen of module.module.screens){
                    if(screen.screen.id==screenId && screen.permission.access==0){
                        return true;
                    }
                }

            }
        }
        return false;
    }
}
