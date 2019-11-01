import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareAllowanceComponent } from './prepare-allowance.component';

describe('PrepareAllowanceComponent', () => {
  let component: PrepareAllowanceComponent;
  let fixture: ComponentFixture<PrepareAllowanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareAllowanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareAllowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
