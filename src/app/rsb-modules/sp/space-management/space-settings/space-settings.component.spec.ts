import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceSettingsComponent } from './space-settings.component';

describe('PrepareTypeComponent', () => {
  let component: SpaceSettingsComponent;
  let fixture: ComponentFixture<SpaceSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
