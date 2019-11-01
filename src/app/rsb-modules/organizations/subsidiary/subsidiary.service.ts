import {Injectable} from '@angular/core';
import {HttpService} from '../../../utils/services/http.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Response } from '@angular/http/src/static_response';

@Injectable()
export class SubsidiaryService {

  constructor(private httpService : HttpService) {}

  getSubsidiaryList(url : any) : Observable < any > {
    return this
      .httpService
      .get(url)
      .map((res : Response) => res)
      .catch((error : any) => Observable.throw(error.json() || 'Server error'));
  }

  createUpdateSubsidiary(url : any, data : any) : Observable < any > {
    return this
      .httpService
      .post(url, data)
      .map((res : Response) => res)
      .catch((error)=> Observable.throw(error.json()))
  }
    evictcache(url){
        return this
            .httpService
            .get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

}
