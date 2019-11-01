export class OrganizationModel {
    public name: string;
    public office_name: string;
    public address: string;
    public city: string;
    public region: string;
    public country: string;
    public contact_person_name: string;
    public contact_person_email_id: string;
    public contact_person_mobile: string

    constructor(data: any = {}) {
        this.name = data.name || '';
        this.office_name = data.office_name || '';
        this.address = data.address || '';
        this.city = data.city || '';
        this.region = data.region || '';
        this.country = data.country || '';
        this.contact_person_name = data.contact_person_name || '';
        this.contact_person_email_id = data.contact_person_email_id || '';
        this.contact_person_mobile = data.contact_person_mobile || '';
    }
}

export class OnMAdminModel {
    public name: string;
    public family_name: string;
    public email: string;
    public phone_number: string;
    public email_verified: boolean;
    public username: string;
    public phone_verified: boolean;
    public user_id: number;
    public picture: any;
    public password: string;
    public active: boolean;
    public roles: any;
    public orgId: number;

    constructor(data: any = {}, orgId: number) {
        this.name = data.name || '';
        this.family_name = data.family_name || '';
        if (data.email !== undefined) {
            this.email = data.email.toUpperCase()
        } else {
            this.email = '';
        }
        this.phone_number = data.phone_number || '';
        this.email_verified = data.email_verified || false;
        this.username = data.username || '';
        this.phone_verified = data.phone_verified || false;
        this.user_id = data.user_id || 0;
        this.picture = data.picture || null;
        this.password = data.password || '';
        this.active = data.active || false;
        this.orgId = orgId;
        this.roles = [{ "roleName": "OMSADMIN" }];
    }
}