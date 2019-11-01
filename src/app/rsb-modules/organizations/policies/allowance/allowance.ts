export class PrepareAllowance {
    public id: number;
    public allowanceName: string;
    public parkingAmount: number;
    public parkingPeriod: number;
    public mealsAmount: number;
    public mealsPeriod: number;
    public gradePolicy: any;
    public designationId: number;
    public auditParams: AuditParams;
    public effectiveDate: EffectiveDate;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.designationId = data.designationId || 0;
        this.allowanceName = data.allowanceName || '';
        this.parkingAmount = data.parkingAmount || 0;
        this.parkingPeriod = data.parkingPeriod || '';
        this.mealsAmount = data.mealsAmount || 0;
        this.mealsPeriod = data.mealsPeriod || '';
        this.gradePolicy = data.gradePolicy || '';
        this.auditParams = data.auditParams
            ? new AuditParams(data.auditParams)
            : new AuditParams({});
        this.effectiveDate = data.effectiveDate
            ? new EffectiveDate(data.effectiveDate)
            : new EffectiveDate({});
    }
}
export class AuditParams {
    public createdBy: string;
    public lastUpdatedBy: string;
    public creationTime: Date;
    public lastUpdatedTime: Date;
    public rowVersion: number;
    public isActive: string;
    constructor(d: any = {}) {
        this.createdBy = d.createdBy || '';
        this.lastUpdatedBy = d.lastUpdatedBy || '';
        this.creationTime = d.creationTime || null;
        this.lastUpdatedTime = d.lastUpdatedTime || null;
        this.rowVersion = d.rowVersion || null;
        this.isActive = d.isActive || 'ACTIVE';
    }
}

export class EffectiveDate {
    public effectiveSrtDate: Date;
    public effectiveEndDate: Date;
    constructor(d: any = {}) {
        this.effectiveSrtDate = d.effectiveSrtDate || null;
        this.effectiveEndDate = d.effectiveEndDate || null;
    }
}