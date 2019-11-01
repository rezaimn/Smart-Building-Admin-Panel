import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DeviceConService {
    @SessionStorage('subsidiary')
  public subsidiary;

  constructor(private httpService: HttpService) { }

  getDevices(url: any): Observable<any> {
    return this
      .httpService
      //.get(url)
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addDeviceType(url, model: any){
    return this.
      httpService
      .post(url, model)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getDevicetypes(url: any): Observable<any> {
      return this
        .httpService
        //.get(url)
        .getPe(url)
        .map((res: Response) => res)
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
  
  deleteDeviceSchedule(url){//, model: any){
      return this.
        httpService
        .delete(url)
        .map((res: Response) => res)
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
   
}