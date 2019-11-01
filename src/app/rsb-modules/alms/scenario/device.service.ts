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
      .getPe(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
    getHVACModes(url: any): Observable<any> {
        return this
            .httpService
            //.get(url)
            .getPe(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
  editDeviceType(url: any, model: any){
    return this.
      httpService
      .postPe(url, model)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  editDeviceTypeFrequency(url, model: any){
    return this.
      httpService
      .postPe(url, model)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }


  addDeviceTypeFrequency(url, model: any){
    return this.
      httpService
      .postPe(url, model)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addDeviceType(url, model: any){
    return this.
      httpService
      .postPe(url, model)
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
  
  deleteDevice(url){//, model: any){
      return this.
        httpService
        .deletePe(url)
        .map((res: Response) => res)
        .catch((error: any) => Observable.throw(error || 'Server error'));
    }
   
}