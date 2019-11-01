export class AddMenu {
    public id: number;
    public menuitem: string;
    public quantity: string;
    public amount: string;
    
    constructor(data: any = {} ) {
        this.id =  data.id || 0;
        this.menuitem = data.menuitem || '';
        this.quantity = data.quantity || '';
        this.amount = data.amount || '';
    }
}


export class MenuList {
    public id: number;
    public date: string;
    public menuitems : AddMenu[];

    constructor(data: any = {} ) {
        this.id =  data.id || 0;
        this.date = data.date || '';
        this.menuitems = data.menuitem ;

    }
}


