import { DeviceModule } from './device.module';

describe('JobsModule', () => {
  let deviceModule: DeviceModule;

  beforeEach(() => {
    deviceModule = new DeviceModule();
  });

  it('should create an instance', () => {
    expect(deviceModule).toBeTruthy();
  });
});
