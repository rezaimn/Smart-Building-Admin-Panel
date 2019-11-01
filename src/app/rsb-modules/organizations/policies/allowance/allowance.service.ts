import { Injectable } from '@angular/core';
import { HttpService } from '../../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class AllowanceService {

  constructor() { }
  public subject = new Subject<any>();

  getCancelClicked(message: string) {
    this.subject.next(message);
  }

  // Grade list
  // getGradeList(url: any): Observable<any> {
  //   return this
  //     .httpService
  //     .get(url)
  //     .map((res: Response) => res)
  //     .catch((error: any) => Observable.throw(error || 'Server error'));
  // }
  // // Create / Update grade
  // createUpdateGrade(url: any, data: any): Observable<any> {
  //   console.log(url);
  //   console.log(data);
  //   return this
  //     .httpService
  //     .post(url, data)
  //     .map((res: Response) => res)
  //     .catch((error: any) => Observable.throw(error || 'Server error'));
  // }

  // createUpdateAllowancePolices(url: any, data: any): Observable<any> {
  //   console.log(url);
  //   console.log(data);
  //   return this
  //     .httpService
  //     .post(url, data)
  //     .map((res: Response) => res)
  //     .catch((error: any) => Observable.throw(error || 'Server error'));
  // }
}
