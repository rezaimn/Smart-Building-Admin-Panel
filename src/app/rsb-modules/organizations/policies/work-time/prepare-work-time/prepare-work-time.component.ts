import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NgModel} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AppService} from '../../../../../app.service';
import {SessionStorage} from 'ngx-webstorage';
import {PagerComponent} from '../../pager/pager.component';
import {WorkTime} from '../worktime';
import {PoliciesService} from '../../policies.service';
import {TranslateService} from '@ngx-translate/core';
declare let $ : any;

@Component({ selector: 'app-prepare-work-time', templateUrl: './prepare-work-time.component.html', styleUrls: ['./prepare-work-time.component.scss'] })
export class PrepareWorkTimeComponent implements OnInit {
  @SessionStorage('organization')
  public organization;
  @SessionStorage('subsidiary')
  public subsidiary;
  @SessionStorage('workTime')
  public workTimePolicyTemp: Array<any>;
  public workTime: WorkTime = new WorkTime({});
  // @ViewChild('timepicker')public input : ElementRef;
  public workTimePolicy = [];
  public testData : any;
  public wrongWorkTime : boolean;
  public wrongMealTime : boolean;
  public index:any;
  @SessionStorage('designation')
  public designation;

  constructor(public translate:TranslateService,private appService: AppService, private pagerComponent: PagerComponent, private policiesService: PoliciesService, private router: Router) { }

  // sendHeader(): void {
  //   // Send message to subscribers via observable subject
  //   if (this.designation) {
  //     this
  //       .appService
  //       .sendHeader(this.designation.designation, 'create work time policy', 'create work time policy', '');
  //   }
  // }
  sendHeaderWithLogo(): void {
    // Send message to subscribers via observable subject
    if (this.designation) {
      this
        .appService
        .sendHeaderWithLogo(this.designation.designation, 'create work time policy', 'create work time policy', '','../../../../../assets/images/dashboard/OMS.png');
    }
  }

  ngOnInit() {
    this
      .policiesService
.getAllWorkTimePolicy(`/rsb-oms/oms/getAllWorkTimePoliciesBySubsidairyId?subsidairyId=` + this.subsidiary.id)
  .subscribe((res) => {
        let data
        if(res._body !== null && res._body !== ''){
          data = JSON.parse(res._body)
          this.index = data.length + 1;
        }else{
          this.index = '1';
        }
      },(error)=>{
        // this.snackBar.open('Error occured','',{duration:2000 ,extraClasses: ['error-snackbar']})
      })
    this.sendHeaderWithLogo();
    this
      .pagerComponent
      .changeState('pager', true, '', '')

    this
      .pagerComponent
      .changeState('close', true, '', '')
    this
      .pagerComponent
      .changeState('create', false, '', '')
    this
      .pagerComponent
      .changeState('step', false, '', '')
    // $(document).mdtimepicker();
    this
      .policiesService
      .getAllWorkTimePolicy(`/rsb-oms/oms/getAllWorkTimePoliciesBySubsidairyId?subsidairyId=` + this.subsidiary.id)
      .subscribe((data) => {
        data = JSON.parse(data._body);
        if (data.length >= 1) {
          this.workTime.isFirstDefault = 0;
          this.workTime.isFirstAssisgned = 0;
        } else {
          this.workTime.isFirstDefault = 1;
          this.workTime.isFirstAssisgned = 1;
        }
      }, (error) => {
        // this
        //   .snackBar
        //   .open('error occured', '', { duration: 1000 })
      })
  }

  onSubmit() {
    this.workTime.subsidairyId = this.subsidiary.id;
    console.log(JSON.stringify(this.workTime));
    this
      .policiesService
      .createWorkTimePolicy('/rsb-oms/oms/createWorkTimePolicy', this.workTime)
      .subscribe((data) => {
        console.log(data);
        this
          .workTimePolicy
          .push(JSON.parse(data._body));
        this.workTimePolicyTemp = this.workTimePolicy;
        this
          .router
          .navigate(['/rsb-modules/organization/dept/policies/work-time/manage']);
      }, (error) => {
        if(error.status == 1006){
          // this.snackBar.open('Shift name already exist','',{duration:2000,extraClasses:['error-snackbar']})
        }else{
// this
//   .snackBar
//   .open('Error in processing request', '', {
//     duration: 2000,
//     extraClasses: ['error-snackbar']
//   })
        }
      })
  }

