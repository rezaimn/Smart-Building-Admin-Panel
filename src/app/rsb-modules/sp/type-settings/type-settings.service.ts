import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {AuthenticationService} from '../../../common';

@Injectable()
export class TypeSettingsService {


  constructor(private httpService: HttpService,private authenticationService:AuthenticationService) { }
    getAllTypes(url: any): Observable<any> {
        return this
            .httpService
            .get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    addUpdateType(url: any,body): Observable<any> {
        return this
            .httpService
            .post(url,body)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    deleteType(url: any): Observable<any> {
        return this
            .authenticationService
            .deleteItem(url,)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
