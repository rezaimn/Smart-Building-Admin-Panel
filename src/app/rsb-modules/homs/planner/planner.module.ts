import { AddMenuComponent } from './add-menu/add-menu.component';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PlannerRoutingModule } from './planner-routing.module';
import { PlannerListComponent } from './planner-list/planner-list.component';
import { PlannerService } from './planner.service';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from 'app/rsb-modules/homs/planner/menu/menu.component';
import { ViewPlannerComponent } from './view/view.component';
import {TranslateModule} from '@ngx-translate/core';
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

@NgModule({
  imports: [
    CommonModule,
    PlannerRoutingModule,
      MatNativeDateModule,
      MatDatepickerModule,
    FormsModule,
      TranslateModule,
      DpDatePickerModule

  ],
  providers: [
    PlannerService,
    DatePipe
  ],
  declarations: [
    PlannerListComponent,
    AddMenuComponent,
    MenuComponent,  
    ViewPlannerComponent,  
  ],
  entryComponents: [
    AddMenuComponent,
    MenuComponent,
    ViewPlannerComponent
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PlannerModule { }
