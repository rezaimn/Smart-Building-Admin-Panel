import {Injectable} from '@angular/core';

import {SessionStorage} from 'ngx-webstorage';

@Injectable()
export class EavWrapperService {

    @SessionStorage('user')
    public loggedInUser;

    constructor() {
    }

    eavToJson(entity: any, entityType: string): any {

        let jsonObject = {};

        if (entity.entityType && entity.entityType === entityType) {
            jsonObject['id'] = entity.id;
            jsonObject['childCount'] = entity.childEntityCount;
            jsonObject['code'] = entity.entityName;

            entity
                .attributes
                .forEach(attribute => {

                    let values: any;
                    let ids: any;
                    switch (attribute.attributeType) {
                        case 'string':
                            values = attribute.attributeValues[0].value;
                            break;
                        case 'object':
                           // console.log('000000000000000', attribute.attributeName);
                            if (attribute.attributeName == 'points') {
                                values = JSON.parse(attribute.attributeValues[0].value);
                            }else{
                                values = attribute.attributeValues[0].valueMultiLingual;
                            }

                           // console.log('999999999999999', values);
                            break;
                        default:
                            values = attribute.attributeValues[0].value;
                            break;
                    }
                    jsonObject[attribute.attributeName] = values;

                });
        } else {
            jsonObject = null;
        }
        return jsonObject;
    }

    jsonToEav(entity: any, entityType: string, parentId: Number): any {

        let eavObject = {};
        eavObject['orgId'] = 1; // this.loggedInUser.org_id;
        eavObject['parentId'] = parentId;
        eavObject['entityName'] = '';
        eavObject['entityType'] = entityType;
        eavObject['attributes'] = [];

        for (var key in entity) {
            if (entity.hasOwnProperty(key)) {
                if (key === 'id') {
                    eavObject['id'] = entity[key];
                } else if (key === 'childCount') {
                    // Do Nothing : Since the child entity should not be sent to the backend.
                } else if (key === 'code') {
                    // Do Nothing : Since the code should not be sent to the backend.
                } else {
                    let entityAttribute = this.createAttribute(key, (typeof entity[key]), entity[key], entityType);
                    eavObject['attributes'].push(entityAttribute);
                }
            }
        }

        return eavObject;
    }

    createAttribute(name: string, type: string, value: any, entityType: string): any {
        let attribute: any = {};
        let tempName = name.substr(0, name.indexOf('MultiLingual'));
        if (name.includes('MultiLingual')) {
            attribute['attributeName'] = tempName;
        } else {
            attribute['attributeName'] = name;
        }
        attribute['attributeType'] = type;
        attribute['attributeValues'] = [];

        let values: any = {};

        // CAMPUS
        if (!name.includes('MultiLingual')) {
            if ((entityType === 'AREA' || entityType === 'DEVICETYPE') && type === 'object') {
                values['value'] = JSON.stringify(value);
            } else {
                values['value'] = value;
            }
        } else {
            values['value'] = value.map.en;
            values['valueMultiLingual'] = value;
        }
        attribute['attributeValues'].push(values);
        return attribute;
    }

}
