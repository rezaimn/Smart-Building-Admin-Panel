export class ManageLevel {
    public id: number;
    public levelName: string;
    public levelType: string;
    public childCount: number;
    public levelDiPoint: number;
    public levelMap: string;
    constructor(data: any = {}) {
        this.id = data.id || null;
        this.levelName = data.levelName || '';
        this.levelType = data.levelType || '';
        this.childCount = data.childCount || 0;
        this.levelDiPoint = data.levelDiPoint || 0;
        this.levelMap = data.levelMap || '';
    }
}

export class PrepareLevel {
    public id: number;
    public  levelNameMultiLingual={
        map: new multiLingMap
    };
    public  levelTypeMultiLingual={
        map: new multiLingMap
    };
    public levelMap: string;
    constructor(data: any = {}) {
        this.id = data.id || null;
        this.levelNameMultiLingual = data.levelNameMultiLingual || this.levelNameMultiLingual;
        this.levelTypeMultiLingual = data.levelTypeMultiLingual || this.levelTypeMultiLingual;
        this.levelMap = data.levelMap || '';
    }
}

export class multiLingMap {
    public en = '';
    public fa = '';
}

export class MapPoint {

    public x: string;
    public y: string;

    constructor(data: any = {}) {
        this.x = data.x ? data.x : '';
        this.y = data.y ? data.y : '';
    }
}
