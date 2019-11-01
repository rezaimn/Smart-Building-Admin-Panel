import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class LevelService {

  constructor(private httpService: HttpService) { }

  getSVG(url: any): Observable<any> {
    return this
      .httpService
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getLevelList(url: any): Observable<any> {
    return this
      .httpService
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  deleteLevelList(url: any, data: any): Observable<any> {
    return this
      .httpService
      .post(url, data)
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
  createUpdateLevel(url: any, data: any): Observable<any> {
    console.log(JSON.stringify(data));
    return this
      .httpService
      .post(url, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
    evictcache(url){
        return this
            .httpService
            .get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
