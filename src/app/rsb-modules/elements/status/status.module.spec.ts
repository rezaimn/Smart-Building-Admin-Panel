import { StatusModule } from './status.module';

describe('StatusModule', () => {
  let statusModule: StatusModule;

  beforeEach(() => {
    statusModule = new StatusModule();
  });

  it('should create an instance', () => {
    expect(statusModule).toBeTruthy();
  });
});
