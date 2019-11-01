import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHvacComponent } from './view-hvac.component';

describe('ViewHvacComponent', () => {
  let component: ViewHvacComponent;
  let fixture: ComponentFixture<ViewHvacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewHvacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHvacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
