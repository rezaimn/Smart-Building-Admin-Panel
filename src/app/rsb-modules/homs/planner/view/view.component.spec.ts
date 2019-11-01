import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlannerComponent } from './view.component';

describe('ViewPlannerComponent', () => {
  let component: ViewPlannerComponent;
  let fixture: ComponentFixture<ViewPlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
