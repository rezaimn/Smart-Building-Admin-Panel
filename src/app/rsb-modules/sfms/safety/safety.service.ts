import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Card } from './safety-interface';
// import { HttpModule, JsonpModule } from '@angular/http';
import { Http, Response } from '@angular/http';


@Injectable()
export class SafetyService {

    cards:Card[];

    constructor(
        private httpService: HttpService
    ) { }

    //post
    //params any type
    //return any
    postData(url: any, data: any): Observable<any> {
        return this
            .httpService
            .post(url, data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    //get
    // getData(url = '../../../../../assets/data/Floor1.json') {
    //     return this
    //     .http.get('../../../../../assets/data/Floor1.json')
    //         .map((res) => res.json())
    // }
// getting list of devices
    getDevicesList(url: any): Observable<any> {
        return this
          .httpService
          .get(url)
          .map((res: Response) => res)
          .catch((error: any) => Observable.throw(error || 'Server error'));
      }

      
}
