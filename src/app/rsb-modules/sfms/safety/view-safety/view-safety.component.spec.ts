import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSafetyComponent } from './view-safety.component';

describe('ViewSafetyComponent', () => {
  let component: ViewSafetyComponent;
  let fixture: ComponentFixture<ViewSafetyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSafetyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSafetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
