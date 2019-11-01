import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class NotificationManagementService {

  @SessionStorage('subsidiary')
  public subsidiary;

  constructor(private httpService: HttpService) { }

  
  getAllLightningsByDeptSubDept(size: number, page: number, deptId:number,subDeptId:number, status:string) {
    let pager = '';
    if (size !== 0 && page >= 0) {
       pager = `&size=`+size+`&page=`+page
    }
     
    return this
      .httpService
      .get(`/rsb-security/security/notificationManagement/getAllLightningByDeptAndSubDept?dept=` + deptId+`&subDept=`+subDeptId+`&subId=`+this.subsidiary.id +`&status=`+status)
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
      .get(`/rsb-security/security/notificationManagement/getAllLightningBySubsidiary?subsidiaryId=` + this.subsidiary.id)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  
  
  updateAccessCard(data: any): Observable<any> {    
    return this
      .httpService
      .post(`/rsb-security/security/notificationManagement/updateAccessCard`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  
    updateVisitorAccess(data: any): Observable<any> {    
    return this
      .httpService
      .post(`/rsb-security/security/notificationManagement/updateVisitorAccess`, data)
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

  createLightning(data: any): Observable<any> {    
    return this
      .httpService
      .post(`/rsb-security/security/notificationManagement/createLightning`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addEmployment(data: any): Observable<any>  {
    return this
      .httpService
      .post(`/rsb-security/security/notificationManagement/createEmployment`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addVehicles(data: any): Observable<any>  {
    return this
      .httpService
      .post(`/rsb-security/security/notificationManagement/createVehicles`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addPolicy(data: any) {
    return this
      .httpService
      .post(`/rsb-security/security/notificationManagement/createLightningPolicy`, data)
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
      .get(`/rsb-oms/oms/notificationManagement/getLightningPolicy?notificationManagementId=` + staffId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  
  getVehicleDetails(staffId: number) {
    return this
      .httpService
      .get(`/rsb-security/security/notificationManagement/getVehicleByLightning?&notificationManagementId=` + staffId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateLightning(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/notificationManagement/updateLightning`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateEmployement(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/notificationManagement/updateEmployment`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateLightningPolicy(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/notificationManagement/updateLightningPolicy`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateVehicle(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/notificationManagement/updateVehicle`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getCampuses(subsidaryId: number , lang) {
    return this
      .httpService
      .getPe(`/Common/GetCampuses?subsidiaryid=` + subsidaryId + `&Accept_Language=` + lang)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getBuildings(campusId: number,lang) {
    return this
      .httpService
      .getPe(`/Common/GetBuildings?campusid=` + campusId+ `&Accept_Language=` + lang)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getFloors(buildingId: number,lang) {
    return this
      .httpService
      .getPe(`/Common/GetFloors?buildingid=` + buildingId+ `&Accept_Language=` + lang)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getNotificationsByFloor(data: any): Observable<any> {
    return this
      .httpService
      .postPe(`/ALMS/GetNotificationsByFloor`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getNotificationsByEmployee(data: any): Observable<any> {
    return this
      .httpService
      .postPe(`/ALMS/GetNotificationsByEmployee`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getDesignation(staffId: number) {
      console.log("notification.service");
    return this
      .httpService
      .get(`/rsb-oms/oms/staff/getStaffPolicy?staffId=` + staffId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}