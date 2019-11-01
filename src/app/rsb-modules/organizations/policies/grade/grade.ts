export class ManageGrade {
    public id: number;
    public gradeName: string;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.gradeName = data.gradeName ? data.gradeName : '';
    }
}
export class PrepareGrade {
    public id: number;
    public gradeName: string;
    public subsidairyId: number;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.gradeName = data.gradeName || '';
        this.subsidairyId = data.subsidairyId || 0;
    }
}