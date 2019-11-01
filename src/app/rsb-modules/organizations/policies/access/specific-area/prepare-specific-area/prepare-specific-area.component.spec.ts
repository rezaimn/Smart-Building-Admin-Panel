import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareSpecificAreaComponent } from './prepare-specific-area.component';

describe('PrepareSpecificAreaComponent', () => {
  let component: PrepareSpecificAreaComponent;
  let fixture: ComponentFixture<PrepareSpecificAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareSpecificAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareSpecificAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
