import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLevelComponent } from './manage-level.component';

describe('ManageLevelComponent', () => {
  let component: ManageLevelComponent;
  let fixture: ComponentFixture<ManageLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
