import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradeRoutingModule } from './grade-routing.module';
import { ManageGradeComponent } from './manage-grade/manage-grade.component';
import { PrepareGradeComponent } from './prepare-grade/prepare-grade.component';
import { FormsModule } from '@angular/forms';
import { PoliciesService } from '../policies.service';

@NgModule({
  imports: [
    CommonModule,
    GradeRoutingModule,
    FormsModule
  ],
  providers: [PoliciesService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ManageGradeComponent, PrepareGradeComponent]
})
export class GradeModule { }
