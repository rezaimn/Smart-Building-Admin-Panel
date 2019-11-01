export class ManageArea {
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
export class MapPoint {

    public x: string;
    public y: string;

    constructor(data: any = {}) {
        this.x = data.x ? data.x : '';
        this.y = data.y ? data.y : '';
    }
}
export class InstallationPoint {
    public x: string;
    public y: string;
    public areaId: number;
    public devices: InstallationPointDevice[];

    constructor(data: any = {}, area: ManageArea) {
        this.x = data.points[0].x;
        this.y = data.points[0].y;
        this.areaId = area.id;
        let devicesList: InstallationPointDevice[] = [];
        devicesList.push(new InstallationPointDevice(data));
        this.devices = devicesList;
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
export class PointDetail {
    public id: number;
    public x: string;
    public y: string;
    public areaId: number;
    constructor(data: any = {}) {
        this.x = data.x ? data.x : '';
        this.y = data.y ? data.y : '';
    }
}