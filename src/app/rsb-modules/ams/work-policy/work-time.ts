export class WorkTime {
    public id : number;
    public subsidairyId : number;
    public shifttype : number;
    public policyName : string;
    public workStartTime : Date;
    public workEndTime : Date;
    public workDuration : number;
    public mealStartTime : string;
    public mealEndTime : Date;
    public mealDuration : number;
    public dayfrom :string;
    public dayto :string;
    constructor(d : any = {}) {
        this.id = d.id || null;
        this.subsidairyId = d.subsidairyId || null;
        this.shifttype = d.shifttype || null;
        this.policyName = d.policyName || '';
        this.workStartTime = d.workStartTime || null;
        this.workEndTime = d.workEndTime || null;
        this.workDuration = d.workDuration || null;
        this.mealStartTime = d.mealStartTime || null;
        this.mealEndTime = d.mealEndTime || null;
        this.mealDuration = d.mealDuration || null;
        this.dayfrom = d.dayfrom || null;
        this.dayto = d.dayto || null;
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
