import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAccessLevelComponent } from './manage-access-level.component';

describe('ManageAccessLevelComponent', () => {
  let component: ManageAccessLevelComponent;
  let fixture: ComponentFixture<ManageAccessLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAccessLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAccessLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
