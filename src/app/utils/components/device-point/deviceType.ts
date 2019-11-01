export class DeviceType {
    public deviceId: string;
    public deviceName: string;
    public deviceModel: number;
    public deviceBrand: number;
    public deviceSubType: number;
    public deviceSerialNo: number;
    public deviceFileId: number;
    public ipAddress: string;
    public installationLabel: string;
    public applianceType:string;
    constructor(data: any = {}) {
        this.deviceId = data.deviceId || '';
        this.deviceName = data.deviceName || '';
        this.deviceModel = data.deviceModel || null;
        this.deviceBrand = data.deviceBrand || null;
        this.deviceSubType = data.deviceSubType || null;
        this.deviceSerialNo = data.deviceSerialNo || null;
        this.deviceFileId = data.deviceFileId || null;
        this.ipAddress = data.ipAddress || '';
        this.installationLabel = data.installationLabel || '';
    }
}
export class CreateConfig {
    public id: number;
    public ipAddress: string;
    public installationLabel: string;
    public points: Points;
    public appliance:appliance;
    public backeEndDeviceId:string;
    public deviceName:string;
    constructor(d: any = {}) {
        this.id = d.id || 0;
        this.ipAddress = d.ipAddress || '';
        this.installationLabel = d.installationLabel || '';
        this.points = new Points(d.points) || new Points({});
        this.backeEndDeviceId = d.backenddeviceid || '';
        this.deviceName = d.devicename || '';
        this.appliance=d.appliance||new appliance({});
        
    }
}
export class appliance{
    public id:number;
    constructor(data:any={}){
        this.id=data.id||0;
    }
}
export class Points {
    public id: number;
    public x: string;
    public y: string;
    public areaId: number;
    constructor(d: any = {}) {
        this.id = d.id || 0;
        this.x = d.x || '';
        this.y = d.y || '';
        this.areaId = d.areaId || 0;
    }
}

