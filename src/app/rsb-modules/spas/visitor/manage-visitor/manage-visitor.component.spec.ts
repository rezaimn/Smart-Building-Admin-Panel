import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVisitorComponent } from './manage-visitor.component';

describe('ManageStaffComponent', () => {
  let component: ManageVisitorComponent;
  let fixture: ComponentFixture<ManageVisitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageVisitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
