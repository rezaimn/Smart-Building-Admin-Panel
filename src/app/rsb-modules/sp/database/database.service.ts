import { Database } from './shared/database';
import {EventEmitter, Injectable} from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DatabaseService {

  constructor(private httpService: HttpService) { }
  public cancelButtonClicked=new EventEmitter<any>();
  getDatabases(url: any): Observable<any> {
    return this
      .httpService
      //.get(url)
      .getPe(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  editDatabase(url: any, model: any){
    return this.
      httpService
      .postPe(url, model)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

}
