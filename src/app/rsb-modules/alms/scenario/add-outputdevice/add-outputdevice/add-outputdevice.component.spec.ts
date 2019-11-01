import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOutputdeviceComponent } from './add-outputdevice.component';

describe('AddOutputdeviceComponent', () => {
  let component: AddOutputdeviceComponent;
  let fixture: ComponentFixture<AddOutputdeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOutputdeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOutputdeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
