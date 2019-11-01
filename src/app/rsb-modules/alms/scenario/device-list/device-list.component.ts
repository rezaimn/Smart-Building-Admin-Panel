import { Device } from './../shared/device';
import { PersonalInfo, EmployementDetails } from './../../../alms/alert-dashboard/alert-dashboard';
import { DatePipe } from '@angular/common';



import { AddDeviceComponent } from './../add-device/add-device.component';

import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { SessionStorage, SessionStorageService, LocalStorageService } from 'ngx-webstorage';
import { LayoutComponent, ConfirmModalComponent } from '../../../../common';
import { DevicePointComponent } from '../../../../utils';
import { MasterDataService, EavWrapperService, SvgService } from '../../../../utils';
import { AppService } from '../../../../app.service';

import { PaginationService } from '../../../../pagination-service';
import {TranslateService} from '@ngx-translate/core';
import {DeviceConService} from '../device.service';
import {DateAdapter, MatDialog} from '@angular/material';
import {AddDeviceFrequencyComponent} from '../add-device-frequency/add-device-frequency.component';
import {DeleteDeviceComponent} from '../delete-device/delete-device.component';




/* Declaring the letiable for svg functionality */
declare let svgPanZoom: any;
declare let $: any;
declare let Hammer: any;

@Component({
	selector: 'app-device-list',
	templateUrl: './device-list.component.html',
	styleUrls: ['./device-list.component.scss'],
	providers: [DatePipe]

})
export class DeviceListComponent implements OnInit {

	@SessionStorage('organization')
	public organization;

	@SessionStorage('subsidiary')
	public subsidiary;


	public devices: any[];
	public device: any[];
	public models: Device[] = [];
	public page: number = 1;
	public perPage: number = 5;
	public totalRecordsCount: number = 0;
	public totalPages: number = 0;
	public scenes: any = [];




	@SessionStorage('addDeviceCount')
	public addDeviceCount;


	constructor(public dialog: MatDialog,public translate:TranslateService,
		public appService: AppService,
		public masterDataService: MasterDataService,
		public eavWrapperService: EavWrapperService,
		public layoutComponent: LayoutComponent,
		private sanitizer: DomSanitizer,
		private storage: LocalStorageService,
		public svgService: SvgService,
		public activatedRoute: Router,
		private deviceService: DeviceConService,
		public sessionStorageService: SessionStorageService,
		public dateAdapter: DateAdapter<Date>,
		private datePipe: DatePipe,
		public paginationService: PaginationService
	) {
		this.dateAdapter.setLocale('en-In');
	}


