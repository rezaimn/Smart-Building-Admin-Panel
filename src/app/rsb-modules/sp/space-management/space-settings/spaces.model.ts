export class SpacesModel {
    orgId:number;
    spaceSettingsList=[];
    constructor(){
        this.orgId= 1;
        this.spaceSettingsList= [
            {
                "spaceType": "ORGANIZATION",
                "available": true
            },
            {
                'spaceType': 'SUBSIDIARY',
                'available': true
            },
            {
                'spaceType': 'CAMPUS',
                'available': true
            },
            {
                'spaceType': 'STRUCTURE',
                'available': true
            },
            {
                'spaceType': 'LEVEL',
                'available': true
            },
            {
                'spaceType': 'AREA',
                'available': true
            }
        ]
    }



}