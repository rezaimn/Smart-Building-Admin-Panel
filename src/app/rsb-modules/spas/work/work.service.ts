import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class WorkService {

  @SessionStorage('subsidiary')
  public subsidiary;

  constructor(private httpService: HttpService) { }

    getAllWorkGroups(name,accessElementId ,lang) {
        return this
            .httpService
            .get(`/rsb-spas/workgroup?name=`+name+`&accessElementId=`+accessElementId+`&lang=`+lang+`&page=0&size=10000`)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    getAllAccessGroups(lang) {
        return this
            .httpService
            .get(`/rsb-spas/accesselement?type=ZONE&lang=`+lang+`&page=0&size=10000`)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    addWorkGroup(data) {
        return this
            .httpService
            .post('/rsb-spas/workgroup', data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }


    updateWorkGroup(data) {
        return this
            .httpService
            .put('/rsb-spas/workgroup', data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}