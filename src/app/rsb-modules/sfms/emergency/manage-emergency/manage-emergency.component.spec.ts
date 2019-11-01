import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmergencyComponent } from './manage-emergency.component';

describe('ManageEmergencyComponent', () => {
  let component: ManageEmergencyComponent;
  let fixture: ComponentFixture<ManageEmergencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageEmergencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEmergencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
