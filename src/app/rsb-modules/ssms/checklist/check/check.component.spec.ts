
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckComponentList } from './check.component';

describe('CheckComponent', () => {
  let component: CheckComponentList;
  let fixture: ComponentFixture<CheckComponentList>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckComponentList ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckComponentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
