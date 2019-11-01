import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AlertManagementService {
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
      .get(`/rsb-security/security/alertManagement/getAllLightningByDeptAndSubDept?dept=` + deptId+`&subDept=`+subDeptId+`&subId=`+this.subsidiary.id +`&status=`+status)
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
      .get(`/rsb-security/security/alertManagement/getAllLightningBySubsidiary?subsidiaryId=` + this.subsidiary.id)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  
  
  updateAccessCard(data: any): Observable<any> {    
    return this
      .httpService
      .post(`/rsb-security/security/alertManagement/updateAccessCard`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  
    updateVisitorAccess(data: any): Observable<any> {    
    return this
      .httpService
      .post(`/rsb-security/security/alertManagement/updateVisitorAccess`, data)
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
      .post(`/rsb-security/security/alertManagement/createLightning`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addEmployment(data: any): Observable<any>  {
    return this
      .httpService
      .post(`/rsb-security/security/alertManagement/createEmployment`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addVehicles(data: any): Observable<any>  {
    return this
      .httpService
      .post(`/rsb-security/security/alertManagement/createVehicles`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addPolicy(data: any) {
    return this
      .httpService
      .post(`/rsb-security/security/alertManagement/createLightningPolicy`, data)
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
      .get(`/rsb-oms/oms/alertManagement/getLightningPolicy?alertManagementId=` + staffId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  
  getVehicleDetails(staffId: number) {
    return this
      .httpService
      .get(`/rsb-security/security/alertManagement/getVehicleByLightning?&alertManagementId=` + staffId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateLightning(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/alertManagement/updateLightning`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateEmployement(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/alertManagement/updateEmployment`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateLightningPolicy(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/alertManagement/updateLightningPolicy`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateVehicle(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/alertManagement/updateVehicle`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getCampuses(subsidaryId: number,lang) {
    return this
      .httpService
      .getPe(`/Common/GetCampuses?subsidiaryid=` + subsidaryId+ `&Accept_Language=` + lang)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getBuildings(campusId: number,lang) {
    return this
      .httpService
      .getPe(`/Common/GetBuildings?campusid=` + campusId+ `&Accept_Language=` +lang)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getFloors(buildingId: number,lang) {
    return this
      .httpService
      .getPe(`/Common/GetFloors?buildingid=` + buildingId+`&Accept_Language=` + lang)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getAreas(floorId: number) {
    return this
      .httpService
      .getPe(`/Common/GetAreas?floorid=` + floorId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getDepartments(subsidaryId: number,lang) {
    return this
      .httpService
      .getPe(`/Common/GetDepartments?subsidiaryid=` + subsidaryId+`&Accept_Language=`+lang)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getSubDepartments(departmentId: number,lang) {
    return this
      .httpService
      .getPe(`/Common/GetSubDepartments?departmentid=` + departmentId+`&Accept_Language=`+lang)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getStaffBySubDepartments(subDepartmentId: number) {
    return this
      .httpService
      .getPe(`/ALMS/GetStaffBySubDepartmentId?id=` + subDepartmentId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getSystems() {
    return this
      .httpService
      .getPe(`/ALMS/GetModules`)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getDeviceTypes(areaId) {
    return this
      .httpService
      .getPe(`/Common/GetDeviceTypesByArea?id=` + areaId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getSubDeviceTypes(typeId, areaId) {
    return this
      .httpService
      .getPe(`/Common/GetDevicesByTypeNArea?typeid=` + typeId + `&areaid=` + areaId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getSeverity() {
    return this
      .httpService
      .getPe(`/ALMS/GetTicketSeverity`)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getAlertsListByFloor(data: any): Observable<any> {
    return this
      .httpService
      .postPe(`/ALMS/GetAlertListByFloor`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getDesignation(staffId: number) {
      console.log("alert-management.service");
    return this
      .httpService
      .get(`/rsb-oms/oms/staff/getStaffPolicy?staffId=` + staffId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  createAlertsList(data: any): Observable<any> {
    return this
      .httpService
      .postPe(`/ALMS/CreateAlertList`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateAlertsList(data: any): Observable<any> {
    return this
      .httpService
      .postPe(`/ALMS/UpdateAlertList`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  deleteAlertsList(alertId: any) {
    return this
      .httpService
      .getPe(`/ALMS/DeleteAlertList?id=` + alertId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
    selectDep(id: any) {
        console.log(id);
        return this
            .httpService
            .getPe(`/ALMS/GetDeptSubDeptByStaffId?staffid=` + id)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}