export class TypeEntities {
    entities = [];

    constructor() {
        this.entities = [
            'applianceType',
            'deviceType',
            'subsidiaryType',
            'campusType',
            'buildingType',
            'levelType',
            'areaType'
        ]
    }

}
export class TypeModelList {
    typeList: TypeModel[];

    constructor(data:any={}){
        this.typeList=data.typeList||[];

    }
}
export class TypeModel {
    id: number;
    faName: string;
    enName: string;
    abbreviation: string;
    constructor(data:any={}){
        this.id=data.id||0;
        this.enName=data.enName||'';
        this.faName=data.faName||'';
        this.abbreviation=data.abbreviation||'';
    }
}