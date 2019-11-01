import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class StatusService {

  constructor(private httpService: HttpService) { }

  getFileDetail(url){
    return this
    .httpService
    .get(url)
    .map((res: Response) => res)
    .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getInstallationPoints(area_id): Observable<any> {
    return this
      .httpService
      .get(`/rsb-oms/oms/getPointsByAreaId?id=` + area_id)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}
