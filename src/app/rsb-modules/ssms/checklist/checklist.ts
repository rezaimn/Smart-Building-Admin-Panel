export class Security {
    public id: number;
    public name: string;
    public points: Array<any>;
    public description: string;
    public color: string;
    public type: string;
    constructor(data: any = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.description = data.description || '';
        this.points = data.areaPoints || [];
        this.color = data.color || '';
        this.type = data.type || '';
    }
}


export class DeviceSecurity {
    public id: number;
    public areaIds: Array<number>;
    public energyModeId: any;
    public fromTime: Date;
    public name: string;
    public severityId: any;
    public toTime: Date;
    constructor(data: any = {}) {
        this.id = data.id || null;;
        this.areaIds = data.areaIds || [];
        this.energyModeId = data.energyModeId || '';
        this.fromTime = data.fromTime || null;
        this.name = data.name || '';
        this.severityId = data.severityId || '';
        this.toTime = data.toTime || null;
    }
}