import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { SessionStorage } from 'ngx-webstorage';
import { OrganizationModel, OnMAdminModel } from '../super-admin.interface';
import { SuperAdminService } from '../super-admin.service';
import { LoggerService } from '../../../utils/services/logger.service';
import { EavWrapperService } from '../../../utils/services/eav-wrapper.service';

@Component({
  selector: 'app-manage-organization',
  templateUrl: './manage-organization.component.html',
  styleUrls: ['./manage-organization.component.scss']
})
export class ManageOrganizationComponent implements OnInit {

  public organization: OrganizationModel;
  public admin: OnMAdminModel;
  public headerText: string;
  public currentContent: string = 'list';
  public adminCreated : boolean = false;
  public adminList: OnMAdminModel[] = [];

  @SessionStorage('organization')
  public organizationSs;

  @SessionStorage('user')
  public loggedInUser;

  constructor(private superAdminService: SuperAdminService, private loggerService: LoggerService, private eavWrapperService: EavWrapperService) { }

  ngOnInit() {
    this.headerText = "Super Admin";
    this.currentContent = 'list';

    this.getAllOnMAdmins();
  }

  public showUpdateOrganization() {
    this.headerText = "Update Orgnaization";
    this.currentContent = 'uo';
    this.organization = new OrganizationModel({});

    if (this.loggedInUser.org_id !== undefined) {
      this.superAdminService.getOrganizationData().subscribe((data) => {
        let jsonObject = this.eavWrapperService.eavToJson(data, "ORGANIZATION");
        this.organization = jsonObject;
      });
    }
  }

  public updateOrganizationData() {
    let eavObj = this.eavWrapperService.jsonToEav(this.organization, "ORGANIZATION", this.loggedInUser.org_id);
    this.superAdminService.updateOrganizationData(eavObj).subscribe(
      (data) => {
        this.loggerService.info("Success Callback");
        // this.snackBar.open('Organization details updates successfully', 'Okay', {
        //     duration: 3000
        // });
      }, (error) => {
        this.loggerService.error("Error Callback");
        // this.snackBar.open('There was an error while performing the operation!', 'Okay', {
        //     duration: 3000
        // });
      });
  }

  public showList() {
    this.headerText = "Super Admin";
    this.currentContent = 'list';
  }

  public showCreateOnMAdmin() {
    if (!this.adminCreated) {
      this.admin = new OnMAdminModel({}, this.loggedInUser.org_id);
      this.headerText = "Create O&M Admin";
    } else {
      this.getAllOnMAdmins();
      this.headerText = "Update O&M Admin";
    }
    this.currentContent = 'coa';
  }

  public createOnMAdmin() {

    if (this.adminCreated) {
      this.admin['id'] = this.admin.user_id;
       this.superAdminService.updateOnMAdmin(this.admin)
        .subscribe((data) => {
          this.loggerService.debug("Success Callback");
          // this.snackBar.open('O & M Admin Updated successfully', 'Okay', {
          //     duration: 3000
          // });
        }, (error) => {
          // this.snackBar.open('There was an error while updating O & M Admin details!', 'Okay', {
          //   duration: 3000
          // });
        });
    } else {
      this.superAdminService.createOnMAdmin(this.admin).subscribe(
      (data) => {
        this.adminCreated = true;
        this.loggerService.debug("Success Callback");
        // this.snackBar.open('O & M Admin creation initiated successfully', 'Okay', {
        //     duration: 3000
        // });
      }, (error) => {
        this.loggerService.error("Error Callback");
        // this.snackBar.open('There was an error while creating the O & M Admin!', 'Okay', {
        //     duration: 3000
        // });
      });
    }
  }

  getAllOnMAdmins(){
    this.superAdminService.getAllOnMAdmins()
      .subscribe((res) => {
        let allAdmins = JSON.parse(res._body);
        this.admin = new OnMAdminModel(allAdmins[0], this.loggedInUser.org_id);
        if (allAdmins.length > 0) {
          this.adminCreated = true;
        }
      }, (error) => {
        // this.snackBar.open('There was an error while performing the operation!', 'Okay', {
        //     duration: 3000
        // });
      });
  }

}
