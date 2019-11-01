import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCommonAreaComponent } from './manage-common-area.component';

describe('ManageCommonAreaComponent', () => {
  let component: ManageCommonAreaComponent;
  let fixture: ComponentFixture<ManageCommonAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCommonAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCommonAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
