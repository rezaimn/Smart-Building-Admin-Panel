import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareSubsidiaryComponent } from './prepare-subsidiary.component';

describe('PrepareSubsidiaryComponent', () => {
  let component: PrepareSubsidiaryComponent;
  let fixture: ComponentFixture<PrepareSubsidiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareSubsidiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareSubsidiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
