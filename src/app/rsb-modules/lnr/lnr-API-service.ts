import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {HttpService} from '../../utils/services/http.service';


@Injectable()
export class LnrAPIService {

    headers = new Headers({'Content-Type': 'application/json'});


    constructor(private http: HttpClient,private httpService: HttpService) {
    }
    /**
         @Desc used for get All APIs coming from modules
         @Param API url
         @return data
     */
    get(url: any): Observable<any> {
        return this
            .httpService
            .getPe(url)
            //.get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    postSystemLog(body):Observable<any>{
        return this
            .httpService
            .postSystemLog(body)
            //.get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getSubsidiaryList(url: any): Observable<any> {
        return this
            .httpService
            .get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getJobList(url: any): Observable<any> {
        return this
            .httpService
            .get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    toggleJobStatus(url: any): Observable<any> {
        return this
            .httpService
            .get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
