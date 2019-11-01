import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class GroupService {

  @SessionStorage('subsidiary')
  public subsidiary;

  constructor(private httpService: HttpService) { }

    getAllAccessLevels(lang) {
        return this
            .httpService
            .get(`/rsb-spas/accesselement?type=AREA&lang=`+lang+`&size=`+10000+`&page=`+0)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getAllTimeSchedules(){
        return this
            .httpService
            .get(`/rsb-spas/timeschedule`)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getAllAccessGroups(name,lang,size,page) {
        return this
            .httpService
            .get(`/rsb-spas/accesselement?type=ZONE&name=`+name+`&lang=`+lang+`&size=`+size+`&page=`+page)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }


    addAccessLevel(data) {
        return this
            .httpService
            .post('/rsb-spas/accesselement', data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }


    updateAccessLevel(data) {
        return this
            .httpService
            .put('/rsb-spas/accesselement', data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}