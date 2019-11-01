import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatrolComponentList } from './patrol.component';

describe('PatrolComponent', () => {
  let component: PatrolComponentList;
  let fixture: ComponentFixture<PatrolComponentList>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatrolComponentList ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatrolComponentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 
});
