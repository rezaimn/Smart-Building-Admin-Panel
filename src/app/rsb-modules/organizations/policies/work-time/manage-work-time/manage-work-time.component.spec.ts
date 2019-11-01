import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWorkTimeComponent } from './manage-work-time.component';

describe('ManageWorkTimeComponent', () => {
  let component: ManageWorkTimeComponent;
  let fixture: ComponentFixture<ManageWorkTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageWorkTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWorkTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
