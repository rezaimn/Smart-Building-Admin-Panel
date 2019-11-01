import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStructureComponent } from './manage-structure.component';

describe('ManageStructureComponent', () => {
  let component: ManageStructureComponent;
  let fixture: ComponentFixture<ManageStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
