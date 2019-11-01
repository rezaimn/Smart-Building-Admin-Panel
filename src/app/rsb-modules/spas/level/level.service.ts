import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class LevelService {

  @SessionStorage('subsidiary')
  public subsidiary;

  constructor(private httpService: HttpService) { }



    getAllAccessLevels(name,lang,page,size) {
    return this
      .httpService
        .get(`/rsb-spas/accesselement?type=AREA&name=`+name+`&lang=`+lang+`&page=`+page+`&size=`+size)
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
    getAllAccessComponents(lang) {
        return this
            .httpService
            .get(`/rsb-spas/accesselement?type=DOOR`+`&page=`+0+`&size=`+10000+`&lang=`+lang)
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