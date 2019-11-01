export class ManageRole {

    public roleList=[];

    constructor() {
    }
}
export class multiLingMap {
    public en = '';
    public fa = '';
}
export class PrepareRole {
    public modules=[];
    public role={
        "id": 0,
        "roleName": "",
        "roleMultiLingual":{
            "map": {
                "en":"",
                "fa":""
            }
        }
    }
    constructor() {
    }
}
export class Modules {

    module={
        "id":0,
        "code": "",
        "desc": "",
        "name": "",
        "screens": [
            ]
    }
    permission={
        "R":false,
        "W":false,
        "access": 2,
        "accessType": 0,
        "deleteAccess": 0,
        "editAccess": 0,
        "exportAccess": 0,
        "importAccess": 0,
        "listAccess": 0,
        "massUpdate": 0,
        "view": 0

    }
    constructor() {
    }
}
export class Screens {
        permission={
            "R":false,
            "W":false,
            "access": 2,
            "accessType": 0,
            "deleteAccess": 0,
            "editAccess": 0,
            "exportAccess": 0,
            "importAccess": 0,
            "listAccess": 0,
            "massUpdate": 0,
            "view": 0
        }
        screen={
            "code": "",
            "description": "",
            "id": 0,
            "screenName": ""
        }
    constructor() {
    }
}
