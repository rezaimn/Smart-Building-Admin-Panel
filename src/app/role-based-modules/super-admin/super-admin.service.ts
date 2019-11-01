import { Injectable } from '@angular/core';

import { Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { SessionStorage, LocalStorage } from 'ngx-webstorage';

import { HttpService } from '../../utils/services/http.service';

@Injectable()
export class SuperAdminService {

  @SessionStorage('user')
  public loggedInUser;

  constructor(private httpService: HttpService ) {
  }

  getOrganizationData() : Observable<any> {
    return this
      .httpService.get(`/rsb-oms/oms/getOrg?orgId=`+this.loggedInUser.org_id)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateOrganizationData(data: any) : Observable<any> {
    return this
      .httpService
      .post('/rsb-oms/oms/updateEntity', data)
      .map((res : Response) => res.json())
      .catch((error : any) => Observable.throw(error.json().error || 'Server error'));
  }

  createOnMAdmin(data: any) : Observable<any> {
    return this
      .httpService
      .post('/rsb-security/register', data)
      .map((res : Response) => res.json())
      .catch((error : any) => Observable.throw(error.json().error || 'Server error'));
  }

  updateOnMAdmin(data: any) : Observable<any> {
    return this
      .httpService
      .post('/rsb-security/security/profileUpdate', data)
      .map((res : Response) => res.json())
      .catch((error : any) => Observable.throw(error.json().error || 'Server error'));
  }

  getAllOnMAdmins(){
    return this
      .httpService
      .get('/rsb-security/security/getOMSAdmins', {})
      .map((res : Response) => res)
      .catch((error : any) => Observable.throw(error || 'Server error'));
  }
}
