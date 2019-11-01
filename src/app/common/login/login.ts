export class Login {
    public username: string;
    public password: string;
    constructor(d: any = {}) {
        this.username = d.username || '';
        this.password = d.password || '';
    }
}
