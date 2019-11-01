import { DatePipe } from '@angular/common';
import { LayoutComponent } from './../../../../common/layout/layout.component';
import { Router } from '@angular/router';
import { AppService } from './../../../../app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, Inject, OnDestroy, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter } from '@angular/material';
//import { MatDialog, MatDialogRef, MdSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { SessionStorage, LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { MasterDataService } from '../../../../utils';
import { Department, PersonalInfo, EmployementDetails } from 'app/rsb-modules/spms/parking/staff/staff';
import { StaffService } from 'app/rsb-modules/spms/parking/staff/staff.service';
import {SubDepartment} from "../../../organizations/staff/staff";
import {ParkingService} from "../parking.service";
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'jalali-moment';
import {CalendarConverterService} from '../../../../calendar-converter-service';

@Component({
   selector: 'app-reserve-parking',
   templateUrl: './reserve-parking.component.html',
   styleUrls: ['./reserve-parking.component.scss'] })
export class ReserveParkingComponent implements OnInit {

  @Input() selectedFloorId:number;
  public index: number;
  public mode: string;
  public staffId;
  public departments: Department[] = [];
  public subdepartments: SubDepartment[] = [];

  public firstName: any =[];

  public department: Department = new Department();

  public subDepartment: Department = new Department() ;
  public formData = new FormData(); // Create a formdata variable to send the uploaded svg file
  public fileUploaded = false; // Maintaining a flag to show the transition and file name according to the file uploaded
  public fileName: string; // Variable to the file name of the uploaded file

  @SessionStorage('organization')
  public organization;

  @SessionStorage('subsidiary')
  public subsidiary;
  @SessionStorage('reserveParkingOpenCount')
  public floorId: number;
  public areaId:number;
  public page: number = 0;
  public limit: number = 10;
  public size: number = 5;
  public totalPages:number =100;
  public last : boolean;
  public first : boolean;
  public reserveParkingOpenCount;
  public departmentId:number = 0;
  public departmentName:any =[];
  public subdepartmentId:number = 0;
  public subdepartmentName:any =[];
  public designationId:number=0;
  public designationName='';
  public staffs: PersonalInfo[] = [];
  public status:string = "0";
  public isLoading: boolean = false;
  public staffInfo: any = [];
  public regno: number ;
  public contactNo : number ;
  public startDate: any = "";
  public endDate: any = "";
  public deviceId: any;
  public floorInfo=[];

  public selectedPoint: any ;
    public alertObj: any = {};
    public currentDate: any;
    public pickedFromDate: any;
    public fromDate: any;
    public pickedToDate: any;
    public toDate: any;



  constructor(
    public appService: AppService,
    private sanitizer: DomSanitizer,
    public  dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private activatedRoute: Router,
    private staffService: StaffService,
    public parkingService: ParkingService,
    public sessionStorageService: SessionStorageService,
    public dialogRef: MatDialogRef<ReserveParkingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public masterDataService: MasterDataService,
    public dateAdapter: DateAdapter<Date>,
    private datePipe: DatePipe,
    public translate: TranslateService,
    private calendarConverter: CalendarConverterService,
    private router: Router) {
    this.mode = data.message;
    this.index = data.index;
    dialogRef.disableClose = true;
    // this.mode ='assign';
    this.floorId = data.FloorId;

    this.areaId = data.areaId;
    this.selectedPoint =  data.selectedPoint;

      let now = new Date();
      this.dateAdapter.setLocale('en-In');
      this.currentDate = this.datePipe.transform(now, 'dd/MM/yyyy');
      this.pickedFromDate = new Date(now);
      this.fromDate = this.currentDate;
      this.pickedToDate = new Date(now);
      this.toDate = this.currentDate;
  //  this.deviceId = data.deviceId;
  }

