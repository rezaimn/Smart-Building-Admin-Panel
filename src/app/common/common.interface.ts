export class User {
    public id: number;
    public first_name: string;
    public last_name: string;
    public email: string;
    public mobile: string; 
    public user_role: string;
    public org_id: number;
    public uid: string;
    public sessionToken: string;
    public csrfToken: string;
    public accessToken: string;
    public tokenId: string;
    public response: string;
    public roles: any;
    public staff_id : any;
    public user_id: any;
    public subsidiaryId: any;
    public designationId : any;
    public designationName : any;
    public managerName : any;
    public supervisorName : any;
    public photoUrl: any;
    public employeeId : any;

    constructor(data: any = {}) {
        this.id = data.id ? data.id : 0;
        this.first_name = data.username || '';
        this.last_name = data.family_name || '';
        this.email = data.email || '';
        this.mobile = data.phone_number || '';
        // this.user_role = data.roles[0].roleName;
        this.org_id = data.orgId || 0;
        this.uid = data.uid || '';
        this.sessionToken = data.sessionToken || '';
        this.csrfToken = data.csrfToken || '';
        this.accessToken = data.accessToken || '';
        this.tokenId = data.tokenId || '';
        this.response = data.response || null;
        this.staff_id = data.staffId;
        this.user_id = data.user_id;
        this.managerName = data.managerName;
        this.supervisorName = data.supervisorName;
        this.photoUrl = data.photoUrl;
        this.employeeId = data.employeeId;
        this.subsidiaryId =data.subsidiaryId ? data.subsidiaryId : 0;
        this.designationId =data.designationId ? data.designationId : 0;
        this.designationName = data.designationName || '';

        // if (data.roles !== undefined) {
        //     data.roles.forEach(role => {
        //         if (role.roleName === 'SYSADMIN') {
        //             this.user_role = 'SUPER_ADMIN';
        //         } else {
        //             // this.user_role = 'ONM_ADMIN';
        //             this.user_role = role.roleName;
        //         }
        //     });
        // } else {
        //     this.user_role = 'SUPER_ADMIN';
        // }
    }
}

export class Organization {
    public id: number;
    public name: string;
    public office_name: string;
    public email: string;
    public phone: string; 
    public address: string;
    public contact_person: string;
    public region: string;
    public country: string;

    constructor(data: any = {}) {
        this.id = data.id || 0;
        this.name = data.name || '';
        this.office_name = data.last_name || '';
        this.email = data.email || '';
        this.phone = data.phone || '';
        this.address = data.address || '';
        this.contact_person = data.contact_person || '';
        this.region = data.region || '';
        this.country = data.country || '';
    }
}

export class BreadCrum {
    public name: string;
    public link: string;

    constructor(name, link) {
        this.name = name;
        this.link = link;
    }
}

export class SearchData {
    public id : number;
    public content : string;

    constructor(data: any = {}){
        this.id = data.id;
        this.content = data.content;
    }
}