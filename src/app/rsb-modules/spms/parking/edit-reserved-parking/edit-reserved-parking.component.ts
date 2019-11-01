import { LayoutComponent } from './../../../../common/layout/layout.component';
import { Router } from '@angular/router';
import { AppService } from './../../../../app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SessionStorage, LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { MasterDataService } from '../../../../utils';
import { PersonalInfo, EmployementDetails } from 'app/rsb-modules/spms/parking/staff/staff';
import { StaffService } from 'app/rsb-modules/spms/parking/staff/staff.service';
import {Department, SubDepartment} from '../../../organizations/staff/staff';

@Component({
   selector: 'app-edit-reserved-parking', 
   templateUrl: './edit-reserved-parking.component.html', 
   styleUrls: ['./edit-reserved-parking.component.scss'] })
export class EditReservedParkingComponent implements OnInit {
  public index: number;
  public mode: string;

  public departments: Department[] = [];
  public subdepartments: SubDepartment[] = [];

  public department: Department = new Department();
  
  public subDepartment: Department = new Department() ;
  public formData = new FormData(); // Create a formdata variable to send the uploaded svg file
  public fileUploaded = false; // Maintaining a flag to show the transition and file name according to the file uploaded
  public fileName: string; // Variable to the file name of the uploaded file

  @SessionStorage('organization')
  public organization;

  @SessionStorage('subsidiary')
  public subsidiary;
  @SessionStorage('editReservedParkingOpenCount')
  public page: number = 0;
  public limit: number = 10;
  public size: number = 5;
  public totalPages:number =100;
  public last : boolean;
  public first : boolean;
  public editReservedParkingOpenCount;
  public departmentId:number = 0;
  public subDepartmentId:number = 0;
  public staffs: PersonalInfo[] = [];
  public status:string = "0";
  public isLoading: boolean = false;
  constructor(
    private appService: AppService,
    private sanitizer: DomSanitizer,
    public  dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private activatedRoute: Router,
    private staffService: StaffService,
    
    public sessionStorageService: SessionStorageService,
    public dialogRef: MatDialogRef<EditReservedParkingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public masterDataService: MasterDataService) {
    this.mode = data.message;
    this.index = data.index;
    dialogRef.disableClose = true;
    this.mode ='assign'
  }

  ngOnInit() {
    
  }

  // ngOnDestroy() {
  //   this.editReservedParkingOpenCount = 0;
  //   this.localStorageService.store('addClicked', false);
  // }

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
  







 

  // getSerial(data) {
  //   this.createDevice.documentId = data.documentId;
  //   this.createDevice.id = data.id;
  //   if (this.createDevice.documentId) {
  //     this.getFileDetail(this.createDevice.documentId);
  //   }
  //   this
  //     .masterDataService
  //     .getDeviceList(`/rsb-oms/oms/getDeviceSerialByModelId?id=`, data.id)
  //     .subscribe((data) => {
  //       this.serialList = JSON.parse(data._body);
  //     }, (error) => {
  //       console.log(error);
  //     });
  // }

    updateSubDepartments(event) {
        this.subdepartments = [];

        this.departments.forEach(department => {
            this.subdepartments = department.subdepartments;

        });
    }
// update parking
    updateParking(){
      this.closeModal();
    }
 

  closeModal() {
    this
      .localStorageService
      .store("addClicked", false);
      this.dialogRef.close();
      this.dialogRef = null;
  }
}
