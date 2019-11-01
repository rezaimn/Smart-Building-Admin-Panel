import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class SecurityService {

  @SessionStorage('subsidiary')
  public subsidiary;

  constructor(private httpService: HttpService) { }

  
  getCheckList(url, data, pages){
    var dat = {
      floorid : data.floorid.id,
      pagination:{page:pages,records:6}
};
    
    return this
    .httpService
    .postPe(url, dat)
    .map((res: Response) => res)
    .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getCheckListNew(url, data, pages){
    var dat = {
      floorid : data.floorid,
      pagination:{page:pages,records:6}
};
    
    return this
    .httpService
    .postPe(url, dat)
    .map((res: Response) => res)
    .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  InsertCheckList(url, data){
//     var dat = {
//       floorid : data.floorid.id,
//       pagination:{page:1,records:6}
// };
    
    return this
    .httpService
    .postPe(url, data)
    .map((res: Response) => res)
    .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  // InsertCheckList(url, data){
  //   //     var dat = {
  //   //       floorid : data.floorid.id,
  //   //       pagination:{page:1,records:6}
  //   // };
        
  //       return this
  //       .httpService
  //       .postPe(url, data)
  //       .map((res: Response) => res)
  //       .catch((error: any) => Observable.throw(error || 'Server error'));
  //     }
    
      InsertCheckListItems(url, data){
        //     var dat = {
        //       floorid : data.floorid.id,
        //       pagination:{page:1,records:6}
        // };
            
            return this
            .httpService
            .postPe(url, data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
          }
}