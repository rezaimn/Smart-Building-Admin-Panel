import { HvacModule } from './hvac.module';

describe('HvacModule', () => {
  let hvacModule: HvacModule;

  beforeEach(() => {
    hvacModule = new HvacModule();
  });

  it('should create an instance', () => {
    expect(hvacModule).toBeTruthy();
  });
});
