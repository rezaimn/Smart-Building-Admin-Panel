export class ManageDevice {
    public device_id: number;
    public type_name: string;
    public subType_name: string;
    public brand_name: string;
    public model_name: string;
    public serial_no: string;
    public searchName: string;
    public workingStatus: string;
    public notInUse: number;
    public faulty: number;
    public inUse: number;
    public inService: number;
    public outOfService: number;
    public installationStatus: string;
    constructor(d: any = {}) {
        this.device_id = d.device_id || 0;
        this.type_name = d.type_name || '';
        this.subType_name = d.subType_name || '';
        this.brand_name = d.brand_name || '';
        this.model_name = d.model_name || '';
        this.serial_no = d.serial_no || '';
        this.searchName = d.searchName || '';
        this.workingStatus = d.workingStatus || '';
        this.installationStatus = d.installationStatus || '';
        this.inUse = d.inUse || null;
        this.faulty = d.faulty || null;
        this.notInUse = d.notInUse || null;
        this.inService = d.inService || null;
        this.outOfService = d.outOfService || null;
    }
}
export class CreateDevice {
    public deviceId: number;
    public status:number;
    public modelId:number;
    public serialNum:string;
    public brand_id:number;
    public sub_type_id:number;
    public type_id:number;
    constructor(data: any = {}) {
        this.deviceId = data.deviceId || 0;
        this.status=data.status||0;
        this.modelId=data.modelId||0;
        this.serialNum=data.serialNum||'';
        this.brand_id=data.brand_id||0;
        this.sub_type_id=data.sub_type_id||0;
        this.type_id=data.type_id||0;



    }
}

export class DeviceModel {
    public deviceStatus: number;
    public id: number;
    constructor(d: any = {}) {
        this.deviceStatus = d.deviceStatus || null;
        this.id = d.id || null;
    }

}
export class PrepareDevice {
    public id: number;
    public type: string;
    public subType: string;
    public brand: string;
    public model: string;
    public serial: string;
    public workingStatus: string;
    public configFile: number;
    public configFileName: string;
    constructor(d: any = {}) {
        this.id = d.id || 0;
        this.type = d.type || '';
        this.subType = d.subType || '';
        this.brand = d.brand || '';
        this.model = d.model || '';
        this.serial = d.serial || '';
        this.workingStatus = d.workingStatus || '';
        this.configFile = d.configFile || 0;
        this.configFileName = d.configFileName || '';
    }
}
export class FilterComponent {
    public deviceTypeId: number;
    public subDeviceTypeId: number;
    public brandId: number;
    public modelId: number;
    public serialNo: string;
    public searchName: string;
    public installStatus: number;
    public workingStatus: Array<any> = [];
    public notInUse: number;
    public faulty: number;
    public inUse: number;
    public inService: number;
    public outOfService: number;
    public endLimit: number;
    public startLimit: number;
    constructor(d: any = {}) {
        this.deviceTypeId = d.deviceTypeId || null;
        this.subDeviceTypeId = d.subDeviceTypeId || null;
        this.brandId = d.brandId || null;
        this.modelId = d.modelId || null;
        this.serialNo = d.serialNo || '';
        this.searchName = d.searchName || '';
        this.installStatus = d.installStatus || 0;
        this.workingStatus = d.workingStatus || [];
        this.inUse = d.inUse || null;
        this.faulty = d.faulty || null;
        this.notInUse = d.notInUse || null;
        this.inService = d.inService || null;
        this.outOfService = d.outOfService || null;
        this.endLimit = d.endLimit || 5;
        this.startLimit = d.startLimit || 0;
    }
}
