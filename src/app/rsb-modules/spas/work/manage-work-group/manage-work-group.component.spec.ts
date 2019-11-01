import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWorkGroupComponent } from './manage-work-group.component';

describe('ManageStaffComponent', () => {
  let component: ManageWorkGroupComponent;
  let fixture: ComponentFixture<ManageWorkGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageWorkGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWorkGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
