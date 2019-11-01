import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class LeaveService {

  @SessionStorage('subsidiary')
  public subsidiary;

  constructor(private httpService: HttpService) { }

  getleaveType(){
    return this
    .httpService
      .getPe('/AMS/GetLeaveTypes')
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getLeaveById(employeeid){
    return this
    .httpService
      .getPe('/AMS/GetEmployeLeaveById?id='+ employeeid)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getLeaveElebibityByType(employeeid,typeid){
    return this
    .httpService
      .getPe('/AMS/GetLeaveEligibilityByType?employeeid='+ employeeid +'&typeid='+typeid)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }


  getEmployeeByMangerId(employeeId: number) {
    return this
      .httpService
      .getPe(`/AMS/GetEmployeesByManagerId?employeeid=` + employeeId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getDesignation(staffId: number) {
      console.log("leave.service");
    return this
      .httpService
      .get(`/rsb-oms/oms/staff/getStaffPolicy?staffId=` + staffId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  submitLeave(data){
    return this
    .httpService
      .postPe('/AMS/SubmitLeave',data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }


  submitLeaveByEmployee(data){
    debugger
    return this
    .httpService
      .postPe('/AMS/SubmitLeave',data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getLeaveStatus(){
    return this
    .httpService
      .getPe('/AMS/GetLeaveStatuses')
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getLeaveslistByManager(data){
    return this
    .httpService
      .postPe('/AMS/GetEmployeesLeavesByDate',data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getLeaveslistByEmployee(data){
    return this
    .httpService
      .postPe('/AMS/GetEmployeLeavesByDate',data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getLeaveslistBySub(data,lang){
    return this
    .httpService
      .postPe('/AMS/GetEmployeLeavesBySubsidiaryId?Accept_Language=' + lang,data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  approveLeave(data:any) : Observable<any>{
    return this
    .httpService
      .postPe('/AMS/ApproveLeave',data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  rejectLeave(data){
    return this
    .httpService
      .postPe('/AMS/RejectLeave',data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }


}