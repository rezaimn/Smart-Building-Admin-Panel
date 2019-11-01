import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDeviceConfigurationComponent } from './manage-device-configuration.component';

describe('ManageDeviceConfigurationComponent', () => {
  let component: ManageDeviceConfigurationComponent;
  let fixture: ComponentFixture<ManageDeviceConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDeviceConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDeviceConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
