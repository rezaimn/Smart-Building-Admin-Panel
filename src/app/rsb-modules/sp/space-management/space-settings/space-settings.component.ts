import {Component, OnInit} from '@angular/core';
import {LocalStorageService, SessionStorage} from 'ngx-webstorage';
import {AppService} from '../../../../app.service';
import {TranslateService} from '@ngx-translate/core';
import {SpaceSettingsService} from '../space-settings.service';
import {AuthenticationService} from '../../../../common/authentication.service';
import {SpacesModel} from './spaces.model';
import {EavWrapperService} from '../../../../utils/services/eav-wrapper.service';


@Component({
    selector: 'app-prepare-role',
    templateUrl: './space-settings.component.html',
    styleUrls: ['./space-settings.component.scss']
})
export class SpaceSettingsComponent implements OnInit {

    @SessionStorage('organization')
    public organization;
    @SessionStorage('subdiaryId')
    public subdiaryId;
    @SessionStorage('subsidiary')
    public subsidiary;
    spaces: SpacesModel;
    @SessionStorage('spacesAvailability')
    public spacesAvailability;
    subsidiaries=[];
    constructor(
        private storage: LocalStorageService,
        private spaceSettingsService: SpaceSettingsService,
        public appService: AppService,
        public translate: TranslateService,
        public evaWrapper: EavWrapperService,
        public authenticationService: AuthenticationService) {
        this.spaces = new SpacesModel();
    }

    ngOnInit() {
        this.sendHeaderWithLogo();
        this.updateBreadCrums();
        this.getSpaces();

    }
    getSubsidiary() {
        this.subsidiaries = [];
        this
            .authenticationService
            .getSubsidiaryList(`/rsb-oms/oms/getChildEntities?parentId=` + this.organization.id+`&Accept-Language=`+this.appService.currentLang)
            .subscribe(res => {
                if (res.status === 200) {
                    let allSubsidiaries = JSON.parse(res._body);
                    allSubsidiaries.forEach(subsidiary => {
                        let subsidiaryJson = this
                            .evaWrapper
                            .eavToJson(subsidiary, 'SUBSIDIARY');
                        if (subsidiaryJson !== null) {
                            this
                                .subsidiaries
                                .push(subsidiaryJson);
                        }
                    });
                    this.subdiaryId = this.subsidiaries[0].id;
                    this.subsidiary = this.subsidiaries[0];
                }
            }, (error: any) => {

            });
    }
    sendHeaderWithLogo(): void {
        let subHeader = '';
        let pageDetails = '';

        let routeName = '';
        this.translate.get('sub-header.space-settings', this.appService.currentLang).subscribe(
            (subHeaderT) => {
                subHeader = subHeaderT;
                this.translate.get('page-details.space-settings', this.appService.currentLang).subscribe(
                    (pageDetailsT) => {
                        pageDetails = pageDetailsT;

                        this
                            .appService
                            .sendHeaderWithLogo('', subHeader, pageDetails, '', '../../../../../assets/images/dashboard/SETTING-PANEL.png');
                    }
                )

            }
        );
        // }
    }
    changeSpaceStatus(status,index){
        this.spaces.spaceSettingsList[index].available=status.target.checked;
    }
    updateSpaces() {

        let spaceSettings={
            "orgId":this.spaces.orgId,
            "spaceSettingsList":this.spaces.spaceSettingsList
        }
        this
            .spaceSettingsService
            .setSpaceStatus('/rsb-oms/oms/space/' + this.spaces.orgId + '/settings/', spaceSettings)
            .subscribe(res => {
                this.getSpaces();
                }
            )
    }

    getSpaces() {
        this
            .spaceSettingsService
            .getSpaces('/rsb-oms/oms/space/' + this.spaces.orgId + '/settings/')
            .subscribe(res => {
                let spaceTemp=JSON.parse(res._body);
                this.spacesAvailability=spaceTemp;
                this.spaces.orgId=spaceTemp.orgId;
                this.spaces.spaceSettingsList=spaceTemp.spaceSettingsList;
                this.getSubsidiary();
                }
            )
    }
    updateBreadCrums() {
        this.appService.updateBreadCrums('SP-SUBSIDIARY');
    }

}
