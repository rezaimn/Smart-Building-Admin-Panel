import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallNotifyComponent } from './call-notify.component';

describe('CallNotifyComponent', () => {
  let component: CallNotifyComponent;
  let fixture: ComponentFixture<CallNotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallNotifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
