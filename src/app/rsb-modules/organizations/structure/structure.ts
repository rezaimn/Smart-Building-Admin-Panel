

export interface Structure {
}

// export interface Subsidiary { }

export class ManageStructure {
    public id: number;
    public  nameMultiLingual={
        map: new multiLingMap
    };
    public buildingType: string;
    public description: string;
    public childCount:number;

    constructor(data : any = {}) {
        this.id = data.id || 0;
        this.nameMultiLingual = data.nameMultiLingual || this.nameMultiLingual;
        this.buildingType = data.buildingType || '';
        this.description = data.description || '';
        this.childCount = data.childCount || '';
    }
}
export class multiLingMap {
    public en = '';
    public fa = '';
}
export class PrepareStructure {
    public id: number;
    public buildingTypeMultiLingual={
        map: new multiLingMap
    }
    public  nameMultiLingual={
        map: new multiLingMap
    };
    public buildingType: string;
    public  descriptionMultiLingual={
        map: new multiLingMap
    };

    constructor(data : any = {}) {
        this.id = data.id || 0;

        this.nameMultiLingual = data.nameMultiLingual || this.nameMultiLingual;
        this.buildingType = data.buildingType || '';
        this.buildingTypeMultiLingual = data.buildingTypeMultiLingual || this.buildingTypeMultiLingual;
        this.descriptionMultiLingual = data.descriptionMultiLingual || this.descriptionMultiLingual;
    }
}
