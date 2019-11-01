import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGradeComponent } from './manage-grade.component';

describe('ManageGradeComponent', () => {
  let component: ManageGradeComponent;
  let fixture: ComponentFixture<ManageGradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageGradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
