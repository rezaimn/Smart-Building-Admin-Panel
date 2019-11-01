import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class LightningService {

  @SessionStorage('subsidiary')
  public subsidiary;

  constructor(private httpService: HttpService) { }

  // get the lightning by dept and subdept

  getAllLightningsByDeptSubDept(size: number, page: number, deptId:number,subDeptId:number, status:string) {
    let pager = '';
    if (size !== 0 && page >= 0) {
       pager = `&size=`+size+`&page=`+page
    }
     
    return this
      .httpService
      .get(`/rsb-security/security/lightning/getAllLightningByDeptAndSubDept?dept=` + deptId+`&subDept=`+subDeptId+`&subId=`+this.subsidiary.id +`&status=`+status)
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

    toggleLighting(url:string,data: any): Observable<any> {
        return this
            .httpService
            .post('/rsb-iot/'+url, data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
  getAllLightnings(limit: number, page: number) {
    let pager = '';
    if (limit !== 0 && page >= 0) {
       pager = `&limit=`+limit+`&page=`+page
    }
     
    return this
      .httpService
      .get(`/rsb-security/security/lightning/getAllLightningBySubsidiary?subsidiaryId=` + this.subsidiary.id)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  // update the access card
  
  updateAccessCard(data: any): Observable<any> {    
    return this
      .httpService
      .post(`/rsb-security/security/lightning/updateAccessCard`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  
    updateVisitorAccess(data: any): Observable<any> {    
    return this
      .httpService
      .post(`/rsb-security/security/lightning/updateVisitorAccess`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  
// upload profile pic
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

  createLightning(data: any): Observable<any> {    
    return this
      .httpService
      .post(`/rsb-security/security/lightning/createLightning`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addEmployment(data: any): Observable<any>  {
    return this
      .httpService
      .post(`/rsb-security/security/lightning/createEmployment`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addVehicles(data: any): Observable<any>  {
    return this
      .httpService
      .post(`/rsb-security/security/lightning/createVehicles`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addPolicy(data: any) {
    return this
      .httpService
      .post(`/rsb-security/security/lightning/createLightningPolicy`, data)
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
      .get(`/rsb-oms/oms/lightning/getLightningPolicy?lightningId=` + staffId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  
  getVehicleDetails(staffId: number) {
    return this
      .httpService
      .get(`/rsb-security/security/lightning/getVehicleByLightning?&lightningId=` + staffId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateLightning(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/lightning/updateLightning`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateEmployement(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/lightning/updateEmployment`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateLightningPolicy(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/lightning/updateLightningPolicy`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateVehicle(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/lightning/updateVehicle`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}