import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareAccessGroupComponent } from './prepare-access-group.component';

describe('ViewStaffComponent', () => {
  let component: PrepareAccessGroupComponent;
  let fixture: ComponentFixture<PrepareAccessGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareAccessGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareAccessGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
