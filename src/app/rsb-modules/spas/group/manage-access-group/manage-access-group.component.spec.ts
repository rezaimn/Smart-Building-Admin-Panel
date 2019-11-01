import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAccessGroupComponent } from './manage-access-group.component';

describe('ManageStaffComponent', () => {
  let component: ManageAccessGroupComponent;
  let fixture: ComponentFixture<ManageAccessGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAccessGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAccessGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
