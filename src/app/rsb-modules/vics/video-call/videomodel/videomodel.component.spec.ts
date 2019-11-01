import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VideomodelComponent } from './videomodel.component';

//import { PrepareZoneComponent } from './prepare-zone.component';

describe('PrepareZoneComponent', () => {
  let component: VideomodelComponent;
  let fixture: ComponentFixture<VideomodelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideomodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideomodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
