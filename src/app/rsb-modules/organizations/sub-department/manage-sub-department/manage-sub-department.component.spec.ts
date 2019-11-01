import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSubDepartmentComponent } from './manage-sub-department.component';

describe('ManageSubDepartmentComponent', () => {
  let component: ManageSubDepartmentComponent;
  let fixture: ComponentFixture<ManageSubDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSubDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSubDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
