import { Cams } from './../surveillance-interface';

import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionStorage, SessionStorageService, LocalStorageService } from 'ngx-webstorage';
import { LayoutComponent, ConfirmModalComponent, AuthenticationService } from '../../../../common';
import { DevicePointComponent } from '../../../../utils';
import { MasterDataService, EavWrapperService, SvgService } from '../../../../utils';
import { AppService } from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';

/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;
declare var jquery: any;



@Component({
	selector: 'app-surveillance-cam',
	templateUrl: './surveillance-cam.component.html',
	styleUrls: ['./surveillance-cam.component.scss']
})
export class SurveillanceCamComponent implements OnInit {








	public scrollbarOptions = {
		axis: 'y',
		theme: 'minimal-dark',
		mouseWheel: {
			enable: true
		},
		contentTouchScroll: 200,
		scrollInertia: 0,
		mouseWheelPixels: 100
	};

	@SessionStorage('subsidiary')
	public subsidiary;
	@SessionStorage('surveillanceCount')
	public surveillanceCount;



	public checkLists: any[];
	public repeatCheck: boolean = false;
	public campusDropdownList: any[];
	public buildingDropdownList: any[];
	public floorDropdownList: any[];
	public selectedCampusId: any = 0;
	public selectedBuildingId: any = 0;
	public selectedFloorId: any = 0;
	public fileExist: boolean = false;

	public firstpage: any = 1;




	constructor(public dialog: MatDialog,
		public appService: AppService,
		public masterDataService: MasterDataService,
		public eavWrapperService: EavWrapperService,
		public layoutComponent: LayoutComponent,
		private sanitizer: DomSanitizer,
		private storage: LocalStorageService,
		public svgService: SvgService,
		public activatedRoute: Router,
		public sessionStorageService: SessionStorageService,
		private authenticationService: AuthenticationService,
        public translate: TranslateService
	) {

	}



	public cams: any = [];
	public url: string;
	i = 0;
	cam;
	capture;

	updateCamera() {
		this.authenticationService.getCamera()
			.subscribe(cams => {
				this.cams = cams;
			})

		let i = 0;


		setInterval(() => {
			this.cam.url + "&" + i++;
		}, 1000);
	}


	getCameras() {
		this.cams = [];
		this.fileExist = true;
		this.repeatCheck = true;

		this
			.masterDataService
			.getCampusDropdownListPe(`/SSMS/GetCamerasByFloor?id=` + this.selectedFloorId.id + "&page=" + this.firstpage + "&records=5")
			.subscribe(res => {
				if (res.status === 200) {
					console.log(res._body);
					this.cams = JSON.parse(res._body);
					for (let cam of this.cams) {
						var rtspaddress = cam.ipaddress;
						var i = rtspaddress.indexOf("/");
						rtspaddress = rtspaddress.substr(0, i);
						rtspaddress = "rtsp://" + rtspaddress + "/Streaming/Channels/1";
						cam.rtspaddress = rtspaddress;
					}

				}


			}, (error: any) => {
                this.translate.get('error-messages.no-camera-available',this.appService.currentLang).subscribe(
                    (subHeaderT)=> {
                        this.appService.showFail(subHeaderT);
                    }
                )
			});

		setInterval(() => {
			this.capture = this.i++;
		}, 1000)
	}



	ngOnInit() {

		this.getAllCampus();
		this.sendHeaderWithLogo();
		this.surveillanceCount = 0;
		this.updateBreadCrums();


        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )


	}

	ngAfterViewInit() {

		// let i=0;
		//   let url="http://192.168.10.40/onvif-http/snapshot?Profile_1";
		// function jsUpdate() {$(".camera").src=url+"&"+(i++);}
		// this.updateCam();

	}

	previouspage() {
		if (this.firstpage > 1) {
			this.firstpage = this.firstpage - 1;
			this.getCameras();
		}
	}

	nextpage() {
		if (this.firstpage >= 1) {
			this.firstpage = this.firstpage + 1;
			this.getCameras();
		}
	}



	getAllCampus() {
		this.campusDropdownList = [];
		this
			.masterDataService
			.getCampusDropdownListPe(`/Common/GetCampuses?subsidiaryid=` + this.subsidiary.id+ `&Accept_Language=` + this.appService.currentLang)
			.subscribe(res => {
				if (res.status === 200) {

					this.campusDropdownList = JSON.parse(res._body);
				}
			}, (error: any) => {
                this.translate.get('error-messages.campus-no-data',this.appService.currentLang).subscribe(
                    (subHeaderT)=> {
                        this.appService.showFail(subHeaderT);
                    }
                )
			});
	}

	// On change campus trigger building
	getAllBuildings(event) {

		if (this.selectedCampusId === 0) {
			return;
		}
		this.buildingDropdownList = [];
		this
			.masterDataService
			.getCampusDropdownList(`/Common/GetBuildings?campusid=` + this.selectedCampusId+ `&Accept_Language=` + this.appService.currentLang)
			.subscribe(res => {
				if (res.status === 200) {

					this.buildingDropdownList = JSON.parse(res._body);
				}
			}, (error: any) => {
                this.translate.get('error-messages.building-no-data',this.appService.currentLang).subscribe(
                    (subHeaderT)=> {
                        this.appService.showFail(subHeaderT);
                    }
                )
			});
	}

	getAllFloors() {

		if (this.selectedBuildingId === 0) {
			return;
		}
		this.floorDropdownList = [];
		this
			.masterDataService
			.getCampusDropdownListPe(`/Common/GetFloors?buildingid=` + this.selectedBuildingId+`&Accept_Language=` + this.appService.currentLang)
			.subscribe(res => {
				if (res.status === 200) {

					this.floorDropdownList = JSON.parse(res._body);
				}
			}, (error: any) => {
                this.translate.get('error-messages.floor-no-data',this.appService.currentLang).subscribe(
                    (subHeaderT)=> {
                        this.appService.showFail(subHeaderT);
                    }
                )
			});
	}




	// sendHeader(): void {
	//   // Send message to subscribers via observable subject
	//   if (this.subsidiary !== null) {
	//     this
	//       .appService
	//       .sendHeader(this.subsidiary.name, 'surveillance management', 'manage surveillance', '');
	//   }
	// }
	// sendHeaderWithLogo(): void {
	// 	// Send message to subscribers via observable subject
	// 	if (this.subsidiary !== null) {
	// 		this
	// 			.appService
	// 			.sendHeaderWithLogo(this.subsidiary.name, 'surveillance management', 'manage surveillance', '', '../../../../../assets/images/dashboard/SMART-SECURITY-SYSTEM.png');
	// 	}
	// }
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        let subHeader = '';
        let pageDetails = '';
        let subsidiaryName: '';
        if (this.appService.currentLang == 'en') {
            subsidiaryName = this.subsidiary.name.map.en;
        }
        if (this.appService.currentLang == 'fa') {
            subsidiaryName = this.subsidiary.name.map.fa;
        }
        // let routeName='';
        this.translate.get('sub-header.manage-surveillance', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.surveillance-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;
                                this
                                    .appService
                                    .sendHeaderWithLogo(subsidiaryName, subHeader, pageDetails,'', '../../../../../assets/images/dashboard/SMART-SECURITY-SYSTEM.png');
                            }
                        )
            }
        );

    }
	updateBreadCrums() {
		this.appService.updateBreadCrums('SSMS-VIEW');
	}



}
