export class ManageArea {
    public id: number;
    public name: string;
    public points: Array<any>;
    public description: string;
    public color: string;
    public type: string;
    constructor(data: any = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.description = data.description || '';
        this.points = data.areaPoints || [];
        this.color = data.color || '';
        this.type = data.type || '';
    }
}