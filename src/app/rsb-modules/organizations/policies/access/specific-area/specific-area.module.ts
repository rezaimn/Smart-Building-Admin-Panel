import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSpecificAreaComponent } from './manage-specific-area/manage-specific-area.component';
import { PrepareSpecificAreaComponent } from './prepare-specific-area/prepare-specific-area.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { AssignAreaComponent } from './manage-specific-area/assign-area/assign-area.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [ManageSpecificAreaComponent, PrepareSpecificAreaComponent],
  exports:[ManageSpecificAreaComponent, PrepareSpecificAreaComponent]
})
export class SpecificAreaModule { }
