import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareGradeComponent } from './prepare-grade.component';

describe('PrepareGradeComponent', () => {
  let component: PrepareGradeComponent;
  let fixture: ComponentFixture<PrepareGradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareGradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
