import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAreaComponent } from './assign-area.component';

describe('AssignAreaComponent', () => {
  let component: AssignAreaComponent;
  let fixture: ComponentFixture<AssignAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
