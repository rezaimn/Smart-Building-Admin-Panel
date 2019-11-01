import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCampusComponent } from './manage-campus.component';

describe('ManageCampusComponent', () => {
  let component: ManageCampusComponent;
  let fixture: ComponentFixture<ManageCampusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCampusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCampusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
