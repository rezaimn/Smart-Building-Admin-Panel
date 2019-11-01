import {Injectable} from '@angular/core';
import {HttpService} from '../../utils/services/http.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class SkService {
    constructor(private httpService: HttpService) {

    }

    uploadSKFile(url,data) {
        return this.httpService
            .uploadFile(url, data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getAllSKFiles(url){
            return this
                .httpService
                .get(url)
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    attachSKFile(url,data) {
        console.log(data);
        return this.httpService
            .post(url, data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    detachSKFile(url,data) {
        console.log(data);
        return this.httpService
            .post(url, data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    downloadFile(url){
        return this
            .httpService
            .get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
