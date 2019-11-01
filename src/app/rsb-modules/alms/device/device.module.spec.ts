import { DeviceConModule } from './device.module';

describe('DeviceConModule', () => {
  let deviceModule: DeviceConModule;

  beforeEach(() => {
    deviceModule = new DeviceConModule();
  });

  it('should create an instance', () => {
    expect(deviceModule).toBeTruthy();
  });
});
