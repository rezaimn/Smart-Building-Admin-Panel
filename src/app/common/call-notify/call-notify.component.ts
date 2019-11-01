
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { AppService } from '../../app.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { BreadCrum, SearchData } from '../common.interface';
import { SessionStorage, LocalStorageService, SessionStorageService } from 'ngx-webstorage';
// import { VideoCallService } from 'app/rsb-modules/vics/video-call/video-call.service';

import { MasterDataService, EavWrapperService, SvgService } from 'app/utils';
import { AuthenticationService } from '../authentication.service';
import { LayoutComponent } from '../layout/layout.component'
import { DomSanitizer } from '@angular/platform-browser';
import { VideoCallComponent } from 'app/common/video-call/video-call.component';
import { HeaderComponent } from 'app/common/header/header.component';
import { FooterComponent } from 'app/common/footer/footer.component';
import { SubHeaderComponent } from 'app/common/sub-header/sub-header.component';
import { SidemenuComponent } from 'app/common/sidemenu/sidemenu.component';
//import { VideoCallComponent } from '../../rsb-modules/vics/video-call/call/call.component';
import { environment } from '../../../environments/environment';
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs'
import { VideoCallService } from "app/rsb-modules/vics/video-call/video-call.service";
import { Observable } from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material';
import {StompService} from '@stomp/ng2-stompjs';
@Component({
	selector: 'app-call-notify',
	templateUrl: './call-notify.component.html',
	styleUrls: ['./call-notify.component.scss'],
	providers: [LayoutComponent]
})
export class CallNotifyComponent implements OnInit, OnDestroy {
	public allCrums: BreadCrum[] = [];
	public searchElements: SearchData[] = [];
	public parentUrl: string = '';
	public notificationCount: any;
	public ticketCount: any;
	@SessionStorage('search-module')
	public searchModule;
	objDate = Date.now();
	public toneInterval = null;
	public check: boolean = true;

	//@SessionStorage('inList')
	public inList: any = [];
	@SessionStorage('user')
	public loggedInUser;
	public logname: any = "";
	public onlineList: any = [];
	public reqList: any = [];
	public selectedOnline: any = [];
	public url: any = "localhost://tur";
	private serverUrl = environment.vicsUrl; //'https://appdev.mitoconnect.com/gs-guide-websocket';
	private stompClient;


	public config: any = {
		suppressScrollX: true
	};


	@ViewChild('pageWrapper')
	public pageWrapper: ElementRef;
	audio: any;



	constructor(private appService: AppService,
		// public videoCallService : VideoCallService,
		private _location: Location,
		private localStorageService: LocalStorageService,
		public dialog: MatDialog,
                private _stompService: StompService,
		public masterDataService: MasterDataService,
		public eavWrapperService: EavWrapperService,
		public layoutComponent: LayoutComponent,
		public activatedRoute: Router,
		private storage: LocalStorageService,
		private sanitizer: DomSanitizer,
		public elementRef: ElementRef,
		public svgService: SvgService,
		public sessionStorageService: SessionStorageService,
		//   public vc: VideoCallComponent,
		public videoCallService: VideoCallService,
		public TranslateService: TranslateService,
		private authenticationService: AuthenticationService
		// public getVideo: VideoCallComponent
	) {
		setInterval(() => {
			// this.getAllOutgoing();
			// this.getAllIncoming();
			//this.check = true;
		}, 5000);

		//console.log(this.loggedInUser);
		this.logname = this.loggedInUser.first_name;
		this.url = sanitizer.bypassSecurityTrustResourceUrl('https://vics.mitoconnect.com/satya');
	}

