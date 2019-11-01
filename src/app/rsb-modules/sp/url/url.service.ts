import {EventEmitter, Injectable} from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class UrlService {
    @SessionStorage('subsidiary')
  public subsidiary;

  constructor(private httpService: HttpService) { }
 public urlCancelButtonClicked=new EventEmitter<any>();


    /**
      @Desc get urls API calling
      @Param API url
      @return URL List
  */
  getUrls(url: any): Observable<any> {
    return this
      .httpService
      //.get(url)
      .getPe(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

    /**
      @Desc edit url API calling
      @Param API url , edit body data
      @return Edit status success or fail
  */
  editUrl(url: any, model: any){
    return this.
      httpService
      .postPe(url, model)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
 
}