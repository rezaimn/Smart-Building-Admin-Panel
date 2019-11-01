

export class Voucher {
    public id: number;
    public employeeid: string;
    public number: string;
    public amount: string;
    
    constructor(data: any = {} ) {
        this.id =  data.id || 0;
        this.employeeid = data.employeeid || '';
        this.number = data.vouchernumber || '';
        this.amount = data.amount || '';
    }
}

export interface Post {
    userId:number;
    employeeid:number;
    number:string;
    string:string
}



