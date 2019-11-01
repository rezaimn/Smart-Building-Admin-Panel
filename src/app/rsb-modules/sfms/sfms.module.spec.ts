import { SfmsModule } from './sfms.module';

describe('SfmsModule', () => {
  let sfmsModule: SfmsModule;

  beforeEach(() => {
    sfmsModule = new SfmsModule();
  });

  it('should create an instance', () => {
    expect(sfmsModule).toBeTruthy();
  });
});
