import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PoliciesService {

  constructor(private httpService: HttpService) { }
  // Grade list
  getGradeList(url: any): Observable<any> {
    return this
      .httpService
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  // Create / Update grade
  createUpdateGrade(url: any, data: any): Observable<any> {
    return this
      .httpService
      .post(url, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  // delete grade
  deleteGrade(url: any, data: any): Observable<any> {
    return this
      .httpService
      .post(url, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  createUpdateAllowancePolices(url: any, data: any): Observable<any> {
    return this
      .httpService
      .post(url, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  // create work time policy
  createWorkTimePolicy(url: any, data: any): Observable<any> {
    console.log(url);
    console.log(data);
    return this
      .httpService
      .post(url, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  // get all work time policy
  getAllWorkTimePolicy(url: any): Observable<any> {
    return this
      .httpService
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}
