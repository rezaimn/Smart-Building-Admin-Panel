export class PersonalInfo {
    public id: number;
    public firstName: string;
    public firstNameMultiLingual = {

        'map': new multiLingMap
    }
    public lastName: string;
    public lastNameMultiLingual = {
        'map': new multiLingMap
    }
    public phtoId: string;
    public dob: Date;
    public email: string;
    public fatherName: string;
    public fatherNameMultiLingual = {

        'map': new multiLingMap
    }
    public mobileNum: string;
    public nationalId: string;

    public resAddress: string;
    public resAddressMultiLingual = {

        'map': new multiLingMap
    }
    public resPhoneNum: string;
    public resAddressZipcode: string;

    public permAddress: string;
    public permAddressMultiLingual = {

        'map': new multiLingMap
    }
    public permAddressZipcode: string;
    public permPhoneNum: string;

    public ssn: string;
    public organization: any;
    public subsidyId: number;

    public profileImage: any;
    public employmentDetails: any;

    constructor(data: any = {}, organizationId, subsidiaryId, employmentDetails: EmployementDetails) {
        if (data.dob) {
            this.dob = new Date(data.dob);
        } else {
            this.dob = new Date();
        }

        this.id = data.id || 0;
        this.firstName = data.firstName || '';
        this.firstNameMultiLingual = data.firstNameMultiLingual || this.firstNameMultiLingual;
        this.lastName = data.lastName || '';
        this.lastNameMultiLingual = data.lastNameMultiLingual || this.lastNameMultiLingual;
        this.email = data.email || '';
        this.phtoId = data.phtoId || '';
        this.fatherName = data.fatherName || '';
        this.fatherNameMultiLingual = data.fatherNameMultiLingual || this.fatherNameMultiLingual;
        this.mobileNum = data.mobileNum || '';
        this.nationalId = data.nationalId || '';
        this.permAddress = data.permAddress || '';
        this.permAddressMultiLingual = data.permAddressMultiLingual || this.permAddressMultiLingual;
        this.permPhoneNum = data.permPhoneNum || '';
        this.permAddressZipcode = data.permAddressZipcode || '';
        this.resAddress = data.resAddress || '';
        this.resAddressMultiLingual = data.resAddressMultiLingual || this.resAddressMultiLingual;
        this.resPhoneNum = data.resPhoneNum || '';
        this.resAddressZipcode = data.resAddressZipcode || '';
        this.ssn = data.ssn || '';
        this.organization = {id: organizationId};
        this.subsidyId = subsidiaryId;
        this.profileImage = '';
        this.employmentDetails = employmentDetails;
    }
}

export class multiLingMap {
    public en = '';
    public fa = '';
}

export class EmployementDetails {
    public id: number;
    public employeeId: number;
    public doj: string;
    public lineSupervisorId: number;
    public lineMgrId: number;
    public basicSal: number;
    public staffId: number;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.staffId = data.staffId || 0;
        this.employeeId = data.employeeId || '';
        this.doj = data.doj || '';
        this.lineSupervisorId = data.lineSupervisorId || 0;
        this.lineMgrId = data.lineMgrId || 0;
        this.basicSal = data.basicSal || '';
    }
}

export class StaffPolicy {
    public id: number;
    public staffId: number;
    public departmentId: number;
    public subDepartmentId: number;
    public designationId: number;
    public gradeId: number;
    public allownce: number;
    public allownceGroupId: number;
    public workTimePolicyId: number;
    public worktimePolicyGroupId: number;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.staffId = data.staffId || 0;
        this.departmentId = data.departmentId || '';
        this.subDepartmentId = data.subDepartmentId || '';
        this.designationId = data.designationId || '';
        this.gradeId = data.gradeId || '';
        this.allownce = data.allownce || '';
        this.allownceGroupId = data.allownceGroupId || '';
        this.workTimePolicyId = data.workTimePolicyId || '';
        this.worktimePolicyGroupId = data.worktimePolicyGroupId || '';
    }
}

export class StaffVehicle {
    public id: number;
    public staffId: number;
    public type: string;
    public regn: string;

    public brand: string;
    public brandMultiLingual = {

        'map': new multiLingMap
    }
    public colorMultiLingual = {

        'map': new multiLingMap
    }
    public color: string;
    public resLotNum: string;
    public expDate: string;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.staffId = data.staffId || 0;
        this.type = data.type || 'car';
        this.regn = data.regn || '';
        this.brand = data.brand || '';
        this.color = data.color || '';
        this.resLotNum = data.resLotNum || '';
        this.expDate = data.expDate || '';
        this.brandMultiLingual = data.brandMultiLingual || this.brandMultiLingual;
        this.colorMultiLingual = data.colorMultiLingual || this.colorMultiLingual;
    }
}

export class Department {
    public id: number;
    public name: string;
    public deptnameMultiLingual = {
        map : new multiLingMap
    };
    public code: string;
    public subdepartments: SubDepartment[];
    public designations: Designation[];

    constructor(data: any = {}, subdepartments: SubDepartment[] = [], designations: Designation[] = []) {
        this.id = data.id || 0;
        this.name = data.departmentName || '';
        this.deptnameMultiLingual=data.deptnameMultiLingual||this.deptnameMultiLingual;
        this.code = data.departmentCode || '';
        this.subdepartments = subdepartments || [];
        this.designations = designations || [];
    }
}

export class SubDepartment {
    public id: number;
    public name: string;
    public deptnameMultiLingual = {
        map : new multiLingMap
    };
    public code: string;
    public designations: Designation[];

    constructor(data: any = {}, designations: Designation[] = []) {
        this.id = data.id || 0;
        this.name = data.departmentName || '';
        this.code = data.departmentCode || '';
        this.deptnameMultiLingual=data.deptnameMultiLingual||this.deptnameMultiLingual;
        this.designations = designations || [];
    }
}

export class Designation {
    public id: number;
    public name: string;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.name = data.designation || '';
    }
}

export class PolicyViewObject {
    public department: string;
    public subDepartment: string;
    public subDeptnameMultiLingual={
        'map': new multiLingMap
    }
    public deptnameMultiLingual={
        'map': new multiLingMap
    }
    public designation: string;
    public grade: string;
    public allowance: string;
    public workStartTime: Date;
    public workEndTime: Date;
    public workDuration: string;
    public mealStartTime: Date;
    public mealEndTime: Date;
    public mealDuration: string;

    constructor(data: any = {}, todayDate) {
        this.department = data.department || '';
        this.subDepartment = data.subDepartment || '';
        this.deptnameMultiLingual=data.deptnameMultiLingual||this.deptnameMultiLingual;
        this.subDeptnameMultiLingual=data.subDeptnameMultiLingual||this.subDeptnameMultiLingual;
        this.designation = data.designation || '';
        this.grade = data.grade || '';
        this.allowance = data.allowance || '';
        if (data.workStartTime) {
            this.workStartTime = new Date(todayDate + data.workStartTime);
        } else {
            this.workStartTime = new Date();
        }
        if (data.workEndTime) {
            this.workEndTime = new Date(todayDate + data.workEndTime);
        } else {
            this.workEndTime = new Date();
        }
        this.workDuration = data.workDuration || '';
        if (data.mealStartTime) {
            this.mealStartTime = new Date(todayDate + data.mealStartTime);
        } else {
            this.mealStartTime = new Date();
        }
        if (data.mealEndTime) {
            this.mealEndTime = new Date(todayDate + data.mealEndTime);
        } else {
            this.mealEndTime = new Date();
        }
        this.mealDuration = data.mealDuration || '';
    }
}