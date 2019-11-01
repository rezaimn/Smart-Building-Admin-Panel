import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class TicketManagementService {

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
      .get(`/rsb-security/security/ticketManagement/getAllLightningByDeptAndSubDept?dept=` + deptId+`&subDept=`+subDeptId+`&subId=`+this.subsidiary.id +`&status=`+status)
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
      .get(`/rsb-security/security/ticketManagement/getAllLightningBySubsidiary?subsidiaryId=` + this.subsidiary.id)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  
  
  updateAccessCard(data: any): Observable<any> {    
    return this
      .httpService
      .post(`/rsb-security/security/ticketManagement/updateAccessCard`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  
    updateVisitorAccess(data: any): Observable<any> {    
    return this
      .httpService
      .post(`/rsb-security/security/ticketManagement/updateVisitorAccess`, data)
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
      .post(`/rsb-security/security/ticketManagement/createLightning`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addEmployment(data: any): Observable<any>  {
    return this
      .httpService
      .post(`/rsb-security/security/ticketManagement/createEmployment`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addVehicles(data: any): Observable<any>  {
    return this
      .httpService
      .post(`/rsb-security/security/ticketManagement/createVehicles`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  addPolicy(data: any) {
    return this
      .httpService
      .post(`/rsb-security/security/ticketManagement/createLightningPolicy`, data)
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
      .get(`/rsb-oms/oms/ticketManagement/getLightningPolicy?ticketManagementId=` + staffId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  
  getVehicleDetails(staffId: number) {
    return this
      .httpService
      .get(`/rsb-security/security/ticketManagement/getVehicleByLightning?&ticketManagementId=` + staffId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateLightning(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/ticketManagement/updateLightning`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateEmployement(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/ticketManagement/updateEmployment`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateLightningPolicy(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/ticketManagement/updateLightningPolicy`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateVehicle(data: any): Observable<any> {
    return this
      .httpService
      .post(`/rsb-security/security/ticketManagement/updateVehicle`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getDesignation(staffId: number) {
      console.log("ticket.service");
    return this
      .httpService
      .get(`/rsb-oms/oms/staff/getStaffPolicy?staffId=` + staffId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getDepartments(subId ,lang) {
    return this
      .httpService
      .getPe(`/Common/GetDepartments?subsidiaryid=` + subId +`&Accept_Language=`+lang)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getSubDepartments(departmentId: number, lang) {
    return this
      .httpService
      .getPe(`/Common/GetSubDepartments?departmentid=` + departmentId +`&Accept_Language=`+lang)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getStaffBySubDep(subId) {
    return this
      .httpService
      .getPe(`/ALMS/GetStaffBySubDepartmentId?id=` + subId)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getTicketsByEmployee(data: any): Observable<any> {
    return this
      .httpService
      .postPe(`/ALMS/GetTicketsByEmployee`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getTicketsByDepartment(data: any): Observable<any> {
    return this
      .httpService
      .postPe(`/ALMS/GetTicketsBySubDepartment`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  createTicket(data: any): Observable<any> {
    return this
      .httpService
      .postPe(`/ALMS/CreateTicket`, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateTicket(data: any): Observable<any> {
    return this
      .httpService
      .postPe(`/ALMS/UpdateTicket`, data)
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
  getSeverity() {
    return this
      .httpService
      .getPe(`/ALMS/GetTicketSeverity`)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}