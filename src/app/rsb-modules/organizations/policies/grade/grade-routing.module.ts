import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../../../../common';
import { ManageGradeComponent } from './manage-grade/manage-grade.component';
import { PagerComponent } from '../pager/pager.component';
import { PrepareGradeComponent } from './prepare-grade/prepare-grade.component';

const routes: Routes = [
  {
    path: 'dept/policies', component: LayoutComponent,

    children: [
      {
        path: 'grade', component: PagerComponent,
    
        children: [
          {
            path: 'manage', component: ManageGradeComponent,
        
          },
          {
            path: 'prepare', component: PrepareGradeComponent,
        
          }
        ]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GradeRoutingModule { }
