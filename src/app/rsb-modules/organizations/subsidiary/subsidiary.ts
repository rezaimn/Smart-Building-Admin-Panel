

export class ManageSubsidiary {
    public id: number;
    public name: string;
    public address: string;

    public subsidiaryContactPersonName: string;
    public subsidiaryContactPersonMobile: string;
    public subsidiaryContactPersonEmail: string;
    public childCount: number;

    constructor(data : any = {}) {
        this.id = data.id || 0;
        this.name = data.name || '';
        this.address = data.address || '';
        this.subsidiaryContactPersonName = data.subsidiaryContactPersonName || ''; 
        this.subsidiaryContactPersonMobile = data.subsidiaryContactPersonMobile || '';
        this.subsidiaryContactPersonEmail = data.subsidiaryContactPersonEmail || '';
        this.childCount = data.childCount || 0;
    }
}
export class multiLingMap {
    public en = '';
    public fa = '';
}
export class PrepareSubsidiary {

    public id: number;
    public  nameMultiLingual={
        map: new multiLingMap
    };
    public addressMultiLingual={
        map: new multiLingMap
    }
    public subsidiaryContactPersonNameMultiLingual={
    map: new multiLingMap
}
    public subsidiaryContactPersonMobile : string;
    public subsidiaryContactPersonEmail : string;

    constructor(data : any = {}) {
        this.id = data.id || 0;
        this.addressMultiLingual = data.addressMultiLingual || this.addressMultiLingual;
        this.nameMultiLingual=data.nameMultiLingual||this.nameMultiLingual;
        this.subsidiaryContactPersonNameMultiLingual = data.subsidiaryContactPersonNameMultiLingual || this.subsidiaryContactPersonNameMultiLingual;
        this.subsidiaryContactPersonMobile = data.subsidiaryContactPersonMobile || '';
        this.subsidiaryContactPersonEmail = data.subsidiaryContactPersonEmail || '';
    }
}