import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../../../app.service';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { LocalStorageService, LocalStorage, SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { StaffService } from '../staff.service';
import { PersonalInfo, EmployementDetails } from '../staff';
import { LayoutComponent } from '../../../../../common';
import { ConfirmModalComponent } from '../../../../../common';
import { MatDialog, MatDialogRef } from '@angular/material';
import { debug } from 'util';
import { Department, SubDepartment, Designation } from '../../../../spms/parking/staff/staff';


@Component({
  selector: 'app-manage-staff',
  templateUrl: './manage-staff.component.html',
  styleUrls: ['./manage-staff.component.scss']
})
export class ManageStaffComponent implements OnInit {

  @SessionStorage('organization')
  public organization;

  @SessionStorage('subsidiary')
  public subsidiary;

  public page: number = 0;
  public limit: number = 10;
  public size: number = 5;
  public totalPages:number =100;
  public last : boolean;
  public first : boolean;
  
  public totalElements:number;

    
 
  
  public addClicked = false;

  public staffs: PersonalInfo[] = [];
  public departmentId:number = 0;
  public subDepartmentId:number = 0;
  public status:string = "0";

  public prepareDepartmentComponentOpenCount;
   public departments: Department[] = [];
  public subdepartments: SubDepartment[] = [];
 
 public department: Department = new Department();
  
  public subDepartment: Department = new Department() ;
  

  public isLoading: boolean = false;
  public employeeSample : any = 22; 
  
  constructor(
    private appService: AppService,
    private sanitizer: DomSanitizer,
    public  dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private activatedRoute: Router,
    private staffService: StaffService,
    public  layoutComponent: LayoutComponent,
    public sessionStorageService: SessionStorageService
  ) {
    //this.departments="";
   }

  ngOnInit() {

    this.sendHeader();
    this.updateBreadCrums();
     this.getDepartmentDetails();
    
    this.localStorageService.observe('addClicked')
      .subscribe((newValueOfAddClicked) => {
        this.addClicked = newValueOfAddClicked;
     //   if (this.addClicked && this.activatedRoute.url === '/rsb-modules/organization/staff/managestaff/manage') {
       //   this.activatedRoute.navigate(['rsb-modules/organization/staff/managestaff/prepare']);
       // }
      });
  }
  getDepartmentDetails() {
    this.departments = [];
    this
      .staffService
      .getDepartmentDetails()
      .subscribe(res => {
        if (res.status === 200) {
          let departmentDetails = JSON.parse(res._body);
          departmentDetails.forEach(department => {
            let sds: SubDepartment[] = [];
            if (department.subDepartments !== undefined && department.subDepartments.length > 0) {
              department.subDepartments.forEach(subdepartment => {
                let dss: Designation[] = [];
                if (subdepartment.designations !== undefined && subdepartment.designations.length > 0) {
                  subdepartment.designations.forEach(designation => {
                    let dObject = new Designation(designation);
                    dss.push(dObject);
                  });
                }
                let sdObject = new SubDepartment(subdepartment, dss);
                sds.push(sdObject);
              });
            }

            let ds: Designation[] = [];
            if (department.designations !== undefined && department.designations.length > 0) {
              department.designations.forEach(designation => {
                let dObject = new Designation(designation);
                ds.push(dObject);
              });
            }

            let dptObject = new Department(department, sds, ds);
            this.departments.push(dptObject);
          });
        }
      }, (error: any) => {

      });
      console.log(this.departments);
  }


  updateSubDepartments(event) {
    this.subdepartments = [];

    this.departments.forEach(department => {
        this.subdepartments = department.subdepartments;
      
    });
  }



  sendHeader(): void {
    
    if (this.subsidiary) {
      this
        .appService
        .sendHeader(this.subsidiary.name, 'staff management','manage cardHolder member', '');
    }
  }

  updateBreadCrums() {
    this
      .appService
      .updateBreadCrums('');
  }

  ngAfterViewInit() {
    // Get Area details and render Area on map and Device points
    //this.getAllStaffs();
  }
   getPreviousList() {
    this.page = this.page-1;
     if(this.page < 0){
       this.page = 0;}
     this.getAllStaffs();
  }
  getNextList() {
    this.page = this.page+1;
    if(this.page > this.totalPages)
   {
     this.page= this.totalPages-1;
   }
    this.getAllStaffs();
  }

  getAllStaffs() {
    
    this.staffs = [];
    // if (this.page === 1) {
    //   this.staffs = [];
    // }
    
   if (! this.departmentId){
     this.departmentId = -1;
   }
    if(! this.subDepartmentId){
    this.subDepartmentId =-1;
    }
    if(! this.status){
    this.status ="ALL";
    }
    
    this.isLoading = true;
    this.staffService
      .getAllStaffsByDeptSubDept(this.size, this.page, this.departmentId, this.subDepartmentId, this.status)
      .subscribe((res) => {
        this.isLoading = false;
        let allStaffs = JSON.parse(res._body);
        allStaffs.forEach(staff => {
          let employmentDetails: EmployementDetails = new EmployementDetails({});
          if (staff.employments !== undefined && staff.employments.length > 0) {
            employmentDetails = new EmployementDetails(staff.employments[0]);
          }
          let staffObject = new PersonalInfo(staff, this.organization.id, this.subsidiary.id, employmentDetails);
          if (staffObject.phtoId !== '') {
            this
            .staffService
            .getProfilePicture(staffObject.phtoId)
            .subscribe(res => {
              const imageData = JSON.parse(res._body).data;
              const contentType = JSON.parse(res._body).contentType;
              const profilePicture = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + imageData);
              staffObject.profileImage = profilePicture;
            }, (error: any) => {
            });
          } else {
            staffObject.profileImage = '../../../../../assets/images/Profile_Pic.png';
          }
          this.staffs.push(staffObject);
       //   console.log(this.staffs);
        });
      });
  }

  deleteStaffAccess(staff) {
    let deleteUrl = '/rsb-security/security/staff/deleteStaffAccess?staffId=' + staff.id;
    
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
        this.page = 0;
        this.getAllStaffs();
        this.localStorageService.store('addClicked', false);
      });
  }

 

}
