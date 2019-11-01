import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReservedParkingComponent } from './edit-reserved-parking.component';

describe('EditReservedParkingComponent', () => {
  let component: EditReservedParkingComponent;
  let fixture: ComponentFixture<EditReservedParkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditReservedParkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReservedParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
