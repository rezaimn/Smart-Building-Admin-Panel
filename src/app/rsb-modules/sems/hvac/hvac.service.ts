import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class HvacService {

  @SessionStorage('subsidiary')
  public subsidiary;

  constructor(private httpService: HttpService) { }

  // services and functions used by the hvac module
  
  getAllHvacsByDeptSubDept(size: number, page: number, deptId:number,subDeptId:number, status:string) {
    let pager = '';
    if (size !== 0 && page >= 0) {
       pager = `&size=`+size+`&page=`+page
    }
     
    return this
      .httpService
      .get(`/rsb-security/security/hvac/getAllHvacByDeptAndSubDept?dept=` + deptId+`&subDept=`+subDeptId+`&subId=`+this.subsidiary.id +`&status=`+status)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  
  getAllHvacs(limit: number, page: number) {
    let pager = '';
    if (limit !== 0 && page >= 0) {
       pager = `&limit=`+limit+`&page=`+page
    }
     
    return this
      .httpService
      .get(`/rsb-security/security/hvac/getAllHvacBySubsidiary?subsidiaryId=` + this.subsidiary.id)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  
  
  updateAccessCard(data: any): Observable<any> {    
    return this
      .httpService
      .post(`/rsb-security/security/hvac/updateAccessCard`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updatePoint(data: any): Observable<any> {    
    return this
      .httpService
      .getPe("/SEMS/SetComfortSetPoint?"+ data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateMode(data: any): Observable<any> {    
    return this
      .httpService
      .getPe("/SEMS/SetHVACMode?"+ data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  
  getHVACDeviceData(serialnumber: any): Observable<any> {    
    return this
      .httpService
      .getPe(`/SEMS/GetHVACDeviceDataBySerialNumber?serialnumber=`+serialnumber)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  
  
  
    updateVisitorAccess(data: any): Observable<any> {    
    return this
      .httpService
      .post(`/rsb-security/security/hvac/updateVisitorAccess`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  

  getProfilePicture(pictureId) {
    return this
      .httpService
      .get(`/rsb-oms/oms/getFile/` + pictureId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  uploadProfilePicture(data) {
    return this
      .httpService
      .uploadFile('/rsb-oms/oms/fileUpload ', data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  createHvac(data: any): Observable<any> {    
    return this
      .httpService
      .post(`/rsb-security/security/hvac/createHvac`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addEmployment(data: any): Observable<any>  {
    return this
      .httpService
      .post(`/rsb-security/security/hvac/createEmployment`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addVehicles(data: any): Observable<any>  {
    return this
      .httpService
      .post(`/rsb-security/security/hvac/createVehicles`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addPolicy(data: any) {
    return this
      .httpService
      .post(`/rsb-security/security/hvac/createHvacPolicy`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getDepartmentDetails() {
    return this
      .httpService
      .get(`/rsb-oms/oms/dept/getDeptBySubsidiary?subsidiaryId=` + this.subsidiary.id)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getGrades(designationId: number) {
    return this
      .httpService
      .get(`/rsb-oms/oms/getGradePolicyGroup?subsidairyId=` + this.subsidiary.id + '&designationId=' + designationId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getAllowancePolicies(designationId: number) {
    return this
      .httpService
      .get(`/rsb-oms/oms/getAllowancePoliciesByDesignationId?&designationId=` + designationId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getWorkTimePolicies(designationId: number) {
    return this
      .httpService
      .get(`/rsb-oms/oms/getWorkTimePolicyGroup?subsidairyId=` + this.subsidiary.id + `&designationId=` + designationId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getPolicyDetails(staffId: number) {
    return this
      .httpService
      .get(`/rsb-oms/oms/hvac/getHvacPolicy?hvacId=` + staffId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  
  getVehicleDetails(staffId: number) {
    return this
      .httpService
      .get(`/rsb-security/security/hvac/getVehicleByHvac?&hvacId=` + staffId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateHvac(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/hvac/updateHvac`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateEmployement(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/hvac/updateEmployment`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateHvacPolicy(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/hvac/updateHvacPolicy`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateVehicle(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/hvac/updateVehicle`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getDevicesList(url: any): Observable<any> {
    return this
      .httpService
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
    setHvac(url:string,data: any): Observable<any> {
        return this
            .httpService
            .post('/rsb-iot/'+url, data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}