import { SsmsModule } from './ssms.module';

describe('SsmsModule', () => {
  let ssmsModule: SsmsModule;

  beforeEach(() => {
    ssmsModule = new SsmsModule();
  });

  it('should create an instance', () => {
    expect(ssmsModule).toBeTruthy();
  });
});
