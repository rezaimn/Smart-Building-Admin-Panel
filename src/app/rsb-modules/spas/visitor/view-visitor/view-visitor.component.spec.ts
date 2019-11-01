import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVisitorComponent } from './view-visitor.component';

describe('ViewStaffComponent', () => {
  let component: ViewVisitorComponent;
  let fixture: ComponentFixture<ViewVisitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVisitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
