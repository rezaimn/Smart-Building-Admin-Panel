import { LnrModule } from './lnr.module';

describe('LnrModule', () => {
  let lnrModule: LnrModule;

  beforeEach(() => {
    lnrModule = new LnrModule();
  });

  it('should create an instance', () => {
    expect(lnrModule).toBeTruthy();
  });
});
