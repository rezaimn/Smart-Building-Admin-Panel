import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareOrganizationComponent } from './prepare-organization.component';

describe('PrepareOrganizationComponent', () => {
  let component: PrepareOrganizationComponent;
  let fixture: ComponentFixture<PrepareOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
