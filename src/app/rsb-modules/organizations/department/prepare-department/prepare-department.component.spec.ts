import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareDepartmentComponent } from './prepare-department.component';

describe('PrepareRoleComponent', () => {
  let component: PrepareDepartmentComponent;
  let fixture: ComponentFixture<PrepareDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
