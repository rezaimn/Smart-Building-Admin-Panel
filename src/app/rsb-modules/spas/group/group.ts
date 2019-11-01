export class PersonalInfo {
    public id: number;
    public firstName: string;
    public firstNameMultiLingual = {
        'map': new multiLingMap
    }


public lastName: string;
    public phtoId: string;
    public dob: Date;
    public email: string;
    public fatherName: string;
    public mobileNum: string;
    public nationalId: string;
    public cardNumber:string;
    public extAccessId:string;
    public departmentId:any;
    public subDepartmentId:any;
    public resAddress: string;
    public resPhoneNum: string;
    public resAddressZipcode: string;
    public purpose:string;

    public permAddress: string;
    public permAddressZipcode: string;
    public permPhoneNum: string;

    public ssn: string;
    public organization: any;
    public subsidyId: number;

    public profileImage: any;
    public employmentDetails: any;
    public department: any;
    public subDepartment: any;

    constructor(data: any = {}, organizationId, subsidiaryId) {
        this.id = data.id || 0;
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.firstNameMultiLingual=data.firstNameMultiLingual||this.firstNameMultiLingual;
        if (data.dob) {
            this.dob = new Date(data.dob);
        } else {
            this.dob = new Date();
        }
        this.email = data.email || '';
        this.phtoId = data.phtoId || '';
        this.fatherName = data.fatherName || '';
        this.mobileNum = data.mobileNum || '';
        this.nationalId = data.nationalId || '';
        this.permAddress = data.permAddress || '';
        this.permPhoneNum = data.permPhoneNum || '';
        this.permAddressZipcode = data.permAddressZipcode || '';
        this.resAddress = data.resAddress || '';
        this.resPhoneNum = data.resPhoneNum || '';
        this.resAddressZipcode = data.resAddressZipcode || '';
        this.ssn = data.ssn || '';
        this.organization = { id : organizationId };
        this.subsidyId = subsidiaryId;
        this.profileImage = '';
        this.cardNumber = data.cardNumber;
        this.departmentId = data.departmentId;
        this.department = '';
        this.subDepartment = '';
        this.purpose = data.purpose||'';

    }
}

export class multiLingMap {
    public en = '';
    public fa = '';
}
