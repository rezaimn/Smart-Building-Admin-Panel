export class Device{
    devicetypeid : number;
    devicetypename : string;
    hours : number;
    minutes : number;
    offtime : string;
    ontime : string;
    seconds : number;
}

export class DeviceType{
    createdby : number;
    id : number;
    name : string;
    code : string;
}