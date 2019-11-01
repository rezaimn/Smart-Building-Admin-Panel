export class ManageSubDepartment {
    public id : number;
    public departmentName : string;
    public departmentNameMultiLingual ={
        map : new multiLingMap
    };
    public departmentCode : string;
    public subDepartments : Array < any >;
    public designations : Array < any >;
    public areaNames : Array < string >;
    public areas :any[];
    constructor(data : any = {}) {
        this.id = data.id || 0;
        this.departmentName = data.name || '';
        this.departmentNameMultiLingual = data.departmentNameMultiLingual || this.departmentNameMultiLingual;
        this.departmentCode = data.code || '';
        this.designations = data.designations || [];
        this.subDepartments = data.subDepartments || [];
        this.areaNames = data.areaNames || [];
        this.areas = data.areas || [];
    }
}
export class multiLingMap {
    public en = '';
    public fa = '';
}
export class PrepareSubDepartment {
    public id : number;
    public departmentName : string;
    public deptnameMultiLingual ={
        map : new multiLingMap
    };
    public departmentCode : string;
    public parentDepartmentId : number;
    public orgId : number;
    public subsidiaryId : number;
    public areas : Array < any >;
    public areaIds : Array < any >;
    // public allocatedArea:Array<any>;

    constructor(data : any = {}) {
        this.id = data.id || 0;
        this.departmentName = data.departmentName || '';
        this.deptnameMultiLingual = data.deptnameMultiLingual || this.deptnameMultiLingual;
        this.departmentCode = data.departmentCode || '';
        this.parentDepartmentId = data.parentDepartmentId || 0;
        this.subsidiaryId = data.subsidiaryId || 0;
        this.orgId = data.orgId || 0;
        this.areas = data.areas || [];
        this.areaIds = data.areaIds || [];
    }
}
export class ManageDesignation {
    public id : number;
    public designation : string;
    

    constructor(data : any = {}) {
        this.id = data.id || 0;
        this.designation = data.designation || '';
        
    }
}
export class PrepareDesignation {
    public departmentId : number;
    public designation : string;

    constructor(data : any = {}) {
        this.departmentId = data.departmentId || 0;
        this.designation = data.designation || '';
    }
}