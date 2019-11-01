import { PlugModule } from './plug.module';

describe('PlugModule', () => {
  let plugModule: PlugModule;

  beforeEach(() => {
    plugModule = new PlugModule();
  });

  it('should create an instance', () => {
    expect(plugModule).toBeTruthy();
  });
});
