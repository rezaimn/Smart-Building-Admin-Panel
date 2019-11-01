import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSafetyComponent } from './manage-safety.component';

describe('ManageSafetyComponent', () => {
  let component: ManageSafetyComponent;
  let fixture: ComponentFixture<ManageSafetyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSafetyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSafetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
