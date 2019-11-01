import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CampusService {

  constructor(private httpService: HttpService) { }

  getCampusList(url: any): Observable<any> {
    return this
      .httpService
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  uploadFile(url, data,) {
    return this
      .httpService
      .uploadFile(url, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getFileDetail(url){
    return this
    .httpService
    .get(url)
    .map((res: Response) => res)
    .catch((error: any) => Observable.throw(error || 'Server error'));
  }




  createUpdateCampus(url: any, data: any): Observable<any> {
    return this
      .httpService
      .post(url, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }




  evictcache(url){
    return this
    .httpService
    .get(url)
    .map((res: Response) => res)
    .catch((error: any) => Observable.throw(error || 'Server error'));
  }

}
