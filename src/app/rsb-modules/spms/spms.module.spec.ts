import { SpmsModule } from './spms.module';

describe('SpmsModule', () => {
  let spmsModule: SpmsModule;

  beforeEach(() => {
    spmsModule = new SpmsModule();
  });

  it('should create an instance', () => {
    expect(spmsModule).toBeTruthy();
  });
});
