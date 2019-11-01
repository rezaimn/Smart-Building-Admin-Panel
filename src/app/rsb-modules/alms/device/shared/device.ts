export class Device{
    edgeId:number;
    deviceType:DeviceType;
    schedules:Schedule[];
    constructor(data:any={}){
        this.edgeId=data.edgeId||0;
        this.schedules=data.schedule||[];
        this.deviceType=data.deviceType||new DeviceType({});
    }

}
export class DeviceType{
    id:number;
    faName:string;
    enName:string;
    constructor(data:any={}){
        this.id=data.id||0;
        this.faName=data.faName||'';
        this.enName=data.enName||'';
    }
}
export class Schedule{
    id:number;
    onTime:string;
    offTime:string;
    constructor(data:any={}){
        this.id=data.id||0;
        this.onTime=data.onTime||'';
        this.offTime=data.offTime||'';
    }
}