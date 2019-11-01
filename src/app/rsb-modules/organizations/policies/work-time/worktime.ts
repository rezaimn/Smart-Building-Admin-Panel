export class WorkTime {
    public id : number;
    public subsidairyId : number;
    public policyName : string;
    public workStartTime : Date;
    public workEndTime : Date;
    public workDuration : number;
    public mealStartTime : string;
    public mealEndTime : Date;
    public mealDuration : number;
    public isFirstDefault : number;
    public isFirstAssisgned : number;
    public auditParams : AuditParams;
    public effectiveDate : EffectiveDate;
    public saturday : any;
    public sunday : any;
    public monday : any;
    public tuesday : any;
    public wensday : any;
    public thursday : any;
    public friday : any;
    public designationId : number;

    constructor(d : any = {}) {
        this.id = d.id || null;
        this.subsidairyId = d.subsidairyId || null;
        this.policyName = d.policyName || '';
        this.workStartTime = d.workStartTime || null;
        this.workEndTime = d.workEndTime || null;
        this.workDuration = d.workDuration || null;
        this.mealStartTime = d.mealStartTime || null;
        this.mealEndTime = d.mealEndTime || null;
        this.mealDuration = d.mealDuration || null;
        this.auditParams = d.auditParams
            ? new AuditParams(d.auditParams)
            : new AuditParams({});
        this.effectiveDate = d.effectiveDate
            ? new EffectiveDate(d.effectiveDate)
            : new EffectiveDate({});
        this.saturday = d.saturday || null;
        this.sunday = d.sunday || null;
        this.monday = d.monday || null;
        this.tuesday = d.tuesday || null;
        this.wensday = d.wensday || null;
        this.thursday = d.thursday || null;
        this.friday = d.friday || null;
        this.isFirstDefault = d.isFirstDefault || 1;
        this.isFirstAssisgned = d.isFirstAssisgned || 1;
    }
}

export class AuditParams {
    public createdBy : string;
    public lastUpdatedBy : string;
    public creationTime : Date;
    public lastUpdatedTime : Date;
    public rowVersion : number;
    public isActive : string;
    constructor(d : any = {}) {
        this.createdBy = d.createdBy || '';
        this.lastUpdatedBy = d.lastUpdatedBy || '';
        this.creationTime = d.creationTime || null;
        this.lastUpdatedTime = d.lastUpdatedTime || null;
        this.rowVersion = d.rowVersion || null;
        this.isActive = d.isActive || 'ACTIVE';
    }
}

export class EffectiveDate {
    public effectiveSrtDate : Date;
    public effectiveEndDate : Date;
    constructor(d : any = {}) {
        this.effectiveSrtDate = d.effectiveSrtDate || null;
        this.effectiveEndDate = d.effectiveEndDate || null;
    }
}

export class WorkTimeGroup {
    public id: number;
    public subsidairyId : number;
    public designationId : number;
    public workTimePolicyGroupRelation : Array<any>=[];
    constructor(d : any = {}) {
        this.id = d.number || null;
        this.subsidairyId = d.subsidairyId || null;
        this.designationId = d.designationId || null;
        this.workTimePolicyGroupRelation = d.workTimePolicyGroupRelation || [];
        // let workTimeGroup : PolicyGroup[] = [];
        // workTimeGroup.push(new PolicyGroup(d.workTimePolicyGroupRelation));
        // this.workTimePolicyGroupRelation = workTimeGroup;
    }
}
export class PolicyGroup {
    public isAssisgned : number;
    public isDefault : number;
    public workTimePolicy : WorkTime;
    constructor(d : any = {}) {
        this.isAssisgned = d.isAssisgned || 0;
        this.isDefault = d.isDefault || 0;
        this.workTimePolicy = new WorkTime(d.workTimePolicy) || new WorkTime({});
    }
}
