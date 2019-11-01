import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {AppService} from './app.service';
import {TranslateService} from '@ngx-translate/core';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';

//import { Subsidiary } from './shared/subsidiary';

@Injectable()
export class ErrorMessageService {

    constructor(private toastr: ToastrService,public appService:AppService,public translate:TranslateService) {
    }
    translateSuccess(message:any) {
        let lang= this.appService.currentLang;
        this.translate.get('CE-error-message.'+message,lang).subscribe(
            (res) => {
                this.toastr.success(res);
            }
        );
    }
    getCurrentLang(){
        return this.appService.currentLang;
    }
    translateErrors(errorCode,message){
        let lang= this.appService.currentLang;
        this.translate.get('CE-error-message.'+errorCode,lang).subscribe(
            (res) => {
                let flag=res.includes("CE-error-message");
                if(!flag){
                    this.toastr.error(res);
                }else{
                    this.toastr.error(message);
                }
            }
        );

    }
}
