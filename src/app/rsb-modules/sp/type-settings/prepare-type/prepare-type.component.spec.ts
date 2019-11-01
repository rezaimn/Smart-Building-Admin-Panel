import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareTypeComponent } from './prepare-type.component';

describe('PrepareTypeComponent', () => {
  let component: PrepareTypeComponent;
  let fixture: ComponentFixture<PrepareTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
