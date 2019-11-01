import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareWorkGroupComponent } from './prepare-work-group.component';

describe('ViewStaffComponent', () => {
  let component: PrepareWorkGroupComponent;
  let fixture: ComponentFixture<PrepareWorkGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareWorkGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareWorkGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
