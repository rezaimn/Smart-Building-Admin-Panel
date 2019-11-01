export class ManageCampus {
    public id : number;

    public  nameMultiLingual={
        map: new multiLingMap
    };

    public  campusAddressMultiLingual ={
        map: new multiLingMap
    };
    public childCount : number;
    public campusGates : number;
    public campusPhone : number;
    public campusMap : string;
    constructor(data : any = {}) {
        this.id = data.id || '';
        this.nameMultiLingual = data.nameMultiLingual || this.nameMultiLingual;
        this.campusAddressMultiLingual = data.campusAddressMultiLingual || this.campusAddressMultiLingual;
        this.childCount = data.childCount || 0;
        this.campusGates = data.campusGates || 0;
        this.campusPhone = data.campusPhone || null;
        this.campusMap = data.campusMap || '';
    }
}
export class multiLingMap {
    public en = '';
    public fa = '';
}
export class PrepareCampus {
    public id : number;

    public  nameMultiLingual={
        map: new multiLingMap
    };

    public  campusAddressMultiLingual ={
        map: new multiLingMap
    };
    public campusPhone : number;
    public campusMap : string;
    constructor(data : any = {}) {
        this.id = data.id || '';
        this.nameMultiLingual = data.nameMultiLingual || this.nameMultiLingual;
        this.campusAddressMultiLingual = data.campusAddressMultiLingual || this.campusAddressMultiLingual;
        this.campusPhone = data.campusPhone || null;
        this.campusMap = data.campusMap || '';
    }
}
