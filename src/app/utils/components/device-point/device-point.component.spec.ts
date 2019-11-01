import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicePointComponent } from './device-point.component';

describe('SelectRegionComponent', () => {
  let component: DevicePointComponent;
  let fixture: ComponentFixture<DevicePointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicePointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
