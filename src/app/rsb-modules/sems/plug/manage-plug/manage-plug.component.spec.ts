import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePlugComponent } from './manage-plug.component';

describe('ManagePlugComponent', () => {
  let component: ManagePlugComponent;
  let fixture: ComponentFixture<ManagePlugComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePlugComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePlugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
