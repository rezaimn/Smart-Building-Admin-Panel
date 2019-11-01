
export class visitorInfo {
    public id: number;
    public purpose:string;
    public cardholder=new cardHolder({});
    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.purpose = data.purpose || '';
        this.cardholder=data.cardholder||this.cardholder;
    }
}
export class cardHolder {
    public loader:boolean;
    public id:number;
    public employeeId: string;
    public firstName: string;
    public lastName: string;
    public startDate=null;
    public endDate=null;
    public contractStartDate=null;
    public contractEndDate=null;
    public enabled:boolean;
    public firstNameMultiLingual = {
        'map': new multiLingMap
    }
    public lastNameMultiLingual = {
        'map': new multiLingMap
    }
    public mobileNum: string;
    public cardNumber:string;
    public department: Department=new Department({});
    public subDepartment: SubDepartment=new SubDepartment({});
    workgroup=new workGroup({});
    accessElement=new accessLevel({});
    timeSchedule=new timeSchedule({});
    constructor(data: any = {}) {
        this.loader=data.loader||false;
        this.id=data.id||0;
        this.enabled=data.enabled||false;
        this.employeeId = data.employeeId || 0;
        this.firstName = data.firstName || '';
        this.firstNameMultiLingual = data.firstNameMultiLingual || this.firstNameMultiLingual;
        this.lastName = data.lastName || '';
        this.lastNameMultiLingual = data.lastNameMultiLingual || this.lastNameMultiLingual;
        this.mobileNum = data.mobileNum || '';
        this.department =data.department||this.department;
        this.subDepartment = data.subDepartment||this.subDepartment;
        this.cardNumber = data.cardNumber;
        this.workgroup=data.workgroup||this.workgroup;
        this.accessElement=data.accessElement||this.accessElement;
        this.startDate=data.startDate||null;
        this.endDate=data.endDate||null;
        this.contractStartDate=data.contractStartDate||null;
        this.contractEndDate=data.contractEndDate||null;
    }
}
export class Department {
    public id: number;
    public name={
        'map': new multiLingMap
    }
    public code: string;
    public subdepartments: SubDepartment[]=[];
    constructor(data: any = {}, subdepartments: SubDepartment[] = []) {
        this.id =  data.id || 0;
        this.name = data.departmentName || '';
        this.code = data.departmentCode || '';
        this.subdepartments = subdepartments || [];
    }
}

export class SubDepartment {
    public id: number;
    public name={
        'map': new multiLingMap
    }
    public code: string;


    constructor(data: any = {}) {
        this.id =  data.id || 0;
        this.name = data.departmentName || '';
        this.code = data.departmentCode || '';
    }
}

export class workGroup {
    id:number= 0;
    type:string;
    public name = {
        'map': new multiLingMap
    }
    startDate:string=null;
    endDate:string=null;
    startDateJ:string=null;
    endDateJ:string=null;
    accessElement:accessGroup=new accessGroup({});
    constructor(data: any = {}) {
        this.type=data.type||'';
        this.id=data.id||0;
        this.name=data.name||this.name;
        this.endDate=data.endDate||null;
        this.startDate=data.startDate||null;
        this.endDateJ=data.endDateJ||null;
        this.startDateJ=data.startDateJ||null;
        this.accessElement=data.accessElement||this.accessElement;
    }
}
export class accessGroup {
    public type:string= "ZONE";
    public id:number= 0;
    public name = {
        'map': new multiLingMap
    }
    public timeSchedule:timeSchedule;
    public areas:accessLevel[]=[];
    constructor(data: any = {}) {
        this.type=data.type||this.type;
        this.id=data.id||0;
        this.name=data.name||this.name;
        this.timeSchedule=data.timeSchedule||this.timeSchedule;
        this.areas=data.areas||[];

    }
}
export class accessLevel {
    public type:string= "AREA";
    public id:number= 0;
    public name = {
        'map': new multiLingMap
    }
    hasAccess:boolean=false;
    public timeSchedule:timeSchedule;
    public doors:accessComponent[]=[];
    constructor(data: any = {}) {
        this.type=data.type||this.type;
        this.id=data.id||0;
        this.name=data.name||this.name;
        this.timeSchedule=data.timeSchedule||new timeSchedule({});
        this.doors=data.doors||[];
        this.hasAccess=data.hasAccess||false;

    }
}
export class accessComponent {
    type:string= "DOOR";
    id:number= 0;
    public name = {
        'map': new multiLingMap
    }
    timeSchedule:timeSchedule;
    hasAccess:boolean=false;
    constructor(data: any = {}) {
        this.type=data.type||this.type;
        this.id=data.id||0;
        this.name=data.name||this.name;
        this.timeSchedule=data.timeSchedule||this.timeSchedule;
        this.hasAccess=data.hasAccess||false;
    }
}
export class multiLingMap {
    public en = '';
    public fa = '';
}
export class timeSchedule {
    id=0;
    public name = {
        'map': new multiLingMap
    }
    constructor(data){
        this.id=data.id||0;
        this.name=data.name||this.name;
    }
}