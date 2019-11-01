import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveRejComponent } from '../approve-reject/approve-reject.component';

describe('ApproveRejectComponent', () => {
  let component: ApproveRejComponent;
  let fixture: ComponentFixture<ApproveRejComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveRejComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveRejComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
