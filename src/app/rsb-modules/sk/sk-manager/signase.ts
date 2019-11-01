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





