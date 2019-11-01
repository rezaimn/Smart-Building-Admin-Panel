import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLightningComponent } from './view-lightning.component';

describe('ViewLightningComponent', () => {
  let component: ViewLightningComponent;
  let fixture: ComponentFixture<ViewLightningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewLightningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLightningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
