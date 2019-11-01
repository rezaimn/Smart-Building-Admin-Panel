import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareDesignationComponent } from './prepare-designation.component';

describe('PrepareDesignationComponent', () => {
  let component: PrepareDesignationComponent;
  let fixture: ComponentFixture<PrepareDesignationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareDesignationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
