import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDeviceComponent } from './filter-device.component';

describe('FilterDeviceComponent', () => {
  let component: FilterDeviceComponent;
  let fixture: ComponentFixture<FilterDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
