import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class SubDepartmentService {

  constructor(private httpService: HttpService) { }
  getSubDepartmentList(url: any): Observable<any> {
    return this
      .httpService
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  createUpdateSubDepartment(url: any, data: any): Observable<any> {
    console.log(url);
    console.log(data);
    return this
      .httpService
      .post(url, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

getDesignationList(url : any) : Observable < any > {
  return this
    .httpService
    .get(url)
    .map((res : Response) => res)
    .catch((error : any) => Observable.throw(error || 'Server error'));
}

createUpdateDesignation(url : any, data : any) : Observable < any > {
  console.log(url);
  console.log(data);
  return this
    .httpService
    .post(url, data)
    .map((res : Response) => res)
    .catch((error : any) => Observable.throw(error || 'Server error'));
}
}
