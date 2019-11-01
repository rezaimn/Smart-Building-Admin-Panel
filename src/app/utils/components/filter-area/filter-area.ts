export class FilterArea {
    public id: number;
    public campusName: string;
    // public capmusPoints: Array<any>;
    // public areaDescription: string;
    // public areaColor: string;
    // public areaType: string;
    constructor(data: any = {}) {
        this.id = data.id || 1;
        this.campusName = data.campusName || 'Test';
        // this.areaDescription = data.areaDescription || '';
        // this.areaPoints = data.areaPoints || [];
        // this.areaColor = data.areaColor || '';
        // this.areaType = data.areaType || '';
    }
}
