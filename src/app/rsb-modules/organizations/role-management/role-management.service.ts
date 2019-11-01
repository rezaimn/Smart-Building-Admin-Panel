import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class RoleManagementService {

  @SessionStorage('subsidiary')
  public subsidiary;

  constructor(private httpService: HttpService) { }

    attachStaffToRole(url: any,body): Observable<any> {
        return this
            .httpService
            .post(url,body)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getAllRoleModulesPermissionList(url: any): Observable<any> {
        return this
            .httpService
            .get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getAllStaffs() {
        return this
            .httpService
            .get(`/rsb-security/security/staff/getAllStaffBySubsidiary?subsidiaryId=` + this.subsidiary.id+`&size=`+1000)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

}
