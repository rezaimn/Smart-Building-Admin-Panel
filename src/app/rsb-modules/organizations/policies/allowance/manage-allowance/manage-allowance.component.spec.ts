import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAllowanceComponent } from './manage-allowance.component';

describe('ManageAllowanceComponent', () => {
  let component: ManageAllowanceComponent;
  let fixture: ComponentFixture<ManageAllowanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAllowanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
