import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareStructureComponent } from './prepare-structure.component';

describe('PrepareStructureComponent', () => {
  let component: PrepareStructureComponent;
  let fixture: ComponentFixture<PrepareStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
