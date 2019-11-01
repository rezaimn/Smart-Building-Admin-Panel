export class ManageDesignation {
    public id : number;
    public designation : string

    constructor(data : any = {}) {
        this.id = data.id || 0;
        this.designation = data.designation || '';
    }
}

export class PrepareDesignation {
    public id : number;
    public departmentId : number;
    public designation : string

    constructor(data : any = {}) {
        this.id = data.id || 0;
        this.departmentId = data.departmentId || 0;
        this.designation = data.designation || '';
    }
}