	transform(url) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
	}

	ngOnInit() {
		//   this.getAllOutgoing();
		// this.getAllIncoming();
		this.check = true;



		this.initializeWebSocketConnection();
	}

	ngOnDestroy() {
		try {
			this.stompClient.disconnect();
		} catch (e) {

		}
	}
	toogleSwitch() {

		this.check = true;
	}

	toogleSwitch1(arrList) {
		this.check = true;
		if (arrList.length > 0) {
			if (this.toneInterval != null) {
				this.toneInterval.unsubscribe();
			}
			console.log(this.toneInterval);
			if (!this.audio)
				this.audio = document.createElement("audio");

			//			this.audio = document.createElement("audio");
			if (this.audio != null && this.audio.canPlayType && this.audio.canPlayType("audio/mpeg")) {
				this.audio.src = "../../../../../assets/tones/1.mp3";
				this.audio.play();
			}
			this.toneInterval = Observable.interval(5000).subscribe(x => {
				if (!this.audio)
					this.audio = document.createElement("audio");

				//				this.audio = document.createElement("audio");
				if (this.audio != null && this.audio.canPlayType && this.audio.canPlayType("audio/mpeg")) {
					this.audio.src = "../../../../../assets/tones/1.mp3";
					this.audio.play();
				}
			}
			)
		}
		this.inList = arrList;

	}

	async initializeWebSocketConnection() {
        let ws = new WebSocket(this.serverUrl);

        this.stompClient = Stomp.over(ws);
        let that = this;
        this.stompClient.connect({}, function (frame) {
			that.stompClient.subscribe("/topic/incomingcalls", (message) => {
				//console.log ("here");
				if (message.body) {
					that.toogleSwitch();
					// console.log (message.body);
					const allCampusList = JSON.parse(message.body);
					console.log(allCampusList);
					that.inList = [];

					for (var i = 0, call; call = allCampusList[i]; ++i) {

						if ((call.callingUID == that.loggedInUser.user_id) && (call.status == 1)) {
							that.inList.push(call);
							break;
						}

					}
					that.toogleSwitch1(that.inList);
					//  that.inList = allCampusList;
				}
			});

		});


		//  setInterval(() => {
		//           this.stompClient.send("/app/online" , {}, "1");
		//         },  1 * (500 * 60));


	}

	acceptVideo(online: any) {
		// console.log("accept:     ",this.toneInterval);
		if (this.toneInterval != null) {
			this.toneInterval.unsubscribe();
		}
		if (this.audio) {
			this.audio.pause();
			this.audio = null;
		}

		this.check = false;

		this
			.authenticationService
			.acceptVideoReq(online)
			.subscribe(res => {
				const allCampusList = JSON.parse(res._body);
				//console.log(allCampusList);
				// this.onlineList = allCampusList;
				//this.getAllOutgoing();
				//this.getAllIncoming();
				this.url = this.sanitizer.bypassSecurityTrustResourceUrl(online.url);
				//    window.open(online.url,online.userId,'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=450');
				this.openVideo(online.url);
				// window.open(online.url, 'blank');

			}, (error: any) => {
			});
	}

	rejectVideo(online: any) {
		//console.log("reject:            ",this.toneInterval);
		if (this.toneInterval != null) {
			this.toneInterval.unsubscribe();
		}
		if (this.audio) {
			this.audio.pause();
			this.audio = null;
		}

		this.check = false;
		this
			.authenticationService
			.rejectVideoReq(online)
			.subscribe(res => {
				let vicsurl: string = online.url;
				if (online.url.changingThisBreaksApplicationSecurity) {
					vicsurl = online.url.changingThisBreaksApplicationSecurity;
				}

				let data = {
					"callerUID": this.loggedInUser.user_id,
					"callingUID": this.loggedInUser.user_id,
					"url": vicsurl
				};
				this
					.videoCallService
					.removeMyCalls(data)
					.subscribe(res => {

					}, (error: any) => {
					});


				const allCampusList = JSON.parse(res._body);


			}, (error: any) => {
			});

	}

	// getAllIncoming() {
	//   //this.campusDropdownList = [];
	//   //console.log(this.subsidiary.id);
	//    this
	//      .authenticationService
	//      .getAllIncoming(this.loggedInUser.user_id)
	//      .subscribe(res => {
	//        const allCampusList = JSON.parse(res._body);
	//        //console.log(allCampusList);
	//        this.inList = allCampusList;
	//
	//      }, (error: any) => {
	//        this
	//          .snackBar
	//          .open('Error occured while retriving area list', 'Ok', {
	//            duration: 5000,
	//            extraClasses: ['error-snackbar']
	//          });
	//      });
	// }
	openVideo(url: any) {
		// this.sessionStorageService.store('zone', zone);
		//let viewZoneData = {
		// 'zone': zone
		// };



		const dialogRef = this
			.dialog
			.open(VideoCallComponent, {
				width: '600px',
				data: url,
				hasBackdrop: true
			});

		dialogRef
			.afterClosed()
			.subscribe(result => {
				// alert("11d");
				if (!this.audio)
					this.audio = document.createElement("audio");
				if (this.audio) {
					this.audio.pause();
					this.audio = null;
				}

				dialogRef.close();

				let vicsurl: string = url;
				if (url.changingThisBreaksApplicationSecurity) {
					vicsurl = url.changingThisBreaksApplicationSecurity;
				}

				let data = {
					"callerUID": this.loggedInUser.user_id,
					"callingUID": this.loggedInUser.user_id,
					"url": vicsurl
				};
				this
					.videoCallService
					.removeMyCalls(data)
					.subscribe(res => {


					}, (error: any) => {
					});

				//   this.getAllZones();
				//   this.localStorageService.store('addClicked', false);

			});
	}



	getAllOutgoing() {
		//this.campusDropdownList = [];
		//console.log(this.subsidiary.id);
		//  this
		//    .authenticationService
		//    .getOutgoinReq(this.loggedInUser.user_id)
		//    .subscribe(res => {
		//      const allCampusList = JSON.parse(res._body);
		//      console.log(allCampusList);
		//      this.reqList = allCampusList;

		//    }, (error: any) => {
		//      this
		//        .snackBar
		//        .open('Error occured while retriving area list', 'Ok', {
		//          duration: 5000,
		//          extraClasses: ['error-snackbar']
		//        });
		//    });
	}
	// acceptVideo(online: any){
	//   this.getVideo.acceptVideo(online);
	// }
	// rejectVideo(online: any){
	//   this.getVideo.rejectVideo(online);
	// }


}
