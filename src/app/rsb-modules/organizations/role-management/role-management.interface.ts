import {multiLingMap} from '../staff/staff';

export class AdminModel {
    public id: number;
    public roleName: string;
    public roleMultiLingual={
        'map': new multiLingMap
    }
    constructor(data: any = {}) {
        this.id = data.id;
        this.roleName = data.roleName;
        this.roleMultiLingual=data.roleMultiLingual||this.roleMultiLingual;
    }
}

export class PrepareAdmin {
    public roles: AdminModel[] = [];
    public firstName: string;
    public lastName: string;
    public email: number;
    public mobileNum: number;
    public staffId: number;
    
    constructor(data: any = {}) {
        this.roles = data.roles || '';
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.email = data.email || '';
        this.mobileNum = data.mobileNum || '';
        this.staffId = data.staffId || '';
    }
}

export class PersonalInfo {
    public hasRole:boolean;
    public id: number;
    public firstName: string;
    public lastName: string;
    public firstNameMultiLingual = {

        'map': new multiLingMap
    }
    public lastNameMultiLingual = {
        'map': new multiLingMap
    }
    public email: string;
    public fatherName: string;
    public mobileNum: string;
    public organization: any;
    public subsidyId: number;
    public roles: AdminModel[] = [];
    public role: AdminModel;

    constructor(data: any = {}, organizationId, subsidiaryId, role) {
        this.hasRole=data.hasRole||false;
        this.id = data.id || 0;
        this.firstName = data.firstName || '';
        this.firstNameMultiLingual = data.firstNameMultiLingual || this.firstNameMultiLingual;
        this.lastName = data.lastName || '';
        this.lastNameMultiLingual = data.lastNameMultiLingual || this.lastNameMultiLingual;
        this.roles = data.roles || '';
        this.role = role || new AdminModel({});
        this.email = data.email || '';

        this.fatherName = data.fatherName || '';
        this.mobileNum = data.mobileNum || '';
        
        this.organization = { id : organizationId };
        this.subsidyId = subsidiaryId;
    }
}