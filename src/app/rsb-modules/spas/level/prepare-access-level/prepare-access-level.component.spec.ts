import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareAccessLevelComponent } from './prepare-access-level.component';

describe('PrepareAccessLevelComponent', () => {
  let component: PrepareAccessLevelComponent;
  let fixture: ComponentFixture<PrepareAccessLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareAccessLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareAccessLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