  ngOnInit() {
      if (this.appService.currentLang == 'fa') {
          let jalaliFrom = this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.fromDate));
          this.pickedFromDate = moment(jalaliFrom, 'jYYYY,jMM,jDD');
          let jalaliTo = this.calendarConverter.convertFromGregorianToJalaliString(this.calendarConverter.convertDateFormat(this.toDate));
          this.pickedToDate = moment(jalaliTo, 'jYYYY,jMM,jDD');
      }
      if (this.appService.currentLang == 'en') {
          this.pickedFromDate = new Date(this.calendarConverter.convertDateFormat(this.fromDate));
          this.pickedToDate = new Date(this.calendarConverter.convertDateFormat(this.toDate));
      }
    this.parkingService.parkingFloor.subscribe(
        (floor:any)=>{
            this.floorInfo=floor;
        }
    )
  }
    convertJalaliDateToUTC(tempDate: any, state: any) {
        if (state == 'from') {
            this.fromDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
        }
        if (state == 'to') {
            this.toDate = this.datePipe.transform(tempDate._d, 'dd/MM/yyyy');
        }
    }

    convertGregorianDateToUTC(tempDate: any, state: any) {
        if (state == 'from') {
            this.fromDate = this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
        }
        if (state == 'to') {
            this.toDate = this.datePipe.transform(tempDate._selected, 'dd/MM/yyyy');
        }
    }
  ngOnDestroy() {
    this.reserveParkingOpenCount = 0;
    this.localStorageService.store('addClicked', false);
  }

  getAllStaffs() {

    this.staffs = [];
    // if (this.page === 1) {
    //   this.staffs = [];
    // }

   if (! this.departmentId){
     this.departmentId = -1;
   }
    if(! this.subdepartmentId){
    this.subdepartmentId =-1;
    }
    if(! this.status){
    this.status ="ALL";
    }

    this.isLoading = true;
    this.staffService
      .getAllStaffsByDeptSubDept(this.size, this.page, this.departmentId, this.subdepartmentId, this.status)
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
  // deleting reservation function
  deleteReservation(){

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

    getStaff(employeeId){
      this.parkingService
          .getStaffId(employeeId)
          .subscribe(res => {

              console.log(res);
          if (res.status === 200) {
             var returnedStaff =  JSON.parse(res._body);
          this.parkingService
              .getStaffInfo(returnedStaff.staffId)
              .subscribe(res => {

                  if (res.status === 200) {
                      this.staffInfo = JSON.parse(res._body);

                      this.staffService.getPolicyDetails(this.staffInfo.id).subscribe(
                          (staffTemp:any)=>{
                              let staffT= JSON.parse(staffTemp._body);
                              this.departmentId=staffT.departmentId;
                              this.departmentName=staffT.deptnameMultiLingual;

                              this.subdepartmentId=staffT.subDepartmentId;
                              this.subdepartmentName=staffT.subDeptnameMultiLingual;
                              this.designationId=staffT.designationId;
                              this.designationName=staffT.designation;
                              for(let floor of this.floorInfo){
                                  if(this.areaId==floor.areaId && this.staffInfo.id==floor.staff.id){
                                      this.regno=floor.regno;
                                      this.startDate=floor.startTime;
                                      this.endDate=floor.endTime;
                                  }

                              }
                          }
                      )
                      console.log(this.staffInfo);
                      this.firstName = this.staffInfo.firstNameMultiLingual;
                      this.contactNo=this.staffInfo.mobileNum;
                  }
              });
          }
         }, (error: any) => {
          // this
          // .snackBar
          // .open('This employee does not exist', 'Ok', {
          //     duration: 5000,
          // });
      });
    }

    closeModal() {

    this
      .localStorageService
      .store("addClicked", false);
        this.dialogRef.close();
        this.dialogRef = null;
  }
  deleteModal(){
//     this.parkingService
//     .delStaffId(employeeId)
//     .subscribe(res => {
//     if (res.status === 200) {
//        var returnedStaff =  JSON.parse(res._body);
//     this.parkingService
//         .getStaffInfo(returnedStaff.staffId)
//         .subscribe(res => {
//             if (res.status === 200) {
//                 this.staffInfo = JSON.parse(res._body);
//                 this.firstName = this.staffInfo.firstName;
//             }
//         });
//     }
//    }, (error: any) => {
//     this
//     .snackBar
//     .open('Error occured', 'Ok', {
//         duration: 5000,
//     });
// });
  }

    onSubmit() {


      //
      let data : any = "{";
      // "staff_id":1,
      // "floorId":126,
      // "pointId":48,
      // "areaName":"testupdate9",
      // "areaId":127,
      // "regno":12345,
      // "contactNo":9442,
      // "startTime":"2018-01-02",
      // "endTime":"2018-01-12"

      data = data+ "\"staff_id\":\"" + this.staffInfo.id +"\",";
      data = data+ "\"floorId\" :\"" + this.selectedPoint.floorId +"\",";
      data = data+ "\"pointId\" :\"" + this.selectedPoint.pointId +"\",";
      data = data+ "\"areaName\" :\"" + this.selectedPoint.areaName +"\",";
      data = data+ "\"areaId\" :\"" + this.selectedPoint.areaId +"\",";
      data = data+ "\"regno\" :\"" + this.regno +"\",";
      data = data+ "\"contactNo\" :\"" + this.contactNo +"\",";
      data = data+ "\"startTime\" :\"" +this.datePipe.transform(this.startDate , 'dd-MM-yyyy') +"\",";
      data = data+ "\"endTime\" :\"" + this.datePipe.transform(this.endDate , 'dd-MM-yyyy') +"\",";
      data = data + "\"staff\" : {\"id\":\""+ this.staffInfo.id+"\"}}" ;

      
      //"}";

    
      //var json = JSON.parse(data);

      

      // data.push("staff_id",this.staffInfo.id);
      // data.push("floorId",this.floorId);
      // data.push( "pointId",0);
      // data.push( "areaName","testupdate9");
      // data.push( "areaId",this.areaId);
      // data.push( "regno",this.regno);
      // data.push( "contactNo",this.contactNo);
      // data.push( "startTime",this.startDate);
      // data.push( "endTime",this.endDate);

        if(this.mode=='Assign'){
            this.parkingService
                .createParkingReservation(data)
                .subscribe(res => {
                    if (res.status === 200) {
                        // this
                        //     .snackBar
                        //     .open('Successfully added', 'Ok', {
                        //         duration: 5000,
                        //     });
                        this.dialogRef.close();
                        this.dialogRef = null;
                    }
                }, (error: any) => {
                    // this
                    //     .snackBar
                    //     .open('Error occured', 'Ok', {
                    //         duration: 5000,
                    //     });
                    this.dialogRef.close();
                    this.dialogRef = null;
                });
        }

        if(this.mode=='Update'){
            this.parkingService
                .updateParkingReservation(data)
                .subscribe(res => {
                    if (res.status === 200) {
                        // this
                        //     .snackBar
                        //     .open('Successfully updated', 'Ok', {
                        //         duration: 5000,
                        //     });
                        this.dialogRef.close();
                        this.dialogRef = null;
                    }
                }, (error: any) => {
                    // this
                    //     .snackBar
                    //     .open('Error occured', 'Ok', {
                    //         duration: 5000,
                    //     });
                    this.dialogRef.close();
                    this.dialogRef = null;
                });
        }
    }
}