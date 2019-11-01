import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkPolicyListComponent } from './work-list.component';

describe('WorkPolicyListComponent', () => {
  let component: WorkPolicyListComponent;
  let fixture: ComponentFixture<WorkPolicyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkPolicyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkPolicyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
