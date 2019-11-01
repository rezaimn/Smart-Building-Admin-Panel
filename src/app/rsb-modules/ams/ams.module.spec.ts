import { AmsModule } from './ams.module';

describe('AmsModule', () => {
  let amsModule: AmsModule;

  beforeEach(() => {
    amsModule = new AmsModule();
  });

  it('should create an instance', () => {
    expect(amsModule).toBeTruthy();
  });
});
