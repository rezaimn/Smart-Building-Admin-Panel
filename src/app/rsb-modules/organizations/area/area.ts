
export class MapPoint {

    public x: string;
    public y: string;

    constructor(data: any = {}) {
        this.x = data.x ? data.x : '';
        this.y = data.y ? data.y : '';
    }
}
export class multiLingMap {
    public en = '';
    public fa = '';
}
export class ManageArea {
    public id: number;

    public  nameMultiLingual={
        map: new multiLingMap
    };
    public points: Array<any>;
    public  descriptionMultiLingual={
        map: new multiLingMap
    };
    public color: string;

    public  typeMultiLingual={
        map: new multiLingMap
    };
    constructor(data: any = {}) {
        this.id = data.id || null;
        this.nameMultiLingual = data.nameMultiLingual || this.nameMultiLingual;
        this.descriptionMultiLingual = data.descriptionMultiLingual || this.descriptionMultiLingual;
        this.points = data.areaPoints || [];
        this.color = data.color || '';
        this.typeMultiLingual = data.typeMultiLingual || this.typeMultiLingual;
    }
}

export class PrepareArea {
    public id: number;
    public  nameMultiLingual={
        map: new multiLingMap
    };
    public points: Array<any>;
    public  descriptionMultiLingual={
        map: new multiLingMap
    };
    public color: string;
    public  typeMultiLingual={
        map: new multiLingMap
    };
    constructor(data: any = {}) {
        this.id = data.id || null;
        this.points = data.points || [];
        this.nameMultiLingual = data.nameMultiLingual || this.nameMultiLingual;
        this.descriptionMultiLingual = data.descriptionMultiLingual || this.descriptionMultiLingual;
        this.color = data.color || '';
        this.typeMultiLingual = data.typeMultiLingual || this.typeMultiLingual;
    }
}

export class PrepareAccess {
    public id: number;
    public name: string;
    public points: any;
    public description: string;
    public accessColor: string;
    public deviceType: string;
    public deviceCode: string;

    constructor(data: any = {}) {
        this.id = data.id || null;
        this.points = data.points || {};
        this.name = data.name || '';
        this.description = data.description || '';
        this.accessColor = data.accessColor || '';
        this.deviceType = data.deviceType || '';
        this.deviceCode = data.deviceCode || '';
    }
}

export class InstallationPointListItem {
    public id: number;
    public coordinate: MapPoint;
    public deviceType: string;
    // public device: InstallationPointDevice;
    public deviceColor: string;
    public deviceCode: string;
    public areaId: string;
    public x: string;
    public y: string;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.coordinate = new MapPoint(data);
        this.deviceType = data.deviceType || '';
        this.areaId = data.areaId || '';
        this.x = data.x ? data.x : '';
        this.y = data.y ? data.y : '';
        // if (data.devices !== null && data.devices.length > 0) {
        //     this.device = new InstallationPointDevice(data.devices[0]);
        // } else {
        //     this.device = null;
        // }
    }
}

export class InstallationPoint {
    public x: string;
    public y: string;
    public areaId: number;
    public deviceType: DeviceType;
    // public devices: InstallationPointDevice[];

    constructor(data: any = {}, area: ManageArea) {
        this.x = data.points[0].x;
        this.y = data.points[0].y;
        this.areaId = area.id;
        // let devicesList: InstallationPointDevice[] = [];
        // devicesList.push(new InstallationPointDevice(data));
        // this.devices = devicesList;
        this.deviceType = new DeviceType(data.deviceType) || new DeviceType({});
    }
}

export class DeviceType {
    public id: number;
    public name: string;
    constructor(d: any = {}) {
        this.id = d.id || 0;
        this.name = d.name || '';
    }
}
export class InstallationPointDevice {
    public deviceId: number;
    public deviceSerialNo: string;
    public deviceName: string;
    public description: string;
    public bondnumber: string;
    public deviceType: string;
    public deviceModelNo: string;
    public deviceStatus: string;

    constructor(data: any = {}) {
        this.deviceId = data.deviceId || 0;
        this.deviceSerialNo = data.deviceSerialNo || '';
        this.deviceName = data.deviceName || '';
        this.description = data.description || '';
        this.bondnumber = data.bondnumber || '';
        this.deviceType = data.deviceType || '';
        this.deviceModelNo = data.deviceModelNo || '';
        this.deviceStatus = data.deviceStatus || '';
    }
}