import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSwitchComponent } from './manage-switch.component';

describe('ManageSwitchComponent', () => {
  let component: ManageSwitchComponent;
  let fixture: ComponentFixture<ManageSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
