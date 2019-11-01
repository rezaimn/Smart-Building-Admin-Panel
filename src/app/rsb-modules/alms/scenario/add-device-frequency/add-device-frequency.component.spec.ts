import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeviceFrequencyComponent } from './add-device-frequency.component';

describe('AddDeviceFrequencyComponent', () => {
  let component: AddDeviceFrequencyComponent;
  let fixture: ComponentFixture<AddDeviceFrequencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDeviceFrequencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeviceFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
