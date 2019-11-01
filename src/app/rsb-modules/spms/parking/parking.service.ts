import {EventEmitter, Injectable} from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {AppService} from '../../../app.service';

// various parking methods invoked in the module
@Injectable()
export class ParkingService {

  constructor(private httpService: HttpService,   public appService: AppService) { }

  public parkingFloor=new EventEmitter<any>();


  getFileDetail(url){
    return this
    .httpService
    .get(url)
    .map((res: Response) => res)
    .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getDeviceList(url: any): Observable<any> {
    return this
      .httpService
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  // Created By Farshid Boroomand

  getAllForFloor(url: any): Observable<any> {
    return this
        .httpService
        .get(url)
        .map((res: Response) => res)
        .catch((error: any) => Observable.throw(error || 'serve error'));
  }

  getStaffId(EmployeeId: number): Observable<any>{
      return this
          .httpService
          .get(`/rsb-security/security/staff/getEmployment?employmentId=` + EmployeeId )
          .map((res: Response) => res)
          .catch((error: any) => Observable.throw(error || 'server error'));
  }

  delStaffId(EmployeeId: number): Observable<any>{
    return this
        .httpService
        .get(`/rsb-security/security/staff/getEmployment?employmentId=` + EmployeeId)
        .map((res: Response) => res)
        .catch((error: any) => Observable.throw(error || 'server error'));
}

// parking information
  getStaffInfo(staffId: number): Observable<any> {
    return this
        .httpService
        .get(`/rsb-security/security/staff/getStaff?stafftId=` + staffId)
        .map((res: Response) => res)
        .catch((error: any) => Observable.throw(error || 'server error'));
  }
// create parking reservation
  createParkingReservation(data: any): Observable<any> {
    console.log(data);
      return this
          .httpService
          .post(`/rsb-parking/parking/reservation/create`, data)
          .map((res: Response) => res)
          .catch((error: any) => Observable.throw(error || 'Server error'));
  }
// update parking reservation
  updateParkingReservation(data: any): Observable<any> {
        console.log(data);
        return this
            .httpService
            .post(`/rsb-parking/parking/reservation/update`, data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

}