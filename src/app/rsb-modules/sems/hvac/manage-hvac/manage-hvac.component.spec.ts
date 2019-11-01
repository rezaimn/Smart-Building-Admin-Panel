import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHvacComponent } from './manage-hvac.component';

describe('ManageHvacComponent', () => {
  let component: ManageHvacComponent;
  let fixture: ComponentFixture<ManageHvacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageHvacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageHvacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
