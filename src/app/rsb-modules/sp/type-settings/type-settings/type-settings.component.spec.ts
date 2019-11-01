import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeSettingsComponent } from './type-settings.component';

describe('SpaceSettingsComponent', () => {
  let component: TypeSettingsComponent;
  let fixture: ComponentFixture<TypeSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
