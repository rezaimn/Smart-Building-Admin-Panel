import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class SpaceSettingsService {

  @SessionStorage('subsidiary')
  public subsidiary;

  constructor(private httpService: HttpService) { }

    setSpaceStatus(url: any,body): Observable<any> {
        return this
            .httpService
            .post(url,body)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getSpaces(url: any): Observable<any> {
        return this
            .httpService
            .get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }


}
