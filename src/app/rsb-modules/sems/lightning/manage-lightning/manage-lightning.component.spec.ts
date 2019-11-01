import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLightningComponent } from './manage-lightning.component';

describe('ManageLightningComponent', () => {
  let component: ManageLightningComponent;
  let fixture: ComponentFixture<ManageLightningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLightningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLightningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
