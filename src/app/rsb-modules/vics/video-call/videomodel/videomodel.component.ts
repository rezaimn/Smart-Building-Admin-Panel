import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { AppService } from '../../../../app.service';
import { Department, SubDepartment, Designation } from '../../../organizations/staff/staff';
import { StaffService } from '../../../organizations/staff/staff.service';
import { LocalStorageService, SessionStorage } from 'ngx-webstorage';
//import { Zone, AccessGroup } from '../zone';

import  { MAT_DIALOG_DATA} from '@angular/material';

import { Router, ActivatedRoute } from '@angular/router';
import { setTimeout } from 'timers';
import { FUNCTION_TYPE } from '@angular/compiler/src/output/output_ast';
import { VideoCallService } from '../video-call.service';
import {TranslateService} from '@ngx-translate/core';
import {MatDialogRef} from '@angular/material';


@Component({
	selector: 'app-model-video',
	templateUrl: './videomodel.component.html',
	styleUrls: ['./videomodel.component.scss']
})
export class VideomodelComponent implements OnInit, OnDestroy {


	// public zone: any = {};
	public url: any;

	@SessionStorage('user')
	public loggedInUser;

	constructor(
		public dialogRef: MatDialogRef<VideomodelComponent>,
		private sanitizer: DomSanitizer,
		public videoCallService: VideoCallService,
        public appService:AppService,
        public translate:TranslateService,

    @Inject(MAT_DIALOG_DATA) public data: any) {
		//  set the date format in dd-mm-yyyy format
		// this.dateAdapter.setLocale('en-In');

		//    this.message = this.editStaffMessage;
		// dialogRef.disableClose=true;
		//alert(data);
		console.log(data);
		this.url = this.sanitizer.bypassSecurityTrustResourceUrl(data);
        dialogRef.disableClose = true;

	}


	ngOnInit() {
		//this.sendHeader();
		// this.updateBreadCrums();
		// this.myDate = new Date();


		// this.getAllAccessGroups();

		// // Department Details for Step 3
		// this.getDepartmentDetails();
		// console.log('wamshi');

	}

	sendHeader(): void {
		// Send message to subscribers via observable subject
		// if (this.subsidiary !== null) {
		//   this
		//     .appService
		//     .sendHeader(this.subsidiary.name, 'add zone', 'create access zone', '');
		// }
	}

	updateBreadCrums() {
		// this
		//   .appService
		//   .updateBreadCrums('ACCESSZONE');
	}





	/**

	   createStaff(personalInfo: PersonalInfo) {

		//Remove the unwanted Details when Making API calls
		this.staffService.createStaff(personalInfo)
		  .subscribe(res => {
			// Get the Staff Id from the Response and Make API calls for,
			// Employment, Policy, Vehicle
			let staff = JSON.parse(res._body);
			// Assign the Id coming from the API response
			let staffId = staff.id;
			//Make Serial Calls for Proper flow
			this.addEmployment(this.employementDetails, staffId);
		  }, (err: any) => {
			this.createStaffError('error occured while creating the staff');
		  })
	  }

	*/

	getAllAccessGroups() {
		// this.accessGroups=[];
		// this
		//   .zoneService
		//   .getAllAccessGroups()
		//   .subscribe(res => {
		//     if (res.status === 200) {
		//       let accessGroupDetails= JSON.parse(res._body);
		//       accessGroupDetails.forEach(accessGroup => {

		//         this.accessGroups.push(accessGroup);
		//       });
		//     }
		//   }, (error: any) => {

		//   });


	}

	getDepartmentDetails() {
		// this.departments = [];
		// this
		//   .staffService
		//   .getDepartmentDetails()
		//   .subscribe(res => {
		//     if (res.status === 200) {
		//       let departmentDetails = JSON.parse(res._body);
		//       departmentDetails.forEach(department => {
		//         let sds: SubDepartment[] = [];
		//         if (department.subDepartments !== undefined && department.subDepartments.length > 0) {
		//           department.subDepartments.forEach(subdepartment => {
		//             let dss: Designation[] = [];
		//             if (subdepartment.designations !== undefined && subdepartment.designations.length > 0) {
		//               subdepartment.designations.forEach(designation => {
		//                 let dObject = new Designation(designation);
		//                 dss.push(dObject);
		//               });
		//             }
		//             let sdObject = new SubDepartment(subdepartment, dss);
		//             sds.push(sdObject);
		//           });
		//         }

		//         let ds: Designation[] = [];
		//         if (department.designations !== undefined && department.designations.length > 0) {
		//           department.designations.forEach(designation => {
		//             let dObject = new Designation(designation);
		//             ds.push(dObject);
		//           });
		//         }

		//         let dptObject = new Department(department, sds, ds);
		//         this.departments.push(dptObject);
		//       });
		//       this.updateSubDepartmentsEdit();
		//       console.log("shart");
		//     }
		//   }, (error: any) => {

		//   });
	}


	updateSubDepartments(event) {
		//   this.subdepartments = [];
		//  // console.log(event);
		//   this.departments.forEach(department => {
		//  //   console.log(department)
		//     if( department.id === event ){
		//       department.subdepartments.forEach(dep =>{
		//         this.subdepartments.push(dep);
		//       });
		//     }

		//   });

	}

	updateSubDepartmentsEdit() {
		// this.subdepartments = [];

		// this.departments.forEach(department => {
		//     this.subdepartments = department.subdepartments;

		// });
	}




	closeModal() {
		this
			.dialogRef
			.close();
		this.dialogRef = null;
		let vicsurl: string = this.url;
		if (this.url.changingThisBreaksApplicationSecurity) {
			vicsurl = this.url.changingThisBreaksApplicationSecurity;
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
				// this
				// 	.dialogRef
				// 	.close();
				// this.dialogRef = null;

			}, (error: any) => {
			});

		//this.storage.store('addClicked', false);
	}

	onSubmit() {
		// this.zone.subsidiaryId = this.subsidiary.id;


		//   this
		//     .zoneService
		//     .createAccessZone(`/rsb-oms/oms/access/createAcessZone`, this.zone)
		//     .subscribe((data) => {
		//      // alert ("submitted successfully");
		//      this.snackBar.open('Submitted Successfully', 'okay', { duration: 3000 });
		//      this.closeModal();

		//     }, (error) => {
		//       this.snackBar.open('There was an error while creating Department', 'okay', { duration: 3000 });
		//     });
	}


	ngOnDestroy() {
		//   this.storage.store('addClicked', false);
		//  this.prepareDepartmentComponentOpenCount = 0;
	}



}
