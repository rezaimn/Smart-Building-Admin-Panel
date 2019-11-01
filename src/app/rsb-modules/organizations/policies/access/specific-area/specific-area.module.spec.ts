import { SpecificAreaModule } from './specific-area.module';

describe('SpecificAreaModule', () => {
  let specificAreaModule: SpecificAreaModule;

  beforeEach(() => {
    specificAreaModule = new SpecificAreaModule();
  });

  it('should create an instance', () => {
    expect(specificAreaModule).toBeTruthy();
  });
});
