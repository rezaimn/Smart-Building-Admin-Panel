import { Injectable } from '@angular/core';
import { HttpService } from '../../../utils/services/http.service';
import { Observable } from 'rxjs/Observable';
import { SessionStorage } from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class VideoCallService {

	@SessionStorage('subsidiary')
	public subsidiary;

	constructor(private httpService: HttpService) { }


	getAllAppliancesByDeptSubDept(size: number, page: number, deptId: number, subDeptId: number, status: string) {
		let pager = '';
		if (size !== 0 && page >= 0) {
			pager = `&size=` + size + `&page=` + page
		}

		return this
			.httpService
			.get(`/rsb-security/security/videoCall/getAllApplianceByDeptAndSubDept?dept=` + deptId + `&subDept=` + subDeptId + `&subId=` + this.subsidiary.id + `&status=` + status)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	getOnlineUsersList(subsid: number) {


		return this
			.httpService
			.get(`/rsb-vics/vics/staff/getAllOnlineStaffs?subsidiaryId=` + subsid)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}


	getAllIncoming(userid: number) {
		return this
			.httpService
			.get(`/rsb-vics/vics/staff/getCalledByMe?userId=` + userid)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	getAllMyCalls(userid: number) {
		return this
			.httpService
			.get(`/rsb-vics/vics/staff/getMyCalls?userId=` + userid)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	removeMyCalls(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-vics/vics/staff/removeMyCalls`, data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}


	tgoinReq(userid: number) {
		return this
			.httpService
			.get(`/rsb-vics/vics/staff/getCallsByMe?userId=` + userid)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	getAllAppliances(limit: number, page: number) {
		let pager = '';
		if (limit !== 0 && page >= 0) {
			pager = `& limit=` + limit + ` & page=` + page
		}

		return this
			.httpService
			.get(`/rsb-security/security/videoCall/getAllApplianceBySubsidiary?subsidiaryId=` + this.subsidiary.id)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	sendOnlineData(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-vics/vics/staff/sendVideoRequest`, data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	addToFavorite(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-vics/vics/staff/addToFavorite`, data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	getFavorite(data: any): Observable<any> {
		return this
			.httpService
			.get(`/rsb-vics/vics/staff/getMyFavorite?staffId=` + data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}


	// acceptVideoReq(data: any)http://appdev.mitoconnect.com/api/rsb-vics/vics/staff/acceptVideoRequest

	acceptVideoReq(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-vics/vics/staff/acceptVideoRequest`, data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	///rsb-vics/vics/staff/rejectVideoRequest

	rejectVideoReq(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-vics/vics/staff/rejectVideoRequest`, data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}



	updateAccessCard(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-security/security/videoCall/updateAccessCard`, data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	updateVisitorAccess(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-security/security/videoCall/updateVisitorAccess`, data)
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

	createAppliance(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-security/security/videoCall/createAppliance`, data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	addEmployment(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-security/security/videoCall/createEmployment`, data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	addVehicles(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-security/security/videoCall/createVehicles`, data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	addPolicy(data: any) {
		return this
			.httpService
			.post(`/rsb-security/security/videoCall/createAppliancePolicy`, data)
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
			.get(`/rsb-oms/oms/getAllowancePoliciesByDesignationId ?& designationId=` + designationId)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	getWorkTimePolicies(designationId: number) {
		return this
			.httpService
			.get(`/rsb-oms/oms/getWorkTimePolicyGroup?subsidairyId=` + this.subsidiary.id + ` & designationId=` + designationId)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	getPolicyDetails(staffId: number) {
		return this
			.httpService
			.get(`/rsb-oms/oms/videoCall/getAppliancePolicy?videoCallId=` + staffId)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}

	getVehicleDetails(staffId: number) {
		return this
			.httpService
			.get(`/rsb-security/security/videoCall/getVehicleByAppliance ?& videoCallId=` + staffId)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}
	updateAppliance(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-security/security/videoCall/updateAppliance`, data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}
	updateEmployement(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-security/security/videoCall/updateEmployment`, data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}
	updateAppliancePolicy(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-security/security/videoCall/updateAppliancePolicy`, data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}
	updateVehicle(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-security/security/videoCall/updateVehicle`, data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}
	deleteFromFavorite(data: any): Observable<any> {
		return this
			.httpService
			.post(`/rsb-vics/vics/staff/removeFavorite`, data)
			.map((res: Response) => res)
			.catch((error: any) => Observable.throw(error || 'Server error'));
	}



}