	ngOnInit() {
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );
		this.sendHeaderWithLogo();
		this.getDevices();
		//this.getTotalRecordCount();
		this.addDeviceCount = 0;
		this.updateBreadCrums();
		this.storage.observe('addClicked').subscribe((clickedRes) => {
			if (clickedRes && (this.addDeviceCount === 0 || this.addDeviceCount === null) && this.activatedRoute.url === '/rsb-modules/alms/scenario/device-list/view-all') {
				if (this.addDeviceCount === null) {
					this.addDeviceCount = 0;
				} else {
					this.addDeviceCount++;
				}
				let prepareDeviceData = {
					'message': 'new',
					'index': 1
				};

				$('.page-wrapper').addClass('blur-bg');
				let dialogRef = this
					.dialog
					.open(AddDeviceComponent, {
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

                            this.getDevices();
							this.addDeviceCount = 0;

					});
			}
		});
	}


	ngAfterViewInit() {
	}

	// sendHeader(): void {
	//   // Send message to subscribers via observable subject
	//   if (this.organization !== null) {
	//     this
	//       .appService
	//       .sendHeader(this.organization.name, 'device configuration', 'manage device', 'add configuration');
	//   }
	// }

	sendHeaderWithLogo(): void {
		// Send message to subscribers via observable subject
        if (this.organization !== null) {
            let subHeader = '';
            let pageDetails = '';
            let subsidiaryName: '';
            let routeName = '';
            this.translate.get('sub-header.scenario-configuration', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.manage-scenario', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;
                            this.translate.get('route-name.add-scenario', this.appService.currentLang).subscribe(
                                (routeNameT) => {
                                    routeName = routeNameT;

                                    this
                                        .appService
                                        .sendHeaderWithLogo("", subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/SETTING-PANEL.png');

                                }
                            );
                        }
                    );
                }
            );
        }

	}

	updateBreadCrums() {
        this.appService.updateBreadCrums('ALMS-VIEW');
	}


	getDevices() {
		this.scenes = [];
		this
			.deviceService
			//.getDevices("/SP/GetDeviceSettings")
			.getDevices("/SP/GetSmartScenarios?page=" + this.page + "&records=" + this.perPage)

			.subscribe(res => {
				if (res.status === 200) {
					let items = JSON.parse(res._body);
					this.scenes = items.records;
					for (let i = 0; i < this.scenes.length; i++) {
						var temdp = this.scenes[i].destinationdevices;
						console.log(temdp);
						var outdevices: string = "";
						for (let j = 0; j < temdp.length; j++) {
							if (temdp[j])
								outdevices = outdevices + temdp[j].destinationdevicename + "(" + temdp[j].destinationdevicetypename + "); ";

						}
						this.scenes[i].outdevices = outdevices;

					}
					//console.log(this.scenes);

					this.totalRecordsCount = items.totalrecords;

					var x = this.totalRecordsCount % this.perPage;
					var y = this.totalRecordsCount - x;
					if (x === 0) {
						this.totalPages = y / this.perPage;
					} else
						this.totalPages = y / this.perPage + 1;

				}
			}, (error: any) => {
                this.translate.get('error-messages.device-no-data', this.appService.currentLang).subscribe(
                    (subHeaderT) => {
                        this.appService.showFail(subHeaderT);
                    }
                );

            });
	}


	editScenario(device) {
		device.coming = "edit";
		this.sessionStorageService.store('device', device);
		let deviceData = {
			'device': device
		};

		this
			.layoutComponent
			.addClass();

		const dialogRef = this
			.dialog
			.open(AddDeviceComponent, {
				width: '1200px',
				height: 'auto',
				data: deviceData,
				hasBackdrop: true
			});

		dialogRef
			.afterClosed()
			.subscribe(result => {
				this.getDevices();
				this
					.layoutComponent
					.removeClass();
			});
	}

	deleteDevice(device) {
		console.log(device);
		this.sessionStorageService.store('device', device);
		let deviceData = {
			'device': device
		};

		this
			.layoutComponent
			.addClass();

		const dialogRef = this
			.dialog
			.open(DeleteDeviceComponent, {
				width: '768px',
				height: 'auto',
				data: deviceData,
				hasBackdrop: true
			});

		dialogRef
			.afterClosed()
			.subscribe(result => {
				this
					.layoutComponent
					.removeClass();
				if (result) {
					this.getDevices();
					//   this.getTotalRecordCount();}
				}
			});
	}




	getTotalRecordCount() {
		// this
		// .deviceService
		// .getDevices("/SP/GetDeviceSettings")
		// .subscribe(res => {
		//    if (res.status === 200) {
		//      let allSubsidiaries = JSON.parse(res._body);
		//      this.totalRecordsCount=allSubsidiaries.length;
		//      var x = this.totalRecordsCount % this.perPage;
		//      var y = this.totalRecordsCount - x;
		//      this.totalPages=y / this.perPage+1;

		//    }
		//  }, (error: any) => {
		//    this
		//      .snackBar
		//      .open('Error occured', 'Ok', {
		//        duration: 5000,
		//        // extraClasses: ['error-snackbar']
		//      });
		//  });
	}


	setPage(status: string) {
		this.page = this.paginationService.setPage(this.page, status, this.totalPages);
		this.getDevices();
	}



}
