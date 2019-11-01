import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmergencyComponent } from './view-emergency.component';

describe('ViewEmergencyComponent', () => {
  let component: ViewEmergencyComponent;
  let fixture: ComponentFixture<ViewEmergencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmergencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmergencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
