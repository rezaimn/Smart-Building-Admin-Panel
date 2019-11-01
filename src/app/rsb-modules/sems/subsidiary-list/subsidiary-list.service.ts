import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class SubsidiaryListService {

  constructor(private httpService: HttpService) { }

  getSubsidiaryList(url: any): Observable<any> {
    return this
      .httpService
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  // getSubsidiaryListNew(url: any): Observable<any> {
  //   return this
  //     .httpService
  //     .getNew(url)
  //     .map((res: Response) => res)
  //     .catch((error: any) => Observable.throw(error || 'Server error'));
  // }

}
