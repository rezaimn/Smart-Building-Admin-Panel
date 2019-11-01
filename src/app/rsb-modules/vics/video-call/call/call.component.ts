import {VideomodelComponent} from './../videomodel/videomodel.component';
import {VideoCallService} from './../video-call.service';
import {Router} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {AuthenticationService, LayoutComponent} from '../../../../common';
import {EavWrapperService, MasterDataService, SvgService} from '../../../../utils';
import {AppService} from '../../../../app.service';

import {UUID} from 'angular2-uuid';
import * as Stomp from '@stomp/stompjs'
import {environment} from '../../../../../environments/environment';
import {FilterPipe} from '../../filter/filter.pipe'
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material';
import {StompService} from '@stomp/ng2-stompjs';
/* Declaring the letiable for svg functionality */
declare const svgPanZoom: any;
declare const $: any;
declare const Hammer: any;

@Component({
    selector: 'app-call',
    templateUrl: './call.component.html',
    styleUrls: ['./call.component.scss'],

})
export class VideoCallComponent implements OnInit, OnDestroy {
    incomingCalls = 'incoming';
    selectedCallType = 1;
    sortDown = true;
    managerStatusFilter = 0;
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

    tooltipPosition = 'above';
    @SessionStorage('subsidiary')
    public subsidiary;

    public peopleFilter: any;

    @SessionStorage('user')
    public loggedInUser;

    @SessionStorage('inList')
    public inList: any = [];

    public logname: any = '';

    public onlineList: any = [];
    public onlineListTemp: any = [];
    public reqList: any = [];


    public selectedOnline: any = [];

    public url: any = 'localhost://tur';
    public proImage: any = '../../../../../assets/images/common/avatar.png';
    public config: any = {
        suppressScrollX: true
    };
    public isFavorite = false;
    private serverUrl = environment.vicsUrl; //'https://appdev.mitoconnect.com/gs-guide-websocket';
    private stompClient;

    constructor(public dialog: MatDialog,
                public appService: AppService,
                public masterDataService: MasterDataService,
                public eavWrapperService: EavWrapperService,
                public layoutComponent: LayoutComponent,
                public activatedRoute: Router,
                private storage: LocalStorageService,
                private sanitizer: DomSanitizer,
                public svgService: SvgService,
                public sessionStorageService: SessionStorageService,
                public videoCallService: VideoCallService,
                private authenticationService: AuthenticationService,
                public filter: FilterPipe,
                public translate: TranslateService,
                private _stompService: StompService
    ) {
        this.peopleFilter = {
            'nameFilter': ''
        };
        //console.log(this.loggedInUser);
        this.logname = this.loggedInUser.first_name;
        this.url = sanitizer.bypassSecurityTrustResourceUrl('https://vics.mitoconnect.com/satya');


    }

    setCallStatus(status: any) {
        this.incomingCalls = status;
    }

    deleteFromFavorite(online: any) {
        this.isFavorite = false;
        online.favorite = false;
        let favoritedata = {
            'id': online.favoriteId
        }

        this
            .videoCallService
            .deleteFromFavorite(favoritedata)
            .subscribe(res => {

                online.favoriteId = 0;


            }, (error: any) => {

            });


    }

    convertToTime(seconds) {
        let second = 0;
        let minute = 0;
        let hour = 0;
        let timeT = '';


        seconds = Math.floor(seconds / 1000);
        second = seconds % 60;
        minute = Math.floor(seconds / 60);
        hour = Math.floor(minute / 60);
        minute = minute % 60;

        if (hour < 10) {
            timeT = '0' + hour;

        } else {
            timeT = hour.toString();
        }

        if (minute < 10) {
            timeT = timeT + ':0' + minute;

        } else {
            timeT = timeT + ':' + minute.toString();
        }

        if (second < 10) {
            timeT = timeT + ':0' + second;

        } else {
            timeT = timeT + ':' + second.toString();

        }
        return timeT;


    }

