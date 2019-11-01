import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareCampusComponent } from './prepare-campus.component';

describe('PrepareCampusComponent', () => {
  let component: PrepareCampusComponent;
  let fixture: ComponentFixture<PrepareCampusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareCampusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareCampusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
