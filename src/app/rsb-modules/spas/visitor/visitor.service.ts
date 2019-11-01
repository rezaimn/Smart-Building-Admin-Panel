import {Injectable} from '@angular/core';
import {HttpService} from '../../../utils/services/http.service';
import {Observable} from 'rxjs/Observable';
import {SessionStorage} from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class VisitorService {
    @SessionStorage('subsidiary')
    public subsidiary;

    constructor(private httpService: HttpService) {
    }

    getAllVisitor(name, WGId,page,size,lang) {
        return this
            .httpService
            .get(`/rsb-spas/visitor?name=` + name + `&workgroupid=` + WGId+`page`+`&page=`+page+`&size=`+size+`&lang=`+lang)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    addVisitor(data) {
        return this
            .httpService
            .post('/rsb-spas/visitor', data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    updateVisitor(data) {
        return this
            .httpService
            .put('/rsb-spas/visitor', data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    addCardHolder(data) {
        return this
            .httpService
            .post('/rsb-spas/cardholder', data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    updateCardHolder(data) {
        return this
            .httpService
            .put('/rsb-spas/cardholder', data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getAllWorkGroups(type,lang) {
        return this
            .httpService
            .get(`/rsb-spas/workgroup?type=`+type+`&lang=`+lang+`&page=0&size=10000`)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}