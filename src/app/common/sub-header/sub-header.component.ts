import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {LocalStorageService, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {BreadCrum, SearchData} from '../common.interface';
import {Router} from '@angular/router';
import {HttpService} from 'app/utils';

@Component({
    selector: 'app-sub-header',
    templateUrl: './sub-header.component.html',
    styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {

    @SessionStorage('user')
    public loggedInUser;
    @SessionStorage('isLoading')
    public isLoading;
    public message: any; // Variable to store the different header string that is dynamically set
    public allCrums: BreadCrum[] = [];
    public searchElements: SearchData[] = [];
    public parentUrl: string = '';
    public addClicked: boolean = false;
    public searchFlag: boolean = false;
    constructor(public appService: AppService,
                private http: HttpService,
                private storage: LocalStorageService,
                public route: Router, public sessionStorageService: SessionStorageService) {
    }
    // Function to set the flag upon clicking the add button
    isAddButtonClicked() {
        this.storage.store('addClicked', true);
    }
    isSecAddButtonClicked() {
        this.storage.store('addClickeds', true);
    }
    ngOnInit() {
        this.appService.breadCrums.subscribe(response => {
            this.allCrums = response.crums;
        });
        this.appService.parentUrl.subscribe(response => {
            this.parentUrl = response.url;
        });
        this.appService.globalSearchSubject.subscribe(response => {
        });
        this.appService.subject.subscribe(res => {
            this.message = res;
        });

        this.storage.observe('addClicked').subscribe((clickedRes) => {
            this.addClicked = clickedRes;
        });


        this.checkSearchExist();
    }

    checkSearchExist() {
        this.searchFlag = true;
    }

    getPhotoUrl(url: string) {
        let URL = url.substr(0, url.indexOf('.png'));
        URL = URL + '2.png';
        console.log(URL);
        return URL;
    }
}
