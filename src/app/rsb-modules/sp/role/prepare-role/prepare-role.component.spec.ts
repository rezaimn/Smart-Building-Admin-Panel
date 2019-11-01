import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareRoleComponent } from './prepare-role.component';

describe('PrepareRoleComponent', () => {
  let component: PrepareRoleComponent;
  let fixture: ComponentFixture<PrepareRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
