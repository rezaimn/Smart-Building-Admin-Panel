import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareDeviceComponent } from './prepare-device.component';

describe('ErrorTableComponent', () => {
  let component: PrepareDeviceComponent;
  let fixture: ComponentFixture<PrepareDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
