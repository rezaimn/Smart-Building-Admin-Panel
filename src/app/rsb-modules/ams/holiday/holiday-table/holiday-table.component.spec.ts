import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayTableComponent } from './holiday-table.component';

describe('HolidayTableComponent', () => {
  let component: HolidayTableComponent;
  let fixture: ComponentFixture<HolidayTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
