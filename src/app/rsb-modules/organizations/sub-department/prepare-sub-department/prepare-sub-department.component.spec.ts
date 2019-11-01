import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareSubDepartmentComponent } from './prepare-sub-department.component';

describe('PrepareSubDepartmentComponent', () => {
  let component: PrepareSubDepartmentComponent;
  let fixture: ComponentFixture<PrepareSubDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareSubDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareSubDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
