import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareWorkTimeComponent } from './prepare-work-time.component';

describe('PrepareWorkTimeComponent', () => {
  let component: PrepareWorkTimeComponent;
  let fixture: ComponentFixture<PrepareWorkTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareWorkTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareWorkTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
