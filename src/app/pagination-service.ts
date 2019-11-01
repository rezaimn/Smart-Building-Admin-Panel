import {Injectable} from '@angular/core';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';

//import { Subsidiary } from './shared/subsidiary';

@Injectable()
export class PaginationService {

  constructor() {
  }

  setPage(currentPage: any, status: string,totalPages:any) {
    let page=currentPage;
    switch (status) {
      case'first':{
        if(page > 1){
          page = 1;
        }
        break;
      }
      case'last':{
        if(page >= 1) {
          page = totalPages;
        }
        break;
      }
      case'previous':{
        if(page > 1){
          page = page - 1;
        }
        break;
      }
      case'next':{
        if(page >= 1 && page<totalPages){
          page = page + 1;
        }
        break;
      }
    }
    return page;
  }
    setPageStart0(currentPage: any, status: string,totalPages:any) {
        let page=currentPage;
        switch (status) {
            case'first':{
                if(page > 0){
                    page = 0;
                }
                break;
            }
            case'last':{
                if(page >= 0) {
                    page = totalPages-1;
                }
                break;
            }
            case'previous':{
                if(page >0){
                    page = page - 1;
                }
                break;
            }
            case'next':{
                if(page >= 0 && page<totalPages-1){
                    page = page + 1;
                }
                break;
            }
        }
        return page;
    }
}
