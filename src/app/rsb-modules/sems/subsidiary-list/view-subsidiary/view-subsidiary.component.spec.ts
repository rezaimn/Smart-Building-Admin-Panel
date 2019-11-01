import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubsidiaryComponent } from './view-subsidiary.component';

describe('ViewSubsidiaryComponent', () => {
  let component: ViewSubsidiaryComponent;
  let fixture: ComponentFixture<ViewSubsidiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSubsidiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubsidiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
