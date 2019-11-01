import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlugComponent } from './view-plug.component';

describe('ViewPlugComponent', () => {
  let component: ViewPlugComponent;
  let fixture: ComponentFixture<ViewPlugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPlugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPlugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
