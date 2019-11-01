import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class ConfigurationService {

  constructor(private httpService: HttpService) { }

    /**
     @Desc get configuration file details
     @Param API url
     @return
     */
  getFileDetail(url){
    return this
    .httpService
    .get(url)
    .map((res: Response) => res)
    .catch((error: any) => Observable.throw(error || 'Server error'));
  }
    /**
     @Desc get devices list
     @Param API url
     @return
     */
  getDeviceList(url: any): Observable<any> {
    return this
      .httpService
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

}
