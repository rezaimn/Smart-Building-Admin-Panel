import { CommonAreaModule } from './common-area.module';

describe('CommonAreaModule', () => {
  let commonAreaModule: CommonAreaModule;

  beforeEach(() => {
    commonAreaModule = new CommonAreaModule();
  });

  it('should create an instance', () => {
    expect(commonAreaModule).toBeTruthy();
  });
});
