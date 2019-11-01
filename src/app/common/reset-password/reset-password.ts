export class ResetPassword {
    public newPassword: string;
    public confirmPassword: string;
    public otp: string;
    
    constructor(d: any = {}) {
        this.newPassword = d.newPassword || '';
        this.confirmPassword = d.confirmPassword || '';
        this.otp = d.otp || '';
    }
}
