import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareCommonAreaComponent } from './prepare-common-area.component';

describe('PrepareCommonAreaComponent', () => {
  let component: PrepareCommonAreaComponent;
  let fixture: ComponentFixture<PrepareCommonAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareCommonAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareCommonAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