  cancelWorkTimeCreation() {
    this
      .router
      .navigate(['/rsb-modules/organization/dept/policies/work-time/manage']);
  }

  openTimer(event : NgModel, id) {
  
    let eve = event;
    let self = this;
    $('#' + id)
      .mdtimepicker({
        // format of the time value (data-time attribute)
        timeFormat: 'hh:mm:ss',

        // format of the input value
        format: 'HH:mm tt',

        // theme of the timepicker 'red', 'purple', 'indigo', 'teal', 'green'
        theme: 'blue',

        // determines if input is readonly
        readOnly: false,

        // determines if display value has zero padding for hour value less than 10
        // (i.e. 05:30 PM); 24-hour format has padding by default
        hourPadding: false
      })
      .on('timechanged', function (e) {
        self.workTime[eve.name] = e.time;
        // eve[eve.name]=e.time; event.value = e.time;
        if (eve.name === "workEndTime") {
          self.checkDuration(self.workTime.workStartTime, self.workTime.workEndTime, 'workend');
          self.checkTime(self.workTime.workStartTime, self.workTime.workEndTime, 'work')
        }
        if (eve.name === "mealEndTime") {
          self.checkDuration(self.workTime.mealStartTime, self.workTime.mealEndTime, 'mealend');
          self.checkTime(self.workTime.mealStartTime, self.workTime.mealEndTime, 'meal');
        }

      });
  }
  checkTime(strTime, endTime, field) {
    if (strTime >= endTime) {
      if (field == 'work') {
        this.wrongWorkTime = true;
      } else if (field == 'meal') {
        this.wrongMealTime = true;
        this.wrongWorkTime = false;
      } else {
        this.wrongMealTime = false;
      }
    }
  }
  formatTime(event, model, field) {
    if (event.length == 2) {
      this.workTime[model.name] = event + ':';
    } else if (event.length == 5) {
      this.workTime[model.name] = event + ':';
    } else {
      this.workTime[model.name] = event
    }
    if (event.length == 8 && field == 'workend') {
      this.checkDuration(this.workTime.workStartTime, this.workTime.workEndTime, field)
    } else if (event.length == 8 && field == 'mealend') {
      this.checkDuration(this.workTime.mealStartTime, this.workTime.mealEndTime, field)
    }

    if (field == 'workend' && field == 'workstart') {
      this.checkDuration(this.workTime.workStartTime, this.workTime.workEndTime, field)
    } else if (field == 'mealend' && field == 'mealstart') {
      this.checkDuration(this.workTime.mealStartTime, this.workTime.mealEndTime, field)
    }
  }
  checkDuration(strtime, endtime, fieldObj) {
    let self = this.workTime;
    let hrs,
      absolueteMin, start, end;
    // var hms = '02:04:33'; // your input string
    if (strtime !== '' && endtime !== '') {
      start = strtime.split(':'); // split it at the colons
      end = endtime.split(':'); // split it at the colons
    }
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    const startTime = (+ start[0]) * 60 * 60 + (+ start[1]) * 60 + (+ start[2]);
    const endTime = (+ end[0]) * 60 * 60 + (+ end[1]) * 60 + (+ end[2]);
    const totSeconds = endTime - startTime;
    const durHrs = totSeconds / 3600;
    const absolueteHrs = Math.floor(durHrs);
    const durMin = (durHrs - absolueteHrs) * 60;
    absolueteMin = Math.floor(durMin);
    absolueteMin = absolueteMin > 10 ? absolueteMin : '0'+absolueteMin;
    hrs = absolueteHrs > 9
    ? absolueteHrs
    : '0' + absolueteHrs;
      if (fieldObj == 'workend') {
        self.workDuration = parseFloat(hrs + ':' + absolueteMin);
      } else {
        self.mealDuration = parseFloat(hrs + ':' + absolueteMin);
      }
  }
}
