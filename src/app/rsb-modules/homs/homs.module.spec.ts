import { HomsModule } from './homs.module';

describe('HomsModule', () => {
  let homsModule: HomsModule;

  beforeEach(() => {
    homsModule = new HomsModule();
  });

  it('should create an instance', () => {
    expect(homsModule).toBeTruthy();
  });
});
