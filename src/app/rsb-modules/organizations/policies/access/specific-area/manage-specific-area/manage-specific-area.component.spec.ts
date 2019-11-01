import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSpecificAreaComponent } from './manage-specific-area.component';

describe('ManageSpecificAreaComponent', () => {
  let component: ManageSpecificAreaComponent;
  let fixture: ComponentFixture<ManageSpecificAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSpecificAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSpecificAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
