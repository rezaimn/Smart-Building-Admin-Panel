import { AlmsModule } from './alms.module';

describe('AlmsModule', () => {
  let almsModule: AlmsModule;

  beforeEach(() => {
    almsModule = new AlmsModule();
  });

  it('should create an instance', () => {
    expect(almsModule).toBeTruthy();
  });
});
