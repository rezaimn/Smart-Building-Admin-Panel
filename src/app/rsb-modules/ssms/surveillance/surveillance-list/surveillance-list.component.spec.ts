import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveillanceListComponent } from './surveillance-list.component';

describe('SurveillanceListComponent', () => {
  let component: SurveillanceListComponent;
  let fixture: ComponentFixture<SurveillanceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveillanceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveillanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
