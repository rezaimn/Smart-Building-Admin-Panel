export class Sk {
    public id: number;
    public name: string;
    public buildingid: number;
    public buildingname: string;
    public ipAddress: string;
    public os: string;
    public campusId: string;
    public campusName: string;
    
    public floorId: string;
    public floorName: string;
    
    public url: string;
    public size: string;
    public type : string;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.name = data.name || '';
        this.type = data.type || '';
        
        this.buildingname = data.buildingname || '';
       
        this.buildingid = data.buildingid || '';
        this.ipAddress = data.ipAddress || '';
        this.os = data.os || '';
        this.campusId = data.campusId || '';
        this.floorId = data.floorId || '';
        this.campusName = data.campusName || '';
        this.floorName = data.floorName || '';
        
        this.url = data.url || '';
        this.size = data.size || '';        
    }
}

export class skFileAttach{
    public type: "SkDeviceFile";
    public deviceId:number;
    public deviceName:string;
    public files:fileInfo[];
    constructor(data:any={}){
        this.deviceName=data.deviceName||'';
        this.deviceId=data.deviceId||0;
        this.files=data.files||[];
    }
}
export class fileInfo {
    public fileId:number;
    public dailyScheduleTime:string;
    public repeatAgain:boolean;
    public presence:boolean;
    public isUpdated:boolean;
    public isSaved:boolean;
    constructor(data:any={}){
        this.fileId=data.fileId||0;
        this.dailyScheduleTime=data.dailyScheduleTime||'';
        this.repeatAgain=data.repeatAgain||false;
        this.presence=data.presence||false;
        this.isUpdated=data.isUpdated||false;
        this.isSaved=data.isSaved||false;
    }
}


