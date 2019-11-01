import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaLayoutComponent } from './sa-layout.component';

describe('SaLayoutComponent', () => {
  let component: SaLayoutComponent;
  let fixture: ComponentFixture<SaLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
