import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareStaffComponent } from './prepare-staff.component';

describe('PrepareStaffComponent', () => {
  let component: PrepareStaffComponent;
  let fixture: ComponentFixture<PrepareStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
