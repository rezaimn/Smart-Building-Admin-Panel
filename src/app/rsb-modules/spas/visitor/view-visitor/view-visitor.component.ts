import {Component, OnInit, Inject, Input, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {LocalStorageService, LocalStorage, SessionStorage, SessionStorageService} from 'ngx-webstorage';
import {VisitorService} from '../visitor.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'jalali-moment';
import {AppService} from '../../../../app.service';
import {cardHolder, visitorInfo} from '../../access-model';


@Component({
  selector: 'app-view-visitor',
  templateUrl: './view-visitor.component.html',
  styleUrls: ['./view-visitor.component.scss']
})
export class ViewVisitorComponent implements OnInit, OnDestroy {

  public prepareVisitor= new visitorInfo({});
 // public cardHolder=new cardHolder({});
  public workGroupId=0;
  public now = moment();
  public workGroups=[];
  public mode='new';
  @SessionStorage('prepareVisitorComponentOpenCount')
  public prepareVisitorComponentOpenCount;
  constructor(
    public dialogRef: MatDialogRef<ViewVisitorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public appService:AppService,
    private storage: LocalStorageService,
    private visitorService: VisitorService,

    public translate:TranslateService,) {
   //   if(data.length > 0){
        this.prepareVisitor = data.visitor;
        this.mode=data.mode;
        this.workGroupId=this.prepareVisitor.cardholder.workgroup.id;
      dialogRef.disableClose = true;
   //   }
   
  }

  ngOnInit() {
   this.getAllWorkGroups();

  }

    getAllWorkGroups(){
        this.workGroups = [];

        this.visitorService
            .getAllWorkGroups('visitor',this.appService.currentLang)
            .subscribe((res) => {

                this.workGroups = JSON.parse(res._body).content;

            }, (err) => {

            });
    }
  ngAfterViewInit() {
  }

  addUpdateVisitor() {
      this.setWorkGroupForVisitor();
      delete this.prepareVisitor.cardholder.employeeId;

      // delete this.prepareVisitor.cardholder.accessElements[0].doors;
       delete this.prepareVisitor.cardholder.department;
       delete this.prepareVisitor.cardholder.subDepartment;
       delete this.prepareVisitor.cardholder.lastNameMultiLingual;
       delete this.prepareVisitor.cardholder.firstNameMultiLingual;
       delete this.prepareVisitor.cardholder.timeSchedule;
       delete this.prepareVisitor.cardholder.accessElement;


      if(this.mode=='new'){
         delete this.prepareVisitor.id;
          delete this.prepareVisitor.cardholder.id;
         this.prepareVisitor.cardholder.enabled=true;
          this
              .visitorService
              .addCardHolder(this.prepareVisitor.cardholder)
              .subscribe((cardH) => {
                  let CHId= JSON.parse(cardH._body).id;
                  this.prepareVisitor.cardholder.id=CHId;
                  this
                      .visitorService
                      .addVisitor(this.prepareVisitor)
                      .subscribe((visitor) => {
                        //  let jsonData = JSON.parse(visitor._body);
                          this.closeModal();
                      }, (error) => {

                      });
              }
              )
      }
      if(this.mode=='edit'){
          this
              .visitorService
              .updateCardHolder(this.prepareVisitor.cardholder)
              .subscribe((data) => {
                  this
                      .visitorService
                      .updateVisitor(this.prepareVisitor)
                      .subscribe((data) => {

                          //let jsonData = JSON.parse(data._body);
                          this.closeModal();
                      }, (error) => {

                      });
              }
              )
      }
  }
    setWorkGroupForVisitor() {
        for (let WG of this.workGroups) {
            if (WG.id==this.workGroupId) {
                this.prepareVisitor.cardholder.workgroup=WG;
            }
        }
    }


   closeModal() {
    this
      .dialogRef
      .close();
    this.dialogRef = null;
    this.storage.store('addClicked', false);
  }


  ngOnDestroy() {
    this.storage.store('addClicked', false);
   this.prepareVisitorComponentOpenCount = 0;
  }
}