    addToFavorite(online: any) {

        online.favorite = true;

        this.isFavorite = true;
        let favoritedata;
        favoritedata = {
            'staff': {
                'id': this.loggedInUser.staff_id
            },
            'favorites': {
                'id': online.staffId
            },

        }
        this
            .videoCallService
            .addToFavorite(favoritedata)
            .subscribe(res => {


            }, (error: any) => {

            });


    }

    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }

    ngOnInit() {

        this.sendHeaderWithLogo();

        this.getProPic();
        this.updateBreadCrums();
        // this.getAllCampus();
        this.getAllOutgoing();
        this.getAllIncoming();
        this.initializeWebSocketConnection();
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        )
    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {

        this.stompClient.disconnect();
    }


    checkOn(mes: any) {

        const allCampusList = JSON.parse(mes);
        console.log(this.onlineList,"oooooooooooooooooooooooooooo",this.onlineListTemp);
        if (this.onlineList.length == 0) {

            let myfavorites: any = [];

            this
                .videoCallService
                .getFavorite(this.loggedInUser.staff_id)
                .subscribe(res => {
                    myfavorites = JSON.parse(res._body);
                    allCampusList.forEach(element => {
                        if (element.staffId != this.loggedInUser.staff_id) {
                            if (myfavorites) {
                                for (let i = 0; i < myfavorites.length; i++) {
                                    if (!myfavorites[i])
                                        continue;
                                    if (myfavorites[i].favorites.id === element.staffId) {
                                        element.favorite = true;
                                        element.favoriteId = myfavorites[i].id;

                                    }
                                }
                            }
                            this.onlineList.push(element);
                            this.onlineListTemp.push(element);
                            console.log('this.onlineList:   ', this.onlineList);
                            // m ++ ;
                        }
                    });
                }, (error: any) => {
                    // this
                    // 	.snackBar
                    // 	.open('Error while adding to favorite', 'Ok', {
                    // 		duration: 5000,
                    // 		extraClasses: ['error-snackbar']
                    // 	});
                });

            //  this.onlineList = allCampusList;
        } else {
            let m = 0;

            let myfavorites: any = [];
            this
                .videoCallService
                .getFavorite(this.loggedInUser.staff_id)
                .subscribe(res => {
                    myfavorites = JSON.parse(res._body);

                    allCampusList.forEach(element => {
                        if (element.staffId != this.loggedInUser.staff_id) {
                            for(let online of this.onlineList){
                                if(online.staffId==element.staffId){
                                    online.userId = element.userId;
                                    if (myfavorites) {
                                        for (let i = 0; i < myfavorites.length; i++) {
                                            if (!myfavorites[i])
                                                continue;
                                            if (myfavorites[i].favorites.id === online.staffId) {
                                                online.favorite = true;
                                                online.favoriteId = myfavorites[i].id;
                                            }
                                        }
                                    }
                                }
                            }
                            for(let online of this.onlineListTemp){
                                if(online.staffId==element.staffId){
                                    online.userId = element.userId;
                                    if (myfavorites) {
                                        for (let i = 0; i < myfavorites.length; i++) {
                                            if (!myfavorites[i])
                                                continue;
                                            if (myfavorites[i].favorites.id === online.staffId) {
                                                online.favorite = true;
                                                online.favoriteId = myfavorites[i].id;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }, (error: any) => {

                });

        }


    }

    getProPic() {
        if (this.loggedInUser.photoUrl != null) {
            this
                .authenticationService
                .getProfilePicture(this.loggedInUser.photoUrl)
                .subscribe(res => {
                    const imageData = JSON.parse(res._body).data;
                    const contentType = JSON.parse(res._body).contentType;
                    const profilePicture = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + imageData);
                    if (profilePicture == null) {
                        this.proImage = '../../../../../assets/images/common/avatar.png';
                    }
                    this.proImage = profilePicture;
                }, (error: any) => {
                });
        }

    }

    initializeWebSocketConnection() {
        const ws = new WebSocket(this.serverUrl);


        this.stompClient = Stomp.over(ws);
        const that = this;
        this.stompClient.connect({}, function (frame) {
            that.stompClient.subscribe('/topic/onlineuser', (message) => {
                    console.log(message,"ppppppppppppppppppppppppppppp");
                    if (message.body) {
                        console.log(message.body,"ttttttttttttttttttttttttt");
                        // const allCampusList = JSON.parse(message.body);

                        // console.log(allCampusList);
                        // this.onlineList = allCampusList;
                        // console.log(this.onlineList);
                        // this.onlineList.forEach(element => {
                        //   element.selected = false;

                        // });
                        that.checkOn(message.body);
                    }

                },
                (error: any) => {
                    console.log('onlineuser11111111111111111111111', error);
                }
            );

            that.stompClient.subscribe('/topic/incomingcalls', (message) => {

                that.getAllIncoming();
                //console.log ("here");
                // this can be done in better way later
                // if (message.body) {
                //
                // 	// console.log (message.body);
                // 	const allCampusList = JSON.parse(message.body);
                // 	//console.log(allCampusList);
                // 	that.inList = [];
                // 	allCampusList.forEach(element => {
                // 		if (element.callingUID == that.loggedInUser.user_id) {
                // 			that.inList.push(element);
                // 		}
                //
                // 	});
                // 	//  that.inList = allCampusList;
                // }
            });
            that.stompClient.subscribe('/topic/outgoingcalls', (message) => {
                that.getAllOutgoing();
                // if (message.body) {
                //this can be done in better way later
                // 	const allCampusList = JSON.parse(message.body);
                // 	that.reqList = [];
                // 	allCampusList.forEach(element => {
                // 		if (element.callerUID == that.loggedInUser.user_id) {
                // 			that.reqList.push(element);
                // 		}
                //
                // 	});
                // 	//  that.inList = allCampusList;
                // }
            });
        });


        setInterval(() => {
            this.stompClient.send('/app/online', {}, '1');
        }, 1 * (500 * 60));


    }


    addListOn(i: any) {
        let j = 0;
        this.onlineList.forEach(element => {
            if (j === i) {
                element.selected = true;
                let q = 0;
                this.selectedOnline.forEach(sel => {

                    if (this.selectedOnline.userId === element.userId) {
                        q = 1;
                    }

                });
                if (q === 0) {
                    this.selectedOnline.push(element);
                }

            }
            j = j + 1;

        });


    }

    addListOff(i: any) {
        let j = 0;
        this.onlineList.forEach(element => {
            if (j === i) {
                element.selected = false;
            }
            //   this.selectedOnline.slice()
            j = j + 1;

        });

    }


    // sendHeader(): void {
    //   // Send message to subscribers via observable subject
    //   if (this.subsidiary !== null) {
    //     this
    //       .appService
    //       .sendHeader(this.subsidiary.name, 'video call management', 'manage video call', '');
    //   }
    // }
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        //if (this.subsidiary !== null) {

        let subHeader = '';
        let pageDetails = '';
        let subsidiaryName: '';
        this.translate.get('sub-header.manage-video-call', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.video-call-management', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;

                        this
                            .appService
                            .sendHeaderWithLogo('', subHeader, pageDetails, '', '../../../../../assets/images/dashboard/VIDEO-CALL-SYSTEM.png');


                    }
                )
            }
        )

    }


    //excute function
    //no params
    excute() {

    }

    acceptVideo(online: any) {

        this
            .videoCallService
            .acceptVideoReq(online)
            .subscribe(res => {
                const allCampusList = JSON.parse(res._body);

                this.url = this.sanitizer.bypassSecurityTrustResourceUrl(online.url);
                //    window.open(online.url,online.userId,'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=450');
                this.openVideo(online.url);
                // window.open(online.url, 'blank');

            }, (error: any) => {
                // this
                // 	.snackBar
                // 	.open('Error in accepting the video request', 'Ok', {
                // 		duration: 5000,
                // 		extraClasses: ['error-snackbar']
                // 	});
            });
    }

    public rejectVideo(online: any) {
        this
            .videoCallService
            .rejectVideoReq(online)
            .subscribe(res => {

                let vicsurl: string = online.url;
                if (online.url.changingThisBreaksApplicationSecurity) {
                    vicsurl = online.url.changingThisBreaksApplicationSecurity;
                }

                let data = {
                    'callerUID': this.loggedInUser.user_id,
                    'callingUID': this.loggedInUser.user_id,
                    'url': vicsurl
                };
                this
                    .videoCallService
                    .removeMyCalls(data)
                    .subscribe(res => {

                    }, (error: any) => {
                    });

                const allCampusList = JSON.parse(res._body);
                this.getAllOutgoing();
                this.getAllIncoming();

            }, (error: any) => {
                // this
                // 	.snackBar
                // 	.open('Error in accepting the video request', 'Ok', {
                // 		duration: 5000,
                // 		extraClasses: ['error-snackbar']
                // 	});
            });
    }

    groupCall() {


        if (this.selectedOnline.length > 0) {
            let uuid: string = UUID.UUID();

            uuid = uuid.toString().replace(/-/g, '');

            this.selectedOnline.forEach(element => {
                const dat = {
                    callerUID: this.loggedInUser.user_id,
                    callerName: this.loggedInUser.first_name,
                    callingUID: element.userId,
                    callingName: element.firstName + element.lastName,
                    url: 'https://vics.mitoconnect.com/' + uuid  //{XXXXXXXX UUID}
                };
                this
                    .videoCallService
                    .sendOnlineData(dat)
                    .subscribe(res => {
                        const allCampusList = JSON.parse(res._body);
                        this.stompClient.send('/app/outgoingcalls', {}, '1');
                        // this.onlineList = allCampusList;
                        // window.open("https://meet.jit.si/"+uuid, 'blank');
                        this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://vics.mitoconnect.com/' + uuid);
                        //window.open("https://meet.jit.si/"+uuid,online.userId,'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=450');

                        this.getAllOutgoing();
                        this.getAllIncoming();


                    }, (error: any) => {
                        // this
                        // 	.snackBar
                        // 	.open('Error occured while retriving area list', 'Ok', {
                        // 		duration: 5000,
                        // 		extraClasses: ['error-snackbar']
                        // 	});
                    });

            });

            this.openVideo('https://vics.mitoconnect.com/' + uuid);

        }

    }

    sendOnlineData(online: any) {
        let uuid: string = UUID.UUID();
        // var str = "Visit Microsoft!";
        uuid = uuid.toString().replace(/-/g, '');

        const dat = {
            callerUID: this.loggedInUser.user_id,
            callerName: this.loggedInUser.first_name,
            callingUID: online.userId,
            callingName: online.firstName + online.lastName,
            url: 'https://vics.mitoconnect.com/' + uuid  //{XXXXXXXX UUID}
        };
        this
            .videoCallService
            .sendOnlineData(dat)
            .subscribe(res => {
                const allCampusList = JSON.parse(res._body);
                this.stompClient.send('/app/outgoingcalls', {}, '1');
                // this.onlineList = allCampusList;
                // window.open("https://meet.jit.si/"+uuid, 'blank');
                this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://vics.mitoconnect.com/' + uuid);
                //window.open("https://meet.jit.si/"+uuid,online.userId,'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=450');

                this.getAllOutgoing();
                this.getAllIncoming();
                this.openVideo('https://vics.mitoconnect.com/' + uuid);


            }, (error: any) => {
                // this
                // 	.snackBar
                // 	.open('Error occured while retriving area list', 'Ok', {
                // 		duration: 5000,
                // 		extraClasses: ['error-snackbar']
                // 	});
            });

    }


    search(event: any, searchValue: any) {
        if (event == 13) {
            // if (searchValue == "" || searchValue == null) {
            // 	this.onlineList.splice(0, this.onlineList.length);
            // 	this.initializeWebSocketConnection();
            // } else {
            let temp: any = [];
            for (let online of this.onlineListTemp) {
                if (online.firstName.toUpperCase().includes(searchValue.toUpperCase()) || online.lastName.toUpperCase().includes(searchValue.toUpperCase())) {
                    temp.push(online);
                }
            }
            this.onlineList = [...temp];
            //	}

        }
    }

    searchButton(searchValue: any) {
        if (searchValue == '' || searchValue == null) {
            this.onlineList.splice(0, this.onlineList.length);
            this.initializeWebSocketConnection();
        } else {
            let temp: any = [];
            for (let online of this.onlineListTemp) {
                if (online.firstName.toUpperCase().includes(searchValue.toUpperCase()) || online.lastName.toUpperCase().includes(searchValue.toUpperCase())) {
                    temp.push(online);
                }
            }
            this.onlineList = [...temp];
        }
    }

    sortTable(sortType: any) {
        this.sortDown = !this.sortDown;
        if (sortType == 'asce') {
            this.onlineList.sort(function (a, b) {
                var nameA = a.firstName.toLowerCase(); // ignore upper and lowercase
                var nameB = b.firstName.toLowerCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            });
            return;
        }
        if (sortType == 'desc') {
            this.onlineList.reverse(function (a, b) {
                var nameA = a.firstName.toLowerCase(); // ignore upper and lowercase
                var nameB = b.firstName.toLowerCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            });
            return;
        }

        // let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        // table = document.getElementById('myTable2');
        // switching = true;
        // // Set the sorting direction to ascending:
        // dir = 'asc';
        // /* Make a loop that will continue until
        // no switching has been done: */
        // while (switching) {
        //     // Start by saying: no switching is done:
        //     switching = false;
        //     rows = table.getElementsByTagName('TR');
        //     /* Loop through all table rows (except the
        //     first, which contains table headers): */
        //     for (i = 1; i < (rows.length - 1); i++) {
        //         // Start by saying there should be no switching:
        //         shouldSwitch = false;
        //         /* Get the two elements you want to compare,
        //         one from current row and one from the next: */
        //         x = rows[i].getElementsByTagName('TD')[n];
        //         y = rows[i + 1].getElementsByTagName('TD')[n];
        //         /* Check if the two rows should switch place,
        //         based on the direction, asc or desc: */
        //         if (dir == 'asc') {
        //             if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        //                 // If so, mark as a switch and break the loop:
        //                 shouldSwitch = true;
        //                 break;
        //             }
        //         } else if (dir == 'desc') {
        //             if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
        //                 // If so, mark as a switch and break the loop:
        //                 shouldSwitch = true;
        //                 break;
        //             }
        //         }
        //     }
        //     if (shouldSwitch) {
        //         /* If a switch has been marked, make the switch
        //         and mark that a switch has been done: */
        //         rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        //         switching = true;
        //         // Each time a switch is done, increase this count by 1:
        //         switchcount++;
        //     } else {
        //         /* If no switching has been done AND the direction is "asc",
        //         set the direction to "desc" and run the while loop again. */
        //         if (switchcount == 0 && dir == 'asc') {
        //             dir = 'desc';
        //             switching = true;
        //         }
        //     }
        // }
    }

    openVideo(url: any) {
        // this.sessionStorageService.store('zone', zone);
        //let viewZoneData = {
        // 'zone': zone
        // };

        this
            .layoutComponent
            .addClass();

        const dialogRef = this
            .dialog
            .open(VideomodelComponent, {
                width: '600px',
                data: url,
                hasBackdrop: true
            });

        dialogRef
            .afterClosed()
            .subscribe(result => {
                dialogRef.close();

                this.stompClient.send('/app/outgoingcalls', {}, '1');
                this.stompClient.send('/app/incomingcalls', {}, '1');


                this
                    .layoutComponent
                    .removeClass();
                //   this.getAllZones();
                //   this.localStorageService.store('addClicked', false);

            });
    }

    getAllCampus() {
        //this.campusDropdownList = [];
        this
            .videoCallService
            .getOnlineUsersList(this.subsidiary.id)
            .subscribe(res => {

                const allCampusList = JSON.parse(res._body);

                //console.log(allCampusList);
                this.onlineList = allCampusList;
                this.onlineList.forEach(element => {
                    element.selected = false;

                });

                setTimeout(() => {
                    this.sortTable(0);
                }, 0);
            }, (error: any) => {
                // this
                // 	.snackBar
                // 	.open('Error occured while retriving area list', 'Ok', {
                // 		duration: 5000,
                // 		extraClasses: ['error-snackbar']
                // 	});
            });
    }

    getAllCampusChange() {
        //this.campusDropdownList = [];
        //console.log(this.subsidiary.id);
        this
            .videoCallService
            .getOnlineUsersList(this.subsidiary.id)
            .subscribe(res => {

                const allCampusList = JSON.parse(res._body);

                // console.log(allCampusList);
                // this.onlineList = allCampusList;
                let m = 0;
                allCampusList.forEach(element => {
                    // element.selected = false;
                    this.onlineList[m].staffId = element.staffId;
                    m++;

                });

                // setTimeout(()=> {
                //   this.sortTable(0)
                // },0)
            }, (error: any) => {
                // this
                // 	.snackBar
                // 	.open('Error occured while retriving area list', 'Ok', {
                // 		duration: 5000,
                // 		extraClasses: ['error-snackbar']
                // 	});
            });
    }


    getAllOutgoing() {
        this
            .videoCallService
            .getAllMyCalls(this.loggedInUser.user_id)
            .subscribe(res => {
                let allCampusList = JSON.parse(res._body);
                allCampusList = allCampusList.content;
                this.reqList = [];
                allCampusList.forEach(element => {
                    if (element.callerUID == this.loggedInUser.user_id) {
                        this.reqList.push(element);
                    }
                });
                console.log('all outgoing calls');
                console.log(this.reqList);


            }, (error: any) => {
                // this
                // 	.snackBar
                // 	.open('Error occured while retriving outGoing list', 'Ok', {
                // 		duration: 5000,
                // 		extraClasses: ['error-snackbar']
                // 	});
            });
    }

    getAllIncoming() {
        this
            .videoCallService
            .getAllMyCalls(this.loggedInUser.user_id)
            .subscribe(res => {

                let allCampusList = JSON.parse(res._body);
                allCampusList = allCampusList.content;
                console.log('got the incoming list1');
                console.log(allCampusList);

                this.inList = [];
                allCampusList.forEach(element => {
                    if (element.callingUID == this.loggedInUser.user_id) {
                        this.inList.push(element);
                    }
                });
                console.log('got the incoming list');
                console.log(this.inList);

            }, (error: any) => {
                // this
                // 	.snackBar
                // 	.open('Error occured while retriving incoming list', 'Ok', {
                // 		duration: 5000,
                // 		extraClasses: ['error-snackbar']
                // 	});
            });
    }


    updateBreadCrums() {
        this.appService.updateBreadCrums('VICS-VIEW');
    }


}
