import { AuthenticationService } from './../../../../common/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionStorage, SessionStorageService, LocalStorageService } from 'ngx-webstorage';
import { LayoutComponent, ConfirmModalComponent } from '../../../../common';
import { DevicePointComponent } from '../../../../utils';
import { MasterDataService, EavWrapperService, SvgService } from '../../../../utils';
import { AppService } from '../../../../app.service';
import { PaginationService } from '../../../../pagination-service';
import { connect } from 'tls';
//import {DomSanitizer} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';



/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
	selector: 'app-surveillance-list',
	templateUrl: './surveillance-list.component.html',
	styleUrls: ['./surveillance-list.component.scss']
})
export class SurveillanceListComponent implements OnInit {

	public page: number = 1;
	public perPage: number = 5;
	public totalRecordsCount: number = 0;
	public totalPages: number = 0;


	public cams: any[];
	public checkLists: any[];
	public repeatCheck: boolean = false;
	public campusDropdownList: any[];
	public buildingDropdownList: any[];
	public floorDropdownList: any[];
	public selectedCampusId: any = 0;
	public selectedBuildingId: any = 0;
	public selectedFloorId: any = 0;
	public fileExist: boolean = false;
	public camList: boolean = true;
	capture;
	i = 0;
	public firstpage: any = 1;

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
        public translate: TranslateService,
		private authenticationService: AuthenticationService,
		public paginationService: PaginationService
	) { }




	hideList() {
		this.camList = false;
	}
	hideCam() {
		this.camList = true;
	}
	//http://localhost:55408/RSBService.svc/SSMS/GetCamerasByFloor?id=1&page=1&records=5
	public ptz: string = "Dome";

	getCameras() {
		this.cams = [];
		this.fileExist = true;
		this.repeatCheck = true;

		this
			.masterDataService
			.getCampusDropdownListPe(`/SSMS/GetCamerasByFloor?id=` + this.selectedFloorId.id + "&page=" + this.firstpage + "&records=" + this.perPage)
			.subscribe(res => {
				if (res.status === 200) {
					console.log(res._body);
					this.cams = JSON.parse(res._body);

					let cameras = JSON.parse(res._body);
					this.cams = cameras.records;
					for (let cam of this.cams) {
						var rtspaddress = cam.ipaddress;
						var i = rtspaddress.indexOf("/");
						rtspaddress = rtspaddress.substr(0, i);
						rtspaddress = "rtsp://" + rtspaddress + "/Streaming/Channels/1";
						cam.rtspaddress = rtspaddress;
					}

					this.totalRecordsCount = cameras.totalrecords;
					var x = this.totalRecordsCount % this.perPage;
					var y = this.totalRecordsCount - x;
                    if(x == 0){
                        this.totalPages = y / this.perPage ;
                    } else {
                        this.totalPages = y / this.perPage + 1;
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
		this.authenticationService.getCamera()
			.subscribe(cams => this.cams = cams)
		this.updateBreadCrums();
		this.storage.observe('addClicked').subscribe((clickedRes) => {
			if (clickedRes && (this.surveillanceCount === 0 || this.surveillanceCount === null) && this.activatedRoute.url === '/rsb-modules/ssms/surveillance/surveillance-list/manage') {
				if (this.surveillanceCount === null) {
					this.surveillanceCount = 0;
				} else {
					this.surveillanceCount++;
				}
				let prepareDeviceData = {
					'message': 'new',
					'index': 1
				};

				$('.page-wrapper').addClass('blur-bg');
				let dialogRef = this
					.dialog
					.open(SurveillanceListComponent, {
						width: '768px',
						height: 'auto',
						data: prepareDeviceData
					});
				dialogRef
					.afterClosed()
					.subscribe(result => {

						$('.page-wrapper').removeClass('blur-bg');
						this
							.storage
							.store('addClicked', false);
						if (result) {

							this.surveillanceCount = 0;
						} else {
							this.surveillanceCount = 0;
						}
					});
			}
		});
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )

	}

	ngAfterViewInit() {

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
			.getCampusDropdownListPe(`/Common/GetBuildings?campusid=` + this.selectedCampusId+ `&Accept_Language=` + this.appService.currentLang)
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
			.getCampusDropdownListPe(`/Common/GetFloors?buildingid=` + this.selectedBuildingId +`&Accept_Language=` + this.appService.currentLang)
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
        // let routeName='';
        if (this.appService.currentLang == 'en') {
            subsidiaryName = this.subsidiary.name.map.en;
        }
        if (this.appService.currentLang == 'fa') {
            subsidiaryName = this.subsidiary.name.map.fa;
        }
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

	sanitize(url: string) {
		//  alert(url);
		return this.sanitizer.bypassSecurityTrustUrl(url);
	}

	setPage(status: string) {
		// this.firstpage = this.paginationService.setPage(this.page, status, this.totalPages);
		//this.getAllCampus();
		if (status === "firstpage") {
			this.firstpage = 1;
			this.getCameras();
		}
	}

	setPage1(status: string) {
		// this.firstpage = this.paginationService.setPage(this.page, status, this.totalPages);
		//this.getAllCampus();
		if (status === "firstpage") {
			this.firstpage = this.totalPages;
			this.getCameras();
		}
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


}
