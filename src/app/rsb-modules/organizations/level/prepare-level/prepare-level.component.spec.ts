import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareLevelComponent } from './prepare-level.component';

describe('PrepareLevelComponent', () => {
  let component: PrepareLevelComponent;
  let fixture: ComponentFixture<PrepareLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
