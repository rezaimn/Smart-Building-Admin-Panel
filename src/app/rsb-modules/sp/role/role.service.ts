import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class RoleService {


  constructor(private httpService: HttpService) { }

  getRoleList(url: any): Observable<any> {
    return this
      .httpService
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
    getAllModulesScreensList(url: any): Observable<any> {
        return this
            .httpService
            .get(url)
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
  createUpdateRole(url: any, data: any): Observable<any> {
    return this
      .httpService
      .post(url, data )
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
    createUpdateRoleModulePermission(url: any, data: any): Observable<any> {
        return this
            .httpService
            .post(url, data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

}
