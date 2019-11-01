import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureOtpComponent } from './secure-otp.component';

describe('SecureOtpComponent', () => {
  let component: SecureOtpComponent;
  let fixture: ComponentFixture<SecureOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecureOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecureOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
