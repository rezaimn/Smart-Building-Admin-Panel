import {Injectable} from '@angular/core';
import {HttpService} from '../../../utils/services/http.service';
import {Observable} from 'rxjs/Observable';
import {SessionStorage} from 'ngx-webstorage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class StaffService {

    @SessionStorage('subsidiary')
    public subsidiary;

    constructor(private httpService: HttpService) {
    }

    getAllStaffsByDeptSubDept(size: number, page: number, deptId: number, subDeptId: number, name: string, employeeId: string) {
        let pager = '';
        if (size !== 0 && page >= 0) {
            pager = `&size=` + 10000 + `&page=` + 0
        }

        return this
            .httpService
            .get(`/rsb-security/security/staff/getAllStaffByDeptAndSubDept?dept=` + deptId + `&subDept=` + subDeptId + `&subId=` + this.subsidiary.id  + `&name=` + name + `&employeeId=` + employeeId + pager)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }


    getAllStaffs(limit: number, page: number) {
        let pager = '';
        if (limit !== 0 && page >= 0) {
            pager = `&limit=` + limit + `&page=` + page
        }

        return this
            .httpService
            .get(`/rsb-security/security/staff/getAllStaffBySubsidiary?subsidiaryId=` + this.subsidiary.id)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    addCardHolder(data) {
        return this
            .httpService
            .post('/rsb-spas/cardholder', data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    updateCardHolder(data) {
        return this
            .httpService
            .put('/rsb-spas/cardholder', data)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
    getAllCardHolders() {
        return this
            .httpService
            .get(`/rsb-spas/cardholder`)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }


    getAllTimeSchedules() {
        return this
            .httpService
            .get(`/rsb-spas/timeschedule`)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }



    getAllAccessLevels(lang) {
        return this
            .httpService
            .get(`/rsb-spas/accesselement/?type=AREA&lang=`+lang+`&page=0&size=10000`)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    getAllWorkGroups(type,lang) {
        return this
            .httpService
            .get(`/rsb-spas/workgroup?type=`+type+`&lang=`+lang+`&size=10000&page=0`)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    getDepartmentDetails(lang) {
        return this
            .httpService
            .get(`/rsb-oms/oms/dept/getDeptBySubsidiary?subsidiaryId=` + this.subsidiary.id + `&Accept-Language=` + lang)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }


    getPolicyDetails(staffId: number) {
        return this
            .httpService
            .get(`/rsb-oms/oms/staff/getStaffPolicy?staffId=` + staffId)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }


}