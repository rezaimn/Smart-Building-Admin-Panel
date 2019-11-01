import {AfterViewInit, Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {MatDialog} from '@angular/material';
import {ManageLevel, MapPoint} from '../level';
import {LevelService} from '../level.service';
import {SvgService} from '../../../../utils/services/svg.service';
import {AppService} from '../../../../app.service';
import {EavWrapperService} from '../../../../utils/services';
import {ConfirmModalComponent, LayoutComponent} from '../../../../common';
import {TranslateService} from '@ngx-translate/core';

declare var svgPanZoom: any;
declare var $: any;
declare var Hammer: any;

@Component({
    selector: 'app-manage-level',
    templateUrl: './manage-level.component.html',
    styleUrls: ['./manage-level.component.scss'],
    // animations: [routerTransition()],
    // host: { '[@routerTransition]': '' }
})
export class ManageLevelComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    @SessionStorage('structure')
    public structure;

    @SessionStorage('level')
    public level;
    public parentId: number;
    public fileExist: boolean = false;

    public prepareComponent: any;

    public fileData: string;

    public manageLevelList: Array<any> = [];

    public manageLevel = new ManageLevel();

    public activeLevel: any = null;

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

    public addClicked = false;
    public observeClick: any;

    public svgSourceUrl: any;
    public panZoom: any;
    public selectedPoints: MapPoint[] = [];

    constructor(
        public appService: AppService,
        private storage: LocalStorageService,
        private levelService: LevelService,
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute,
        private router: Router,
        private layoutComponent: LayoutComponent,
        public dialog: MatDialog,
        private eavWrapperService: EavWrapperService,
        private svgService: SvgService,
        public translate: TranslateService
    ) {
        this.route.params.subscribe(params => {
            this.parentId = this.structure.id;
        });
    }

    ngOnDestroy() {
        this.observeClick.unsubscribe();
    }

    // sendHeader(): void {
    //   // Send message to subscribers via Observable subject
    //   if (this.structure !== null) {
    //     this.appService.sendHeader(this.structure.name, ' level', 'Manage Level', 'Add level');
    //   }
    // }
    sendHeaderWithLogo(): void {
        // Send message to subscribers via observable subject
        if (this.structure !== null) {
            let subHeader = '';
            let pageDetails = '';
            let subsidiaryName: '';
            let structureName='';
            if (this.appService.currentLang == 'en') {
                structureName =  this.structure.name.map.en;
            }
            if (this.appService.currentLang == 'fa') {
                structureName =  this.structure.name.map.fa;
            }

            let routeName = '';
            this.translate.get('sub-header.level', this.appService.currentLang).subscribe(
                (subHeaderT) => {
                    subHeader = subHeaderT;
                    this.translate.get('page-details.manage-level', this.appService.currentLang).subscribe(
                        (pageDetailsT) => {
                            pageDetails = pageDetailsT;
                            this.translate.get('route-name.add-level', this.appService.currentLang).subscribe(
                                (routeNameT) => {
                                    if(this.appService.spaceIsAvailable('LEVEL')){
                                        routeName = routeNameT;
                                    }
                                    this
                                        .appService
                                        .sendHeaderWithLogo(structureName, subHeader, pageDetails, routeName, '../../../../../assets/images/dashboard/OMS.png');
                                }
                            );
                        }
                    );
                }
            );
        }
    }

    updateFileDetails(level) {
        this.activeLevel = level;
    }

    navigateToCreateArea() {
        if (this.activeLevel !== null) {
            this.router.navigate(['/rsb-modules/organization/space/area/manage/' + this.activeLevel.id]);
        }
    }

    getFileDetail(data, event) {
        if (event !== '') {
            $('.' + event.currentTarget.className).removeClass('active');
            $('#' + event.currentTarget.id).addClass('active');
        }
        this.levelService.getFileDetail(`/rsb-oms/oms/getFile/` + data.levelMap).subscribe(res => {
            this.fileExist = true;
            const contentTypeSVG = 'image/svg+xml';
            const b64Svg = JSON.parse(res._body).data;
            const blob = this.svgService.b64toBlob(b64Svg, contentTypeSVG, 512);
            this.svgSourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
            this.fileData = JSON.parse(res._body).filename;
            this.enableZoom();
        }, (error: any) => {
            // this.snackBar.open('Error occured while getting Map', 'Ok', {
            //   duration: 5000,
            //   extraClasses: ['error-snackbar']
            // });
        });
    }

    enableZoom() {
        const self = this;
        setTimeout(function () {
            self.panZoom = svgPanZoom('#svg_floor_map', {
                zoomEnabled: true,
                // controlIconsEnabled: true,
                fit: true,
                center: true,
            });
        }, 1000);
    }

    getLevelList() {
        this.manageLevelList = [];
        this.levelService.getLevelList(`/rsb-oms/oms/getChildEntities?parentId=` + this.parentId + `&Accept-Language=` + this.appService.currentLang).subscribe(res => {
            if (res.status === 200) {
                let allLevel = JSON.parse(res._body);
                this.manageLevelList.splice(0, this.manageLevelList.length);
                allLevel.forEach(level => {
                    let levelJson = this.eavWrapperService.eavToJson(level, 'LEVEL');
                    if (levelJson !== null) {
                        this.manageLevelList.push(levelJson);
                    }
                });
                if (this.manageLevelList.length > 0) {
                    this.getFileDetail(this.manageLevelList[0], '');
                    this.activeLevel = this.manageLevelList[0];
                }
                // else if (this.manageLevelList.length == 0) {
                //     this.addClicked = true;
                //     this.prepareComponent = {
                //         type: 'add',
                //         index: (this.manageLevel) ? this.manageLevelList.length + 1 : 0,
                //         id: 0,
                //         parentId: this.parentId,
                //         object: new ManageLevel({})
                //     };
                // }
            }
        }, (error: any) => {
            // this.snackBar.open('Error occured while getting Level list', 'Ok', {
            //   duration: 5000,
            //   extraClasses: ['error-snackbar']
            // });
        });
    }

    deleteLevel(id) {
        console.log('id:               ', id);
        let deleteUrl = '/rsb-oms/oms/deleteEntity?id=' + id;
        this
            .layoutComponent
            .addClass();
        const dialogRef = this
            .dialog
            .open(ConfirmModalComponent, {
                width: '640px',
                height: 'auto',
                data: deleteUrl
            });
        dialogRef
            .afterClosed()
            .subscribe(result => {
                this
                    .layoutComponent
                    .removeClass();
                this.evictcache();
            });
    }

    evictcache() {

        this.levelService.evictcache(`/rsb-oms/oms/cacheEvict`)
            .subscribe(res => {
                this.getLevelList();
            }, (error: any) => {

            });

    }

    zoomInSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this.panZoom.zoomIn();
        }
    }

    zoomOutSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this.panZoom.zoomOut();
        }
    }

    resetZoomSVG(ev) {
        ev.preventDefault();
        if (this.panZoom) {
            this.panZoom.resetZoom();
        }
    }

    ngOnInit() {
        this.appService.currentLangEmit.subscribe(
            (res: any) => {
                this.sendHeaderWithLogo();
            }
        );
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.observeClick = this.storage.observe('addClicked')
            .subscribe((clickedRes) => {
                this.addClicked = clickedRes;
                const urlRegEx = /\/rsb-modules\/organization\/space\/level\/manage/i;
                if (this.addClicked && this.router.url.match(urlRegEx) !== null) {
                    $('.single-floor.active').removeClass('active');
                    this.prepareComponent = {
                        type: 'add',
                        index: (this.manageLevel) ? this.manageLevelList.length + 1 : 0,
                        id: 0,
                        parentId: this.parentId,
                        object: new ManageLevel({})
                    };
                } else {
                    this.getLevelList();
                }
            });
    }

    editLevel(levelObj, idx) {
        levelObj.levelNameMultiLingual=levelObj.levelName;
        levelObj.levelTypeMultiLingual=levelObj.levelType;
        this.addClicked = true;
        this.prepareComponent = {
            type: 'edit',
            index: idx,
            id: levelObj.id,
            parentId: this.parentId,
            object: levelObj
        };
    }

    ngAfterViewInit() {
        this.getLevelList();
    }

    ngOnChanges() {
        if (!this.addClicked) {
            this.getLevelList();
        }
    }

    storeLevel(level) {
        this.level = level;
    }

    updateBreadCrums() {
        this.appService.updateBreadCrums('LEVEL');
    }
}
