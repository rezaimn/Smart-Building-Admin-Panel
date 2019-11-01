import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveParkingComponent } from './reserve-parking.component';

describe('ReserveParkingComponent', () => {
  let component: ReserveParkingComponent;
  let fixture: ComponentFixture<ReserveParkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveParkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
