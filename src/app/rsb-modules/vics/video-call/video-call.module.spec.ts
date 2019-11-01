import { VideoCallModule } from './video-call.module';

describe('VideoCallModule', () => {
  let videoCallModule: VideoCallModule;

  beforeEach(() => {
    videoCallModule = new VideoCallModule();
  });

  it('should create an instance', () => {
    expect(videoCallModule).toBeTruthy();
  });
});
