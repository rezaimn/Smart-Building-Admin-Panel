import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareAreaComponent } from './prepare-area.component';

describe('PrepareAreaComponent', () => {
  let component: PrepareAreaComponent;
  let fixture: ComponentFixture<PrepareAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
