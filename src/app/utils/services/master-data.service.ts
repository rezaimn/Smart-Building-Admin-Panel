import { Injectable } from '@angular/core';
import {Headers, RequestOptions, Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs/Subject';
import { HttpService } from './http.service';

@Injectable()
export class MasterDataService {
  devicePointColor = {
    "Camera": "#4e53d6",
    "Smart Plug": "#db7438",
    "Smoke Detector": "#858585",
    "Window Contact": "#dc8a8a",
    "Siren":"#c72d2a",
    "Water Leakage": "#2a79a8",
    "PARKING SENSOR":"#d83ecf",
    "Thermostat":"#ee4a67",
    "Glass Break": "#05a814",
    "LIGHTING":"#ad8e17",
    "Display":"#717ec7",
    "Kiosk":"#0308aa"
  };
    deviceIcons = {
        "Camera": "Camera.png",
        "Smart Plug": "Smart Plug.png",
        "Smoke Detector": "Smoke Detector.png",
        "Window Contact": "Window Contact.png",
        "Siren":"Siren.png",
        "Water Leakage": "Water Leakage.png",
        "PARKING SENSOR":"PARKING SENSOR.png",
        "Thermostat":"Thermostat.png",
        "Glass Break": "Glass Break.png",
        "LIGHTING":"LIGHTING.png",
        "Display":"Display.png",
        "Kiosk":"Kiosk.png"
    };
  legend=[
      {
          name:"Camera",
          color:"#4e53d6"
      },
      {
          name:"Smart Plug",
          color:"#db7438"
      },
      {
          name:"Smoke Detector",
          color:"#858585"
      },
      {
          name:"Window Contact",
          color:"#dc8a8a"
      },
      {
          name:"Siren",
          color:"#c72d2a"
      },
      {
          name:"Water Leakage",
          color:"#2a79a8"
      },
      {
          name:"PARKING SENSOR",
          color:"#d83ecf"
      },
      {
          name:"Thermostat",
          color:"#ee4a67"
      },
      {
          name:"LIGHTING",
          color:"#ad8e17"
      },
      {
          name:"Display",
          color:"#92a0ff"
      },
      {
          name:"Kiosk",
          color:"#0308aa"
      },
  ]
  devicePointCode = {
    "Access Control": "A",
    "Glass Break": "GB",
    "Water Detector": "W",
    "Camera": "C",
    "Smart Plug": "S",
    "Smart Switch": "SS",
    "Smoke Detector": "SD",
    "Window Contact": "WC",
    "Gas Leakage":"G",
    "Siren":"SI",
    "Water Leakage": "W",
    "PARKING SENSOR":"P",
    "Thermostat":"T",
    "Lighting":"L",
    "LIGHTING":"L",
    "Gas Meter":"GM",
    "Electricity Meter":"EM",
    "Electricity Meters":"E",
    "Display":"DI",
    "Kiosk":"KI"
  };

  constructor(private http: Http, private httpService: HttpService) { }
  
  getCampusDropdownList(url: any): Observable<any> {
    return this
      .httpService
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

    getDevicesList(url: any): Observable<any> {
        return this
            .httpService
            .get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
  getCampusDropdownListPe(url: any): Observable<any> {
    return this
      .httpService
      .getPe(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getSklist(url: any): Observable<any> {
    return this
      .httpService
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }


    getDevicePointIconUrl(type) {

        for (const key in this.deviceIcons) {
            if (key == type) {
                return this.deviceIcons[key];
            }
        }
    }

  getDevicePointColor(type) {
    
    for (const key in this.devicePointColor) {
      if (key == type) {
        return this.devicePointColor[key];
      }
    }
  }

  getDevicePointCode(type) {
    for (const key in this.devicePointCode) {
      if (key == type) {
        return this.devicePointCode[key];
      }
    }
  }
  getDeviceList(url, id) {
    return this
      .httpService
      .get(url + id)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
    getApplianceTypes(url) {
        return this
            .httpService
            .get(url)
            .map((res: Response) => res)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
  getDeviceType(url) {
    return this
      .httpService
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  uploadFile(url, data, ) {
    return this
      .httpService
      .uploadFile(url, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  saveData(url, data, ) {
    return this
      .httpService
      .post(url, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  updateSK(url, data){
    console.log(data);
    return this
      .httpService
      .post(url, data)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}
