

export class ManageDepartment {
    public id: number;
    public nameMultiLingual = {
        map: new multiLingMap
    };
    public code: string;
    public subDepartments: Array<any>;
    public designations: Array<any>;
    public allocatedArea: Array<any>;
    public allocatedAreaCount: number;
    public areaNames: Array<any>;

    constructor(data: any = {}) {
        this.id = data.id || 0;

        this.nameMultiLingual = data.nameMultiLingual || this.nameMultiLingual;

        this.code = data.code || '';
        this.subDepartments = data.subDepartments || [];
        this.designations = data.designations || [];
        this.allocatedArea = data.allocatedArea || [];
        this.allocatedAreaCount = data.allocatedAreaCount || 0;
        this.areaNames = data.areaNames || [];
    }
}

export class PrepareDepartment {
    public id: number;
    public deptnameMultiLingual = {
        map : new multiLingMap
    };
    public departmentName:string;
    public departmentCode: string;
    public parentDepartmentId: number;
    public areaIds: Array<number> = [];
    public orgId: number;
    public subsidiaryId: number;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.deptnameMultiLingual = data.deptnameMultiLingual || this.deptnameMultiLingual;
        this.departmentCode = data.departmentCode || '';
        this.parentDepartmentId = 0;
        this.departmentName=data.departmentName||'';
        this.areaIds = data.areas || [];
        this.orgId = data.orgId || 1;
        this.subsidiaryId = data.subsidiaryId || 0;
    }
}
export class multiLingMap {
    public en = '';
    public fa = '';
}