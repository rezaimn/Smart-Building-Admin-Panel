import { VicsModule } from './vics.module';

describe('VicsModule', () => {
  let vicsModule: VicsModule;

  beforeEach(() => {
    vicsModule = new VicsModule();
  });

  it('should create an instance', () => {
    expect(vicsModule).toBeTruthy();
  });
});
