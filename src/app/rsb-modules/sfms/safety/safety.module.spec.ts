import { SafetyModule } from './safety.module';

describe('SafetyModule', () => {
  let safetyModule: SafetyModule;

  beforeEach(() => {
    safetyModule = new SafetyModule();
  });

  it('should create an instance', () => {
    expect(safetyModule).toBeTruthy();
  });
});
